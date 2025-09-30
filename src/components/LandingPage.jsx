import { useState, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';

const LandingPage = ({ onAuthenticated, onNavigateAuth }) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const quoteRef = useRef(null);
  const heroRef = useRef(null);
  const particlesRef = useRef(null);

  const securityQuotes = useMemo(() => [
    {
      line1: "Security is not a product,",
      line2: "but a process."
    },
    {
      line1: "The best encryption is the one",
      line2: "you don't even know exists."
    },
    {
      line1: "Trust, but verify.",
      line2: "Encrypt, then share."
    },
    {
      line1: "Your data's safety is",
      line2: "our highest priority."
    },
    {
      line1: "In cybersecurity, there are",
      line2: "no second chances."
    },
    {
      line1: "Encryption is the castle wall",
      line2: "of the digital age."
    }
  ], []);

  useEffect(() => {
    // GSAP Timeline for quote animations
    const animateQuote = () => {
      if (!quoteRef.current) return;

      const lines = quoteRef.current.querySelectorAll('.quote-line');
      const tl = gsap.timeline();
      tl.to(lines, {
        duration: 0.5,
        y: -30,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.in"
      })
      .call(() => {
        setCurrentQuote((prev) => (prev + 1) % securityQuotes.length);
      })
      .set({}, {}, "+=0.2")
      .fromTo(lines,
        { y: 30, opacity: 0 },
        {
          duration: 0.8,
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out"
        }
      );
    };

    const interval = setInterval(animateQuote, 4500);
    return () => clearInterval(interval);
  }, [securityQuotes.length]);

  useEffect(() => {
    // Hero entrance animation
    const tl = gsap.timeline({ delay: 0.5 });

    if (heroRef.current) {
      const heroTitle = heroRef.current.querySelector('h1');
      if (heroTitle) {
        tl.fromTo(heroTitle,
          { y: 100, opacity: 0 },
          { duration: 1.2, y: 0, opacity: 1, ease: "power3.out" }
        );
      }
    }

    tl.fromTo('.feature-card',
      { y: 60, opacity: 0 },
      { duration: 0.8, y: 0, opacity: 1, stagger: 0.2, ease: "power2.out" },
      "-=0.6"
    )
    .fromTo('.security-indicator',
      { scale: 0, opacity: 0 },
      { duration: 0.6, scale: 1, opacity: 1, ease: "back.out(1.7)" },
      "-=0.4"
    );

    // Floating particles animation with error handling
    if (particlesRef.current) {
      const particles = particlesRef.current.querySelectorAll('.particle');
      particles.forEach((particle) => {
        if (particle) {
          const randomDuration = 3 + Math.random() * 4;
          const randomY = -100 - Math.random() * 200;
          const randomX = -50 + Math.random() * 100;
          const randomRotation = Math.random() * 360;
          const randomDelay = Math.random() * 3;

          gsap.set(particle, { y: 0, x: 0, rotation: 0, opacity: 1 });

          gsap.to(particle, {
            duration: randomDuration,
            y: randomY,
            x: randomX,
            rotation: randomRotation,
            opacity: 0,
            repeat: -1,
            delay: randomDelay,
            ease: "power1.out",
            yoyo: true,
            repeatDelay: 1
          });
        }
      });
    }

    // Vault animations with error handling
    const vaultMain = document.querySelector('.vault-main');
    const vaultContainer = document.querySelector('.vault-container');

    if (vaultMain) {
      gsap.to(vaultMain, {
        duration: 20,
        rotation: 360,
        repeat: -1,
        ease: "none"
      });
    }

    if (vaultContainer) {
      gsap.to(vaultContainer, {
        duration: 8,
        y: -20,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }

    return () => {
      if (tl) tl.kill();
    };
  }, []);


  // Generate particles array once
  const securityParticles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.3, // 0.3 to 0.8 opacity
      glowIntensity: Math.random() * 0.5 + 0.2, // 0.2 to 0.7 glow
      animationDuration: 3 + Math.random() * 4 // 3 to 7 seconds
    })), []
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Login Button - Top Left Corner */}
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => onNavigateAuth && onNavigateAuth('login')}
          className="bg-black/60 border border-emerald-400 text-emerald-300 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-500/20 transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-emerald-500/25 group"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform">🔐</span>
          <span className="text-lg">Secure Login</span>
        </button>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" ref={particlesRef}>
        {/* 3D Security Vault Model */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 vault-container">
          <div className="relative w-80 h-80">
            {/* Main Vault Body */}
            <div className="vault-main absolute inset-0 bg-black/40 border border-emerald-400 rounded-3xl shadow-2xl transform rotate-45">
              <div className="absolute inset-6 bg-gradient-to-br from-slate-700/50 to-slate-900/50 rounded-2xl backdrop-blur-sm">
                <div className="absolute inset-4 bg-gradient-to-br from-slate-600/30 to-slate-800/30 rounded-xl">
                  {/* Lock Mechanism */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-2xl">
                    <div className="absolute inset-3 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-full">
                      <div className="absolute inset-2 bg-gradient-to-br from-emerald-200 to-emerald-400 rounded-full flex items-center justify-center">
                        <span className="text-emerald-800 text-2xl font-bold">🔒</span>
                      </div>
                    </div>
                  </div>
                  {/* Security Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-6 gap-1 h-full p-3">
                      {Array.from({ length: 36 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-emerald-400/60 rounded-sm"
                          style={{
                            animationDelay: `${i * 0.05}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow Effects */}
            <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-xl transform rotate-45"></div>
            <div className="absolute inset-4 bg-emerald-400/10 rounded-2xl blur-lg transform rotate-45"></div>
          </div>
        </div>

        {/* Floating Security Icons */}
        <div className="absolute top-20 right-20 text-7xl opacity-20">🛡️</div>
        <div className="absolute bottom-32 left-20 text-6xl opacity-20">🔒</div>
        <div className="absolute top-1/3 right-1/4 text-5xl opacity-20">🔐</div>

        {/* Enhanced Security Particles */}
        {securityParticles.map((particle) => (
          <div
            key={particle.id}
            className="particle absolute rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              background: `radial-gradient(circle, 
                rgba(16, 185, 129, ${particle.glowIntensity}) 0%, 
                rgba(6, 214, 160, ${particle.glowIntensity * 0.6}) 30%, 
                rgba(17, 138, 178, ${particle.glowIntensity * 0.4}) 60%,
                transparent 100%)`,
              boxShadow: `0 0 ${particle.size * 2}px rgba(16, 185, 129, ${particle.glowIntensity * 0.8})`
            }}
          >
            <div
              className="absolute inset-1 rounded-full"
              style={{
                background: `radial-gradient(circle, 
                  rgba(255, 255, 255, ${particle.glowIntensity * 0.8}) 0%, 
                  rgba(16, 185, 129, ${particle.glowIntensity * 0.4}) 70%, 
                  transparent 100%)`
              }}
            ></div>
          </div>
        ))}

        {/* Geometric Patterns */}
        <div className="absolute top-10 left-1/4 w-32 h-32 border border-emerald-500/20 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 border border-cyan-500/20 rotate-45"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-blue-500/20 rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8" ref={heroRef}>
        <div className="text-center max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-20">
            <h1 className="text-6xl md:text-8xl font-black mb-12 text-white leading-none">
              SECURE
              <br />
              <span className="text-4xl md:text-6xl text-white/90">FILE VAULT</span>
            </h1>

            {/* Animated Security Quote */}
            <div className="mb-16 h-32 flex items-center justify-center" ref={quoteRef}>
              <div className="text-center max-w-4xl">
                <p className="quote-line text-2xl md:text-3xl text-emerald-300 font-light italic mb-2 leading-relaxed">
                  {securityQuotes[currentQuote].line1}
                </p>
                <p className="quote-line text-2xl md:text-3xl text-cyan-300 font-light italic leading-relaxed">
                  {securityQuotes[currentQuote].line2}
                </p>
              </div>
            </div>

            <div className="security-indicator flex justify-center items-center gap-8 text-emerald-400 mb-16">
              <div className="w-6 h-6 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
              <span className="text-2xl font-bold tracking-wider">MILITARY-GRADE ENCRYPTION</span>
              <div className="w-6 h-6 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-10 mb-20">
            <div className="feature-card bg-black/40 border border-emerald-500 rounded-3xl p-10 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-105 group">
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">🛡️</div>
              <h3 className="text-3xl font-bold text-white mb-6">Secure Upload</h3>
              <p className="text-slate-300 text-xl leading-relaxed">Military-grade AES-256 encryption protects your files from upload to storage.</p>
              <div className="mt-6 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent rounded-full"></div>
            </div>
            <div className="feature-card bg-black/40 border border-cyan-500 rounded-3xl p-10 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-105 group">
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">🔗</div>
              <h3 className="text-3xl font-bold text-white mb-6">Smart Links</h3>
              <p className="text-slate-300 text-xl leading-relaxed">Generate secure, time-limited sharing links with advanced access controls.</p>
              <div className="mt-6 w-full h-1 bg-gradient-to-r from-cyan-500 to-transparent rounded-full"></div>
            </div>
            <div className="feature-card bg-black/40 border border-blue-500 rounded-3xl p-10 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 group">
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className="text-3xl font-bold text-white mb-6">Audit Trail</h3>
              <p className="text-slate-300 text-xl leading-relaxed">Complete forensic logging of all file activities and access attempts.</p>
              <div className="mt-6 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-black/60 border border-emerald-500 rounded-3xl p-12 mb-16 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to Fortify Your Data?</h2>
            <p className="text-slate-300 mb-12 text-2xl max-w-3xl mx-auto leading-relaxed">
              Join over 10,000+ security-conscious users who trust our zero-knowledge architecture.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => onNavigateAuth && onNavigateAuth('login')}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-10 py-4 rounded-2xl font-bold text-2xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-emerald-500/30 group"
              >
                <span className="flex items-center gap-4">
                  <span className="text-3xl group-hover:rotate-12 transition-transform">🔐</span>
                  Sign In
                </span>
              </button>
              <button
                onClick={() => onNavigateAuth && onNavigateAuth('signup')}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-2xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-blue-500/30 group"
              >
                <span className="flex items-center gap-4">
                  <span className="text-3xl group-hover:rotate-12 transition-transform">🚀</span>
                  Sign Up
                </span>
              </button>
            </div>
          </div>

          {/* Security Features Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-black/40 border border-emerald-500 rounded-3xl p-10 hover:bg-slate-800/30 transition-all duration-300">
              <h3 className="text-2xl font-bold text-emerald-400 mb-8 flex items-center gap-4">
                <span className="text-4xl">🔐</span>
                Security Arsenal
              </h3>
              <ul className="text-slate-300 space-y-4 text-xl">
                <li className="flex items-center gap-4">
                  <span className="text-emerald-400 text-2xl">✓</span>
                  AES-256 encryption at rest & in transit
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-emerald-400 text-2xl">✓</span>
                  Zero-knowledge architecture
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-emerald-400 text-2xl">✓</span>
                  Hardware security modules (HSM)
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-emerald-400 text-3xl">✓</span>
                  SOC 2 Type II compliance
                </li>
              </ul>
            </div>
            <div className="bg-black/40 border border-cyan-500 rounded-3xl p-10 hover:bg-slate-800/30 transition-all duration-300">
              <h3 className="text-2xl font-bold text-cyan-400 mb-8 flex items-center gap-4">
                <span className="text-4xl">⚡</span>
                Performance Edge
              </h3>
              <ul className="text-slate-300 space-y-4 text-xl">
                <li className="flex items-center gap-4">
                  <span className="text-cyan-400 text-2xl">✓</span>
                  Lightning-fast CDN delivery
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-cyan-400 text-2xl">✓</span>
                  Optimized for enterprise files
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-cyan-400 text-2xl">✓</span>
                  Real-time sync & backup
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-cyan-400 text-2xl">✓</span>
                  99.99% uptime guarantee
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-slate-500 text-lg">
        <div className="flex items-center gap-2">
          <span>🔒</span>
          <span>Secured by end-to-end encryption</span>
        </div>
      </div>
    </div>
  )
};

export default LandingPage;
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-slate-500 text-lg">
          <div className="flex items-center gap-4">
            <span>🔒</span>
            <span>Secured by end-to-end encryption</span>
          </div>
        </div>
      </div>
    )

};

export default LandingPage;
