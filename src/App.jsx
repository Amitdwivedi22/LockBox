import { useState } from 'react'
import FileUpload from './components/FileUpload'
import LinkGenerator from './components/LinkGenerator'
import FileReceiver from './components/FileReceiver'
import AuditLogs from './components/AuditLogs'

function App() {
  const [currentPage, setCurrentPage] = useState('upload')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [generatedLink, setGeneratedLink] = useState('')

  const handleFileUpload = (file) => {
    setUploadedFile(file)
    setCurrentPage('generate')
  }

  const handleLinkGenerated = (link) => {
    setGeneratedLink(link)
    setCurrentPage('share')
  }

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'upload':
        return <FileUpload onFileUpload={handleFileUpload} />
      case 'generate':
        return <LinkGenerator file={uploadedFile} onLinkGenerated={handleLinkGenerated} />
      case 'share':
        return <FileReceiver link={generatedLink} />
      case 'logs':
        return <AuditLogs />
      default:
        return <FileUpload onFileUpload={handleFileUpload} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 animate-morph">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 min-h-screen">
        {/* Header */}
        <header className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 mb-8 shadow-2xl animate-slide-down">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-shimmer">
            🔐 Secure File Vault
          </h1>

          <nav className="flex flex-wrap justify-center gap-3">
            {[
              { key: 'upload', label: 'Upload File', icon: '📁' },
              { key: 'generate', label: 'Generate Link', icon: '🔗', disabled: !uploadedFile },
              { key: 'share', label: 'Share Link', icon: '📤', disabled: !generatedLink },
              { key: 'logs', label: 'Audit Logs', icon: '📊' }
            ].map(({ key, label, icon, disabled }) => (
              <button
                key={key}
                onClick={() => setCurrentPage(key)}
                disabled={disabled}
                className={`
                  relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105
                  ${currentPage === key
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 animate-pulse-gentle'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/30'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'hover:shadow-lg'}
                  animate-bounce-gentle
                `}
              >
                <span className="animate-wiggle">{icon}</span> {label}
                {currentPage === key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30 animate-pulse-slow"></div>
                )}
              </button>
            ))}
          </nav>
        </header>

        {/* Main Content */}
        <main className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl min-h-[600px] animate-fade-in-up">
          <div className="animate-scale-in">
            {renderCurrentPage()}
          </div>
        </main>

        {/* Floating particles */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-ping-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
