import { useState, useEffect } from 'react'
import { decryptFile, decryptWithRSA } from '../utils/encryption'

function FileReceiver({ link }) {
  const [linkData, setLinkData] = useState(null)
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState('')
  const [accessGranted, setAccessGranted] = useState(false)
  const [downloadCount, setDownloadCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState('')

  // Extract link ID from the URL
  const linkId = link.split('/receive/')[1]

  useEffect(() => {
    if (linkId) {
      loadLinkData(linkId)
    }
  }, [linkId])

  useEffect(() => {
    if (linkData && linkData.config.expirationType === 'time') {
      const timer = setInterval(() => {
        updateTimeRemaining()
      }, 1000)
      updateTimeRemaining()
      return () => clearInterval(timer)
    }
  }, [linkData])

  const loadLinkData = (id) => {
    const data = localStorage.getItem(`link_${id}`)
    if (data) {
      const parsedData = JSON.parse(data)
      setLinkData(parsedData)
      setDownloadCount(parsedData.accessLog.length)

      // Check if link is still active
      if (!parsedData.config.isActive) {
        setError('This link has been deactivated.')
        return
      }

      // Check download limit
      if (parsedData.config.expirationType === 'downloads' &&
          parsedData.accessLog.length >= parsedData.config.downloadLimit) {
        setError('This link has reached its download limit.')
        return
      }

      // Check time expiration
      if (parsedData.config.expirationType === 'time') {
        const createdAt = new Date(parsedData.config.createdAt)
        const expirationTime = parsedData.config.expirationTime
        const now = new Date()
        const expirationDate = new Date(createdAt.getTime() + expirationTime * 60 * 60 * 1000)

        if (now > expirationDate) {
          setError('This link has expired.')
          return
        }
      }
    } else {
      setError('Invalid or expired link.')
    }
  }

  const updateTimeRemaining = () => {
    if (!linkData || linkData.config.expirationType !== 'time') return

    const createdAt = new Date(linkData.config.createdAt)
    const expirationTime = linkData.config.expirationTime
    const expirationDate = new Date(createdAt.getTime() + expirationTime * 60 * 60 * 1000)
    const now = new Date()
    const timeLeft = expirationDate - now

    if (timeLeft <= 0) {
      setError('This link has expired.')
      setTimeRemaining('Expired')
    } else {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
    }
  }

  const handleAccessRequest = async () => {
    if (!linkData) return

    setIsVerifying(true)
    setError('')

    try {
      // Verify password if required
      if (linkData.config.requirePassword) {
        if (!password) {
          setError('Password is required.')
          return
        }

        // In a real app, you'd decrypt the stored password and compare
        // For demo, we'll just check if password matches a simple pattern
        const decryptedPassword = decryptWithRSA(linkData.config.encryptedPassword, linkData.privateKey)
        if (password !== decryptedPassword) {
          setError('Invalid password.')
          return
        }
      }

      // Simulate OTP verification
      if (linkData.config.requireOTP) {
        if (!otp || otp.length !== 6) {
          setError('Please enter a valid 6-digit OTP.')
          return
        }
        // In a real app, you'd verify the OTP with your backend
      }

      setAccessGranted(true)

      // Log the access attempt
      const accessLog = {
        action: 'access_granted',
        linkId: linkId,
        timestamp: new Date().toISOString(),
        ip: 'demo-ip', // In real app, get actual IP
        userAgent: navigator.userAgent
      }
      localStorage.setItem(`audit_${Date.now()}`, JSON.stringify(accessLog))

    } catch (err) {
      setError('Access verification failed. Please try again.')
      console.error('Access verification error:', err)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDownload = async () => {
    if (!linkData || !accessGranted) return

    setIsDownloading(true)
    setError('')

    try {
      // Decrypt and download the file
      const decryptedFile = await decryptFile(linkData.file)

      // Create download link
      const url = URL.createObjectURL(decryptedFile.blob)
      const a = document.createElement('a')
      a.href = url
      a.download = decryptedFile.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Log the download
      const downloadLog = {
        action: 'file_downloaded',
        linkId: linkId,
        fileId: linkData.file.id,
        timestamp: new Date().toISOString(),
        fileName: decryptedFile.name
      }
      localStorage.setItem(`audit_${Date.now()}`, JSON.stringify(downloadLog))

      // Update download count
      const updatedAccessLog = [...linkData.accessLog, downloadLog]
      const updatedLinkData = { ...linkData, accessLog: updatedAccessLog }
      localStorage.setItem(`link_${linkId}`, JSON.stringify(updatedLinkData))
      setDownloadCount(updatedAccessLog.length)

      // Check if download limit reached
      if (linkData.config.expirationType === 'downloads' &&
          updatedAccessLog.length >= linkData.config.downloadLimit) {
        // Deactivate link
        updatedLinkData.config.isActive = false
        localStorage.setItem(`link_${linkId}`, JSON.stringify(updatedLinkData))

        const deactivationLog = {
          action: 'link_deactivated',
          linkId: linkId,
          reason: 'download_limit_reached',
          timestamp: new Date().toISOString()
        }
        localStorage.setItem(`audit_${Date.now()}`, JSON.stringify(deactivationLog))

        setError('Download limit reached. Link has been deactivated.')
      }

    } catch (err) {
      setError('Failed to download file. Please try again.')
      console.error('Download error:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  if (!linkData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 animate-pulse-slow">
          <div className="text-6xl animate-spin">🔍</div>
          <p className="text-xl text-gray-300 font-semibold">Verifying link...</p>
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !accessGranted) {
    return (
      <div className="text-center space-y-6 animate-shake">
        <div className="bg-red-500/20 border border-red-400/50 text-red-300 p-8 rounded-3xl">
          <div className="text-6xl mb-4 animate-bounce">❌</div>
          <h3 className="text-2xl font-bold mb-2">Access Denied</h3>
          <p className="text-lg">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 animate-pulse-gentle"
        >
          🔄 Try Another Link
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-shimmer">
          🔐 Secure File Access
        </h2>
        <p className="text-gray-300 text-lg animate-pulse-slow">
          Verify your identity to access the encrypted file
        </p>
      </div>

      {!accessGranted ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* File Preview */}
          <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/50 rounded-2xl p-6 animate-slide-up">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-float">📄</div>
              <h3 className="text-2xl font-bold text-white">{linkData.file.name}</h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full animate-pulse-slow">
                  📏 {(linkData.file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full animate-pulse-slow">
                  🔒 End-to-end encrypted
                </span>
              </div>
            </div>
          </div>

          {/* Link Information */}
          <div className="bg-gray-700/30 border border-gray-600/50 rounded-2xl p-6 animate-slide-up">
            <h4 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              🔗 Link Information
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-center">
              <div className="bg-gray-800/50 p-4 rounded-xl animate-fade-in-left">
                <p className="text-gray-300">Expiration:</p>
                <p className="text-white font-bold text-lg">
                  {linkData.config.expirationType === 'time'
                    ? `${linkData.config.expirationTime} hours`
                    : `${linkData.config.downloadLimit} downloads`
                  }
                </p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl animate-fade-in-right">
                <p className="text-gray-300">Downloads used:</p>
                <p className="text-white font-bold text-lg">{downloadCount}</p>
              </div>
              {linkData.config.expirationType === 'time' && (
                <div className="bg-gray-800/50 p-4 rounded-xl animate-pulse-slow md:col-span-2">
                  <p className="text-gray-300">Time remaining:</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {timeRemaining}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Password Input */}
          {linkData.config.requirePassword && (
            <div className="space-y-4 animate-scale-in">
              <label className="block text-lg font-semibold text-gray-200 text-center">
                🔑 Enter Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the access password"
                className="w-full p-4 bg-gray-800/50 border-2 border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-all duration-300 text-center"
              />
            </div>
          )}

          {/* OTP Input */}
          {linkData.config.requireOTP && (
            <div className="space-y-4 animate-scale-in">
              <label className="block text-lg font-semibold text-gray-200 text-center">
                📱 Enter OTP:
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="w-full p-4 bg-gray-800/50 border-2 border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-all duration-300 text-center text-2xl font-mono tracking-widest"
              />
            </div>
          )}

          {/* Access Button */}
          <button
            onClick={handleAccessRequest}
            disabled={isVerifying || (linkData.config.requirePassword && !password) || (linkData.config.requireOTP && !otp)}
            className={`
              relative w-full px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform
              ${isVerifying
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25'
              }
              disabled:hover:scale-100 disabled:hover:shadow-none
              animate-pulse-gentle
            `}
          >
            {isVerifying ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>🔐 Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="animate-bounce">🔓</span>
                <span>Access File</span>
              </div>
            )}

            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6 text-center animate-scale-in">
          {/* Success Message */}
          <div className="bg-green-500/20 border border-green-400/50 text-green-300 p-8 rounded-3xl animate-heartbeat">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h3 className="text-2xl font-bold mb-2">Access Granted!</h3>
            <p className="text-lg">You can now download the file.</p>
          </div>

          {/* File Info */}
          <div className="bg-gray-700/30 border border-gray-600/50 rounded-2xl p-6 animate-slide-up">
            <div className="text-6xl mb-4 animate-float">📄</div>
            <h3 className="text-2xl font-bold text-white mb-2">{linkData.file.name}</h3>
            <p className="text-purple-300 text-lg">📏 {(linkData.file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p className="text-green-300 mt-2">🔒 Encrypted file ready for download</p>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`
              relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform
              ${isDownloading
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-green-500/25'
              }
              disabled:hover:scale-100 disabled:hover:shadow-none
              animate-pulse-gentle
            `}
          >
            {isDownloading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>📥 Downloading...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="animate-bounce">📥</span>
                <span>Download File</span>
              </div>
            )}

            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-purple-400 rounded-2xl blur opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
          </button>

          {/* Security Notice */}
          <div className="bg-gray-700/30 border border-gray-600/50 rounded-2xl p-6 animate-slide-up">
            <h4 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              🔒 Security Notice
            </h4>
            <div className="space-y-3">
              {[
                { icon: '🔐', text: 'File will be decrypted on your device only' },
                { icon: '🖥️', text: 'Original file remains encrypted on server' },
                { icon: '⏰', text: 'Link may expire after download' }
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center justify-center space-x-3 p-2 animate-fade-in-up">
                  <span className="text-2xl animate-pulse-slow">{icon}</span>
                  <span className="text-gray-300">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileReceiver
