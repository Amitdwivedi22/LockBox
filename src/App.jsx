import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import LandingPage from './components/LandingPage';

// Auth Components
import Login from './components/Login';
import Signup from './components/Signup';

// Main App Components
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import FileReceiver from './components/FileReceiver';

// UI Components
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Disable loading to see the app structure
  const [currentPage, setCurrentPage] = useState('upload');

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.log('Firebase auth error:', error);
      setLoading(false);
    }
  }, []);

  // Enhanced navigation handlers
  const handleNavigateAuth = (route) => {
    // Create a temporary element to trigger navigation
    const tempLink = document.createElement('a');
    tempLink.href = `/${route}`;
    tempLink.click();
  };

  // Don't show loading spinner, just render the app
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Hide navbar on landing page */}
        {!user && window.location.pathname === '/' ? null : <Navbar user={user} />}

        <main className={!user && window.location.pathname === '/' ? '' : 'pt-16'}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <LandingPage
                  onAuthenticated={setUser}
                  onNavigateAuth={handleNavigateAuth}
                />
              }
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/signup"
              element={<Signup />}
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/upload"
              element={<FileUpload />}
            />
            <Route
              path="/files/:id"
              element={<FileReceiver />}
            />

            {/* Catch all */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </main>

        {/* Hide footer on landing page */}
        {user && window.location.pathname === '/' ? null : <Footer />}
      </div>
    </Router>
  );
}

export default App;
