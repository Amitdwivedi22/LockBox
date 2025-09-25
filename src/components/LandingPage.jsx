import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

const LandingPage = ({ onAuthenticated }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  const securityQuotes = [
    "Security is not a product, but a process.",
    "The best encryption is the one you don't even know exists.",
    "Trust, but verify. Encrypt, then share.",
    "Your data's safety is our highest priority.",
    "In cybersecurity, there are no second chances.",
    "Encryption is the castle wall of the digital age."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % securityQuotes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        {/* Login Button - Top Left Corner */}
        <div className="absolute top-4 left-4 z-30">
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-emerald-500/25 animate-pulse-gentle"
          >
            <span>🔐</span>
            Login
          </button>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* 3D Security Vault Model */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 animate-float-3d">
            <div className="relative w-full h-full">
              {/* Main Vault Body */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl transform rotate-45 animate-spin-slow">
                <div className="absolute inset-4 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl">
                  <div className="absolute inset-2 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg">
                    {/* Lock Mechanism */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-lg animate-pulse-slow">
                      <div className="absolute inset-2 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full">
                        <div className="absolute inset-3 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full animate-ping">
                          <div className="absolute inset-1 bg-emerald-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    {/* Security Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="grid grid-cols-8 gap-1 h-full p-2">
                        {[...Array(64)].map((_, i) => (
                          <div key={i} className="bg-emerald-400 rounded-sm animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 3D Depth Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl transform translate-y-4"></div>
            </div>
          </div>

          {/* Floating Security Icons */}
          <div className="absolute top-20 right-20 text-6xl animate-float opacity-30">🛡️</div>
          <div className="absolute bottom-32 left-20 text-5xl animate-float opacity-30" style={{animationDelay: '1s'}}>🔒</div>
          <div className="absolute top-1/3 right-1/4 text-4xl animate-float opacity-30" style={{animationDelay: '2s'}}>🔐</div>

          {/* Security Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-40 animate-ping-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-8">
          <div className="text-center max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="mb-16">
              <h1 className="text-7xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-shimmer">
                Secure File Vault
              </h1>

              {/* Animated Security Quote */}
              <div className="mb-12 h-16 flex items-center justify-center">
                <p className="text-xl md:text-2xl text-slate-300 italic font-medium animate-fade-in-up max-w-2xl leading-relaxed">
                  "{securityQuotes[currentQuote]}"
                </p>
              </div>

              <div className="flex justify-center items-center gap-6 text-emerald-400 animate-pulse-slow mb-12">
                <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
                <span className="text-xl font-medium">Military-Grade Encryption</span>
                <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Feature Cards with Enhanced Animations */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-slate-800/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 shadow-2xl shadow-emerald-500/10 animate-fade-in-up hover:scale-105 transition-transform duration-300">
                <div className="text-5xl mb-6 animate-bounce-gentle">🛡️</div>
                <h3 className="text-2xl font-bold text-white mb-4">Secure Upload</h3>
                <p className="text-slate-400 text-lg">Upload your files with military-grade encryption and secure storage.</p>
              </div>
              <div className="bg-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10 animate-fade-in-up hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.3s'}}>
                <div className="text-5xl mb-6 animate-bounce-gentle" style={{animationDelay: '0.5s'}}>🔗</div>
                <h3 className="text-2xl font-bold text-white mb-4">Generate Links</h3>
                <p className="text-slate-400 text-lg">Create secure sharing links with customizable access controls.</p>
              </div>
              <div className="bg-slate-800/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-500/10 animate-fade-in-up hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.6s'}}>
                <div className="text-5xl mb-6 animate-bounce-gentle" style={{animationDelay: '1s'}}>📊</div>
                <h3 className="text-2xl font-bold text-white mb-4">Audit Logs</h3>
                <p className="text-slate-400 text-lg">Complete audit trail of all file activities and access attempts.</p>
              </div>
            </div>

            {/* Enhanced CTA Section */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-500/30 rounded-3xl p-10 mb-12 backdrop-blur-xl">
              <h2 className="text-4xl font-bold text-white mb-6 animate-shimmer">Ready to Secure Your Files?</h2>
              <p className="text-slate-300 mb-8 text-xl max-w-2xl mx-auto">Join thousands of users who trust our platform for their sensitive data.</p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-emerald-500/25 animate-pulse-gentle"
              >
                Get Started Securely
              </button>
            </div>

            {/* Enhanced Security Features Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800/60 border border-slate-600/50 rounded-2xl p-8 backdrop-blur-xl hover:bg-slate-800/80 transition-all duration-300">
                <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-3">
                  <span className="text-2xl animate-spin-slow">🔒</span>
                  Security Features
                </h3>
                <ul className="text-slate-400 space-y-3 text-lg">
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-400">✓</span>
                    AES-256 encryption
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-400">✓</span>
                    Zero-knowledge architecture
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-400">✓</span>
                    Secure key management
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-400">✓</span>
                    SOC 2 compliance ready
                  </li>
                </ul>
              </div>
              <div className="bg-slate-800/60 border border-slate-600/50 rounded-2xl p-8 backdrop-blur-xl hover:bg-slate-800/80 transition-all duration-300">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
                  <span className="text-2xl animate-pulse-slow">⚡</span>
                  Performance
                </h3>
                <ul className="text-slate-400 space-y-3 text-lg">
                  <li className="flex items-center gap-3">
                    <span className="text-cyan-400">✓</span>
                    Fast upload/download speeds
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-cyan-400">✓</span>
                    Global CDN distribution
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-cyan-400">✓</span>
                    Optimized for large files
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-cyan-400">✓</span>
                    Real-time synchronization
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onAuthenticated={onAuthenticated}
        />
      )}
    </>
  );
};

export default LandingPage;
