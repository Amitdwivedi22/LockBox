const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-gray-300 font-semibold">LockBox</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>🔒 256-bit AES Encryption</span>
            <span>🛡️ Secure & Private</span>
            <span>⚡ Lightning Fast</span>
          </div>

          <div className="text-xs text-gray-500">
            © 2025 LockBox. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
