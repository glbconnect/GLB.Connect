import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const Header = ({ isLoggedIn, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">GLB.Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">Home</Link>
            {isLoggedIn ? (
              <>
                <Link to="/messages" className="text-gray-700 hover:text-primary font-medium">Messages</Link>
                <Link to="/anonymous-post" className="text-gray-700 hover:text-primary font-medium">Anonymous Chat</Link>
                <Link to="/profile" className="text-gray-700 hover:text-primary font-medium">Profile</Link>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary font-medium">Login</Link>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            type="button" 
            className="md:hidden rounded-md p-2 text-gray-500"
            onClick={toggleMobileMenu}
          >
            <svg 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="mt-4 px-2 pt-2 pb-4 md:hidden space-y-3">
            <Link 
              to="/" 
              className="block text-gray-700 hover:text-primary font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link 
                  to="/messages" 
                  className="block text-gray-700 hover:text-primary font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link 
                  to="/anonymous-post" 
                  className="block text-gray-700 hover:text-primary font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Anonymous Chat
                </Link>
                <Link 
                  to="/profile" 
                  className="block text-gray-700 hover:text-primary font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block text-gray-700 hover:text-primary font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block text-gray-700 hover:text-primary font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 