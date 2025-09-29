import { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'document.pdf', size: '2.5 MB', uploaded: '2 hours ago' },
    { id: 2, name: 'presentation.pptx', size: '15.8 MB', uploaded: '1 day ago' },
    { id: 3, name: 'images.zip', size: '45.2 MB', uploaded: '3 days ago' }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Your Secure Vault</h1>
        <p className="text-xl text-gray-400 mb-8">
          Upload, share, and manage your files with military-grade encryption
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          <span className="text-2xl">📁</span>
          Upload New File
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 text-2xl">📊</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{uploadedFiles.length}</p>
              <p className="text-gray-400">Total Files</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
              <span className="text-green-400 text-2xl">🔒</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">63.5 MB</p>
              <p className="text-gray-400">Secure Storage</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
              <span className="text-purple-400 text-2xl">📤</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">5</p>
              <p className="text-gray-400">Shared Files</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Files */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Files</h2>
          <Link
            to="/upload"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Upload More →
          </Link>
        </div>

        {uploadedFiles.length > 0 ? (
          <div className="space-y-4">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-gray-300 text-lg">📄</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-sm text-gray-400">{file.size} • Uploaded {file.uploaded}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-white p-2 transition-colors" title="Share">
                    <span>🔗</span>
                  </button>
                  <button className="text-gray-400 hover:text-white p-2 transition-colors" title="Download">
                    <span>⬇️</span>
                  </button>
                  <button className="text-gray-400 hover:text-red-400 p-2 transition-colors" title="Delete">
                    <span>🗑️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📁</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No files yet</h3>
            <p className="text-gray-400 mb-6">Upload your first secure file to get started</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              <span>📤</span>
              Upload Your First File
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/upload"
              className="flex items-center gap-3 p-3 bg-gray-700/30 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <span className="text-2xl">📤</span>
              <span className="text-white">Upload Files</span>
            </Link>
            <button className="flex items-center gap-3 p-3 bg-gray-700/30 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors w-full text-left">
              <span className="text-2xl">📊</span>
              <span className="text-white">View Analytics</span>
            </button>
            <button className="flex items-center gap-3 p-3 bg-gray-700/30 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors w-full text-left">
              <span className="text-2xl">⚙️</span>
              <span className="text-white">Settings</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Security Info</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500/20 border border-green-500/30 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">AES-256 Encryption</p>
                <p className="text-gray-400 text-xs">Military-grade encryption for all files</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-xs">✓</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Secure Sharing</p>
                <p className="text-gray-400 text-xs">Temporary links with access controls</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500/20 border border-purple-500/30 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 text-xs">✓</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Firebase Auth</p>
                <p className="text-gray-400 text-xs">Google's secure authentication system</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
