import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './components/LandingPage'
import FileUpload from './components/FileUpload'
import LinkGenerator from './components/LinkGenerator'
import FileReceiver from './components/FileReceiver'
import AuditLogs from './components/AuditLogs'



function App() {
  const { user, logout } = useAuth()
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

  const handleLogout = async () => {
    await logout()
    setCurrentPage('upload')
    setUploadedFile(null)
    setGeneratedLink('')
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

  // If user is not authenticated, show landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 animate-morph">
        {/* Security-themed animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-float"></div>
          {/* Security pattern overlay */}
          <div className="absolute inset-0 opacity-5 animate-slide-up">
            <div className="grid grid-cols-20 gap-4 h-full">
              {[...Array(400)].map((_, i) => (
                <div key={i} className="text-emerald-400 text-xs">🔒</div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 min-h-screen">
          <LandingPage onAuthenticated={() => {}} />
        </div>

        {/* Enhanced floating security elements */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Security badges */}
          <div className="absolute top-20 left-10 text-emerald-400/20 animate-float">
            <div className="text-4xl">🛡️</div>
          </div>
          <div className="absolute top-40 right-20 text-cyan-400/20 animate-float" style={{animationDelay: '1s'}}>
            <div className="text-3xl">🔐</div>
          </div>
          <div className="absolute bottom-40 left-20 text-blue-400/20 animate-float" style={{animationDelay: '2s'}}>
            <div className="text-3xl">🔒</div>
          </div>

          {/* Security particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-30 animate-ping-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    )
  }

  // If user is authenticated, show the dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 animate-morph">
      {/* Security-themed animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-float"></div>
        {/* Security pattern overlay */}
        <div className="absolute inset-0 opacity-5 animate-slide-up">
          <div className="grid grid-cols-20 gap-4 h-full">
            {[...Array(400)].map((_, i) => (
              <div key={i} className="text-emerald-400 text-xs">🔒</div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 min-h-screen">
        {/* Enhanced Security Header */}
        <header className="bg-slate-800/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 mb-8 shadow-2xl shadow-emerald-500/10 animate-slide-down">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="relative">
                <div className="text-6xl animate-bounce-gentle">🔐</div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-shimmer">
              Secure File Vault
            </h1>
            <div className="flex justify-center items-center gap-2 text-emerald-400 animate-pulse-slow">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
              <span className="text-sm font-medium">Military-Grade Security</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* User info and logout */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">{user.displayName || user.email}</p>
                <p className="text-slate-400 text-sm">Authenticated User</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-300 flex items-center gap-2"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>

          <nav className="flex flex-wrap justify-center gap-4">
            {[
              { key: 'upload', label: 'Secure Upload', icon: '🛡️', desc: 'Encrypted Storage' },
              { key: 'generate', label: 'Generate Link', icon: '🔗', desc: 'Secure Sharing', disabled: !uploadedFile },
              { key: 'share', label: 'Access Control', icon: '🔑', desc: 'Protected Access', disabled: !generatedLink },
              { key: 'logs', label: 'Security Logs', icon: '📊', desc: 'Audit Trail' }
            ].map(({ key, label, icon, desc, disabled }) => (
              <button
                key={key}
                onClick={() => setCurrentPage(key)}
                disabled={disabled}
                className={`
                  relative group px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105
                  ${currentPage === key
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/25 animate-pulse-gentle'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white border border-slate-600/30 hover:border-emerald-400/50'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'hover:shadow-lg'}
                  animate-bounce-gentle
                `}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl animate-wiggle">{icon}</span>
                  <span>{label}</span>
                  <span className="text-xs opacity-75">{desc}</span>
                </div>
                {currentPage === key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur opacity-20 animate-pulse-slow"></div>
                )}
                {/* Security indicator */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </button>
            ))}
          </nav>
        </header>

        {/* Enhanced Main Content */}
        <main className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-3xl p-8 shadow-2xl shadow-slate-500/10 min-h-[700px] animate-fade-in-up">
          {/* Security status bar */}
          <div className="flex justify-between items-center mb-6 p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Security Status: Active</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="text-sm">🔒 End-to-End Encrypted</span>
            </div>
          </div>

          <div className="animate-scale-in">
            {renderCurrentPage()}
          </div>
        </main>

        {/* Enhanced floating security elements */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Security badges */}
          <div className="absolute top-20 left-10 text-emerald-400/20 animate-float">
            <div className="text-4xl">🛡️</div>
          </div>
          <div className="absolute top-40 right-20 text-cyan-400/20 animate-float" style={{animationDelay: '1s'}}>
            <div className="text-3xl">🔐</div>
          </div>
          <div className="absolute bottom-40 left-20 text-blue-400/20 animate-float" style={{animationDelay: '2s'}}>
            <div className="text-3xl">🔒</div>
          </div>

          {/* Security particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-30 animate-ping-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
