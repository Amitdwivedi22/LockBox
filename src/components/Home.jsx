import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 animate-fade-in-up">
          <div className="text-6xl font-bold animate-float">
            🔒
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold animate-slide-up">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-shimmer">
              LockBox
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-in">
            Military-grade encryption for your secure file sharing needs
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: "🛡️",
              title: "Secure Encryption",
              description: "End-to-end encryption with military-grade security protocols"
            },
            {
              icon: "⏱️",
              title: "Time-Based Access",
              description: "Set expiration times for your shared files"
            },
            {
              icon: "🔑",
              title: "Password Protection",
              description: "Add an extra layer of security with custom passwords"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-4xl mb-4 animate-bounce">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-emerald-400">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-fade-in-up">
          <Link
            to="/upload"
            className="relative inline-block px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white hover:scale-105 transition-all duration-300 animate-pulse-gentle"
          >
            Start Sharing Securely
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-xl blur opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
          </Link>
        </div>

        {/* Security Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 text-center">
          {[
            { value: "256-bit", label: "AES Encryption" },
            { value: "100%", label: "Secure Transfer" },
            { value: "24/7", label: "Availability" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
