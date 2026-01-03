import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import logo from '../../assets/logo.png';
import { FaUserCircle } from 'react-icons/fa';
import { FiBell } from 'react-icons/fi';

const navLinks = [
  { to: '/', label: 'Home', public: true },
  { to: '/about-us', label: 'About Us', public: true },
  { to: '/buzz', label: 'Buzz' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/events', label: 'Events' },
  { to: '/sessions', label: 'Sessions' },
  { to: '/messages', label: 'Messages' },
  { to: '/anonymous-post', label: 'Anonymous Chat' },
  { to: '/resources', label: 'Resources' },
  { to: '/qa-threads', label: 'Q&A Threads' },
];

const NavLinkItem = ({ to, children, onClick, isActive, disabled }) => (
  <NavLink
    to={to}
    onClick={disabled ? (e) => { e.preventDefault(); onClick && onClick(e); } : onClick}
    className={({ isActive: navActive }) =>
      `px-4 py-2 rounded-full text-base font-normal transition-colors duration-200 ${
        (isActive ?? navActive)
          ? 'bg-blue-600 text-white shadow-sm'
          : disabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-blue-500 hover:text-white'
      }`
    }
    tabIndex={disabled ? -1 : 0}
    aria-disabled={disabled}
  >
    {children}
  </NavLink>
);

const MobileNavLinkItem = ({ to, children, onClick, isActive, disabled }) => (
  <NavLink
    to={to}
    onClick={disabled ? (e) => { e.preventDefault(); onClick && onClick(e); } : onClick}
    className={({ isActive: navActive }) =>
      `block px-5 py-3 rounded-full text-base font-normal transition-colors duration-200 ${
        (isActive ?? navActive)
          ? 'bg-blue-600 text-white shadow-sm'
          : disabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-blue-500 hover:text-white'
      }`
    }
    tabIndex={disabled ? -1 : 0}
    aria-disabled={disabled}
  >
    {children}
  </NavLink>
)

const Header = ({ isLoggedIn, onLogout, notificationCount, onNotificationClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Show message for 2 seconds
  const handleProtectedClick = (e) => {
    setShowLoginMsg(true);
    setTimeout(() => setShowLoginMsg(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="GLB.Connect" className="h-9 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <NavLinkItem
                key={link.to}
                to={link.to}
                disabled={!isLoggedIn && !link.public}
                onClick={!isLoggedIn && !link.public ? handleProtectedClick : undefined}
                isActive={location.pathname === link.to}
              >
                {link.label}
              </NavLinkItem>
            ))}
          </nav>

          {/* Auth Buttons, Notification, & Mobile Menu Toggle */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2">
              {isLoggedIn ? (
                <>
                  {/* Notification Bell */}
                  <button
                    className="relative text-gray-600 hover:text-blue-600 focus:outline-none"
                    title="Notifications"
                    onClick={typeof onNotificationClick === 'function' ? onNotificationClick : undefined}
                  >
                    <FiBell size={26} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-pulse">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  {/* Profile Icon */}
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setShowProfileMenu((v) => !v)}
                      className="ml-2 text-gray-600 hover:text-blue-600 focus:outline-none"
                      title="Profile"
                    >
                      <FaUserCircle size={32} />
                    </button>
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2">
                        <button
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-t-xl"
                          onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                        >
                          View Profile
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-b-xl"
                          onClick={() => { setShowProfileMenu(false); onLogout(); navigate('/login'); }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
                  <Button size="sm" onClick={() => navigate('/register')}>Register</Button>
                </>
              )}
            </div>
            <button 
              type="button" 
              className="md:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Login required message */}
      {showLoginMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg z-50 text-base font-medium animate-fade-in-out">
          Please log in first
        </div>
      )}
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="container mx-auto px-4 pt-4 pb-4 space-y-2">
            {isLoggedIn && (
              <div className="flex justify-end mb-2 items-center gap-2">
                {/* Notification Bell (Mobile) */}
                <div className="relative" ref={notificationRef}>
                  <button
                    className="relative text-gray-600 hover:text-blue-600 focus:outline-none"
                    title="Notifications"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <FiBell size={26} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-pulse">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                      <NotificationDropdown 
                        notifications={notifications} 
                        onMarkAsRead={onMarkAsRead}
                        onClose={() => setShowNotifications(false)}
                      />
                    )}
                </div>
                <button
                  onClick={() => { navigate('/profile'); closeMobileMenu(); }}
                  className="text-gray-600 hover:text-blue-600 focus:outline-none"
                  title="Profile"
                >
                  <FaUserCircle size={32} />
                </button>
              </div>
            )}
            {navLinks.map((link) => (
              <MobileNavLinkItem
                key={link.to}
                to={link.to}
                disabled={!isLoggedIn && !link.public}
                onClick={!isLoggedIn && !link.public ? handleProtectedClick : closeMobileMenu}
                isActive={location.pathname === link.to}
              >
                {link.label}
              </MobileNavLinkItem>
            ))}
            {isLoggedIn ? (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="border-t border-gray-200 mt-3 pt-3 flex items-center space-x-3">
                <Button variant="outline" className="w-full" onClick={() => { navigate('/login'); closeMobileMenu(); }}>Login</Button>
                <Button className="w-full" onClick={() => { navigate('/register'); closeMobileMenu(); }}>Register</Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 