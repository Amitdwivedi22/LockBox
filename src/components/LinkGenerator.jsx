import { useState } from 'react'
import { generateRSAKeyPair, encryptWithRSA } from '../utils/encryption'

function LinkGenerator({ file, onLinkGenerated }) {
  const [expirationType, setExpirationType] = useState('time')
  const [expirationTime, setExpirationTime] = useState('24')
  const [downloadLimit, setDownloadLimit] = useState('1')
  const [requirePassword, setRequirePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [requireOTP, setRequireOTP] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

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

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-shimmer">
          🔗 Generate Secure Link
        </h2>
        <p className="text-gray-300 text-lg animate-pulse-slow">
          Configure your secure, self-destructing link for: <strong className="text-white animate-pulse">{file.name}</strong>
        </p>
      </div>

      {/* File Info */}
      <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/50 rounded-2xl p-6 animate-slide-up">
        <div className="flex flex-wrap justify-center items-center gap-4 text-center">
          <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-xl animate-bounce-gentle">
            <span className="text-2xl">📄</span>
            <span className="text-white font-semibold">{file.name}</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-xl animate-bounce-gentle">
            <span className="text-2xl">📏</span>
            <span className="text-purple-300">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-xl animate-bounce-gentle">
            <span className="text-2xl animate-pulse-slow">🔒</span>
            <span className="text-green-300">Encrypted</span>
          </div>
        </div>
      </div>

      {/* Link Settings */}
      <div className="bg-gray-700/30 border border-gray-600/50 rounded-2xl p-6 space-y-6 animate-slide-up">
        <h3 className="text-xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ⚙️ Link Settings
        </h3>

        {/* Expiration Type */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-200">Expiration Type:</label>
          <div className="flex flex-col sm:flex-row gap-4">
            {[
              { value: 'time', label: 'Time-based', icon: '⏰' },
              { value: 'downloads', label: 'Download count', icon: '📥' }
            ].map(({ value, label, icon }) => (
              <label
                key={value}
                className={`
                  relative flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105
                  ${expirationType === value
                    ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-400/50 shadow-lg shadow-purple-500/20'
                    : 'bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/50'
                  }
                  animate-fade-in-left
                `}
              >
                <input
                  type="radio"
                  value={value}
                  checked={expirationType === value}
                  onChange={(e) => setExpirationType(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl animate-bounce-gentle">{icon}</span>
                <span className="text-gray-200 font-medium">{label}</span>
                {expirationType === value && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-20 animate-pulse-slow"></div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Expiration Time/Download Limit */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-200">
            {expirationType === 'time' ? 'Expiration Time:' : 'Download Limit:'}
          </label>
          <select
            value={expirationType === 'time' ? expirationTime : downloadLimit}
            onChange={(e) => expirationType === 'time' ? setExpirationTime(e.target.value) : setDownloadLimit(e.target.value)}
            className="w-full p-4 bg-gray-800/50 border-2 border-gray-600/50 rounded-xl text-white focus:border-purple-400 focus:outline-none transition-all duration-300 animate-scale-in"
          >
            {getExpirationOptions().map(option => (
              <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Security */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-200">Additional Security:</label>
          <div className="space-y-3">
            {[
              { key: 'password', label: 'Require password', icon: '🔑' },
              { key: 'otp', label: 'Require OTP verification', icon: '📱' }
            ].map(({ key, label, icon }) => (
              <label
                key={key}
                className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-700/50 animate-fade-in-right"
              >
                <input
                  type="checkbox"
                  checked={key === 'password' ? requirePassword : requireOTP}
                  onChange={(e) => key === 'password' ? setRequirePassword(e.target.checked) : setRequireOTP(e.target.checked)}
                  className="w-5 h-5 accent-purple-400 animate-pulse-slow"
                />
                <span className="text-2xl animate-bounce-gentle">{icon}</span>
                <span className="text-gray-200 font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Password Input */}
        {requirePassword && (
          <div className="space-y-4 animate-scale-in">
            <label className="block text-lg font-semibold text-gray-200">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password for link access"
              className="w-full p-4 bg-gray-800/50 border-2 border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-all duration-300"
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
          relative w-full px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform
          ${isGenerating
            ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25'
          }
          disabled:hover:scale-100 disabled:hover:shadow-none
          animate-pulse-gentle
        `}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>🔐 Generating Secure Link...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span className="animate-bounce">🚀</span>
            <span>Generate Secure Link</span>
          </div>
        )}

        {/* Button glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl blur opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
      </button>

      {/* Security Features */}
      <div className="bg-gray-700/30 border border-gray-600/50 rounded-2xl p-6 animate-slide-up">
        <h4 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          🔒 Security Features
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '🔐', text: 'RSA-encrypted file access', color: 'cyan' },
            { icon: '⏰', text: 'Self-destructing links', color: 'blue' },
            { icon: '🔑', text: 'Optional password protection', color: 'purple' },
            { icon: '📱', text: 'OTP verification available', color: 'green' },
            { icon: '📊', text: 'Complete audit trail', color: 'yellow' }
          ].map(({ icon, text, color }) => (
            <div key={text} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-xl animate-fade-in-left">
              <span className="text-2xl animate-pulse-slow">{icon}</span>
              <span className={`text-${color}-300 font-medium`}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LinkGenerator
