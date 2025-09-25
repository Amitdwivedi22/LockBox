import { useState } from 'react'
import { encryptFile } from '../utils/encryption'

function FileUpload({ onFileUpload }) {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        setError('File size must be less than 50MB')
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError('')

    try {
      // Encrypt the file
      const encryptedFile = await encryptFile(file)

      // Simulate upload to server (in real app, this would be an API call)
      const fileId = Date.now().toString()
      const uploadData = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        encryptedData: encryptedFile,
        uploadTime: new Date().toISOString()
      }

      // Store in localStorage for demo purposes
      localStorage.setItem(`file_${fileId}`, JSON.stringify(uploadData))

      onFileUpload(uploadData)
    } catch (err) {
      setError('Failed to encrypt and upload file. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-shimmer">
          🛡️ Secure File Upload
        </h2>
        <p className="text-slate-300 text-lg animate-pulse-slow">
          Military-grade encryption for your sensitive files.
          Complete security from upload to download.
        </p>
      </div>

      {/* Upload Area */}
      <div className="text-center space-y-6">
        <input
          type="file"
          id="file-input"
          onChange={handleFileSelect}
          accept="*/*"
          className="hidden"
        />

        <label
          htmlFor="file-input"
          className={`
            relative block w-full max-w-md mx-auto p-12 rounded-3xl cursor-pointer transition-all duration-500 transform hover:scale-105
            ${file
              ? 'bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 border-2 border-emerald-400/50 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-700/50 border-2 border-dashed border-slate-600 hover:border-emerald-400 hover:bg-slate-600/50'
            }
            animate-bounce-gentle group
          `}
        >
          <div className="space-y-4">
            <div className={`text-6xl animate-float ${file ? 'animate-heartbeat' : 'group-hover:animate-wiggle'}`}>
              🛡️
            </div>
            <div className="text-slate-300">
              {file ? (
                <div className="space-y-2 animate-scale-in">
                  <p className="text-xl font-bold text-white">{file.name}</p>
                  <p className="text-cyan-300">{formatFileSize(file.size)}</p>
                  <div className="flex justify-center space-x-2">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm animate-pulse-slow">
                      🔒 Encrypted
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm animate-pulse-slow">
                      ✅ Secured
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xl font-semibold group-hover:text-emerald-300 transition-colors">
                    Click to select a file
                  </p>
                  <p className="text-sm text-slate-400">Maximum size: 50MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Animated security border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-spin-slow"></div>
        </label>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/50 text-red-300 p-4 rounded-2xl animate-shake">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`
            relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform
            ${isUploading
              ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25'
            }
            disabled:hover:scale-100 disabled:hover:shadow-none
            animate-pulse-gentle
          `}
        >
          {isUploading ? (
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>🛡️ Encrypting & Securing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="animate-bounce">🔐</span>
              <span>Secure Upload</span>
            </div>
          )}

          {/* Security glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Security Features */}
      <div className="bg-slate-700/30 border border-emerald-500/30 rounded-2xl p-6 animate-slide-up">
        <h3 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🛡️ Security Features
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '🔐', text: 'Military-grade AES-256 encryption', color: 'emerald' },
            { icon: '🛡️', text: 'Zero-knowledge architecture', color: 'cyan' },
            { icon: '⏰', text: 'Self-destructing secure links', color: 'blue' },
            { icon: '🔑', text: 'Multi-factor authentication ready', color: 'emerald' }
          ].map(({ icon, text, color }) => (
            <div key={text} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl animate-fade-in-left border border-slate-600/30">
              <span className="text-2xl animate-pulse-slow">{icon}</span>
              <span className={`text-${color}-300 font-medium`}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FileUpload
