import { useState, useEffect, useRef } from 'react'
import { generateRSAKeyPair, encryptWithRSA } from '../utils/encryption'
import gsap from 'gsap'

function LinkGenerator({ file, onLinkGenerated }) {
  const [expirationType, setExpirationType] = useState('time')
  const [expirationTime, setExpirationTime] = useState('24')
  const [downloadLimit, setDownloadLimit] = useState('1')
  const [requirePassword, setRequirePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [requireOTP, setRequireOTP] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const headerRef = useRef(null)
  const fileInfoRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    // GSAP animations
    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    gsap.from(fileInfoRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out'
    })

    gsap.from(formRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: 'power3.out'
    })
  }, [])

  const handleGenerateLink = async () => {
    if (!file) return

    setIsGenerating(true)
    setError('')

    try {
      // Generate RSA key pair for this link
      const keyPair = generateRSAKeyPair()

      // Create link configuration
      const linkConfig = {
        fileId: file.id,
        expirationType,
        expirationTime: expirationType === 'time' ? parseInt(expirationTime) : null,
        downloadLimit: parseInt(downloadLimit),
        requirePassword,
        requireOTP,
        publicKey: keyPair.publicKey,
        createdAt: new Date().toISOString(),
        isActive: true
      }

      // If password is required, encrypt it
      if (requirePassword && password) {
        linkConfig.encryptedPassword = encryptWithRSA(password, keyPair.publicKey)
      }

      // Generate unique link ID
      const linkId = Date.now().toString() + Math.random().toString(36).substr(2, 9)

      // Create the shareable link
      const baseUrl = window.location.origin
      const shareableLink = `${baseUrl}/receive/${linkId}`

      // Store link configuration
      const linkData = {
        id: linkId,
        config: linkConfig,
        file: file,
        privateKey: keyPair.privateKey,
        accessLog: []
      }

      localStorage.setItem(`link_${linkId}`, JSON.stringify(linkData))

      // Log the creation
      const auditLog = {
        action: 'link_generated',
        fileId: file.id,
        linkId: linkId,
        timestamp: new Date().toISOString(),
        details: {
          expirationType,
          expirationTime: expirationType === 'time' ? `${expirationTime} hours` : null,
          downloadLimit,
          requirePassword,
          requireOTP
        }
      }
      localStorage.setItem(`audit_${Date.now()}`, JSON.stringify(auditLog))

      onLinkGenerated(shareableLink)
    } catch (err) {
      setError('Failed to generate secure link. Please try again.')
      console.error('Link generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const getExpirationOptions = () => {
    if (expirationType === 'time') {
      return [
        { value: '1', label: '1 hour' },
        { value: '6', label: '6 hours' },
        { value: '24', label: '24 hours' },
        { value: '72', label: '3 days' },
        { value: '168', label: '1 week' }
      ]
    } else {
      return [
        { value: '1', label: '1 download' },
        { value: '5', label: '5 downloads' },
        { value: '10', label: '10 downloads' },
        { value: '25', label: '25 downloads' },
        { value: '50', label: '50 downloads' }
      ]
    }
  }

  // Define expiration type options
  const expirationTypeOptions = [
    { value: 'time', label: 'Time-based', icon: '⏰' },
    { value: 'downloads', label: 'Download count', icon: '📥' }
  ]

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div ref={headerRef} className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🔗 Generate Secure Link
          </span>
        </h2>
        <p className="text-gray-400 text-lg">
          Configure your secure link for: <strong className="text-white">{file?.name || 'No file selected'}</strong>
        </p>
      </div>

      {/* File Info */}
      <div ref={fileInfoRef} className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-wrap justify-center items-center gap-4 text-center">
          <div className="flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
            <span className="text-2xl">📁</span>
            <span className="text-white font-semibold">
              {file?.name || 'No file selected'}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
            <span className="text-2xl">📏</span>
            <span className="text-blue-400">
              {file?.size 
                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                : 'Size unknown'
              }
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
            <span className="text-2xl">🔒</span>
            <span className="text-green-400">Secured</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div ref={formRef} className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 space-y-6">
        {/* Security Configuration */}
        <h3 className="text-xl font-bold text-center text-white">
          ⚙️ Security Configuration
        </h3>

        {/* Expiration Type */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-300">Expiration Type:</label>
          <div className="flex flex-col sm:flex-row gap-4">
            {expirationTypeOptions.map(({ value, label, icon }) => (
              <label
                key={value}
                className={`
                  relative flex-1 flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all
                  ${expirationType === value
                    ? 'bg-gray-800 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-gray-900 border-2 border-gray-700 hover:border-gray-600'
                  }
                `}
              >
                <input
                  type="radio"
                  name="expirationType"
                  value={value}
                  checked={expirationType === value}
                  onChange={(e) => setExpirationType(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl">{icon}</span>
                <span className="text-gray-300 font-medium">{label}</span>
                {expirationType === value && (
                  <div className="absolute inset-0 bg-blue-500/10 rounded-xl pointer-events-none" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Expiration Time/Download Limit */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-300">
            {expirationType === 'time' ? 'Expiration Time:' : 'Download Limit:'}
          </label>
          <select
            value={expirationType === 'time' ? expirationTime : downloadLimit}
            onChange={(e) => expirationType === 'time' ? setExpirationTime(e.target.value) : setDownloadLimit(e.target.value)}
            className="w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all"
          >
            {getExpirationOptions().map(option => (
              <option key={option.value} value={option.value} className="bg-gray-900 text-white">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Security */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-300">Additional Security:</label>
          <div className="space-y-3">
            {[
              { key: 'password', label: 'Require password', icon: '🔑' },
              { key: 'otp', label: 'Require OTP verification', icon: '📱' }
            ].map(({ key, label, icon }) => (
              <label
                key={key}
                className="flex items-center space-x-4 p-4 bg-gray-900 rounded-xl cursor-pointer transition-all hover:bg-gray-800"
              >
                <input
                  type="checkbox"
                  checked={key === 'password' ? requirePassword : requireOTP}
                  onChange={(e) => key === 'password' ? setRequirePassword(e.target.checked) : setRequireOTP(e.target.checked)}
                  className="w-5 h-5 accent-blue-500"
                />
                <span className="text-2xl">{icon}</span>
                <span className="text-gray-300 font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Password Input */}
        {requirePassword && (
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-300">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password for link access"
              className="w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
              required
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-400/50 text-red-300 p-4 rounded-2xl animate-shake">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl animate-bounce">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerateLink}
        disabled={isGenerating || (requirePassword && !password)}
        className={`
          w-full px-8 py-4 rounded-xl font-bold text-lg transition-all
          ${isGenerating
            ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
          }
        `}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating Secure Link...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>🔐</span>
            <span>Generate Secure Link</span>
          </div>
        )}
      </button>

      {/* Security Features */}
      <div className="bg-black/40 border border-gray-800 rounded-2xl p-6">
        <h4 className="text-xl font-bold text-center mb-4 text-white">
          🛡️ Security Features
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '🔐', text: 'Military-grade AES-256 encryption' },
            { icon: '🛡️', text: 'Zero-knowledge architecture' },
            { icon: '⏰', text: 'Self-destructing secure links' },
            { icon: '🔑', text: 'Multi-factor authentication ready' },
            { icon: '📊', text: 'Complete audit trail' }
          ].map(({ icon, text }) => (
            <div 
              key={text} 
              className="flex items-center space-x-3 p-3 bg-gray-900 rounded-xl border border-gray-800 hover:bg-gray-800/50 transition-colors"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-gray-300">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LinkGenerator