import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import AnonymousPost from './pages/AnonymousPost';
import JobListing from './pages/JobListing';
import PostJob from './pages/PostJob';
import ResourceSharing from './pages/ResourceSharing';
import ResourceCategory from './pages/ResourceCategory';
import ResourceYear from './pages/ResourceYear';
import ResourceUpload from './pages/ResourceUpload';
import ResourceBrowse from './pages/ResourceBrowse';
import Events from './pages/Events';
import QAThreads from './pages/QAThreads';
import Buzz from './pages/Buzz';
import AboutUs from './pages/AboutUs';
import Sessions from './pages/Sessions';
import * as api from './services/api';
import './index.css';
import Header from './components/layout/Header';
import * as socketService from './services/socket';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  
  // Check for saved auth and fetch current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      const savedAuth = localStorage.getItem('auth');
      if (savedAuth) {
        try {
          const { user, token } = JSON.parse(savedAuth);
          if (user && token) {
            setCurrentUser(user);
            setIsLoggedIn(true);
            // Optionally, update localStorage with user and token
            localStorage.setItem('auth', JSON.stringify({ token, user }));
          }
        } catch (error) {
          console.error('Error parsing auth data:', error);
          localStorage.removeItem('auth');
        }
      }
      setIsLoading(false);
    };
    fetchCurrentUser();
  }, []);
  
  const handleLogin = (authData) => {
    setCurrentUser(authData.user);
    setIsLoggedIn(true);
    localStorage.setItem('auth', JSON.stringify(authData));
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('auth');
  };
  
  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    
    // Update localStorage
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        localStorage.setItem('auth', JSON.stringify({
          ...authData,
          user: updatedUser
        }));
      } catch (error) {
        console.error('Error updating stored profile:', error);
      }
    }
  };

  // Socket notification logic
  useEffect(() => {
    if (!isLoggedIn || !currentUser?.id) return;
    
    try {
      const socket = socketService.initializeSocket(currentUser.id);
      
      // Only set up listeners if socket is available
      if (socket) {
        // Listen for new messages
        socketService.listenForMessages((message) => {
          // Only notify if not on /messages or /messages/:userId and not sent by self
          const isOnMessagesPage = location.pathname.startsWith('/messages');
          if (!isOnMessagesPage && message.senderId !== currentUser.id) {
            setNotificationCount((prev) => prev + 1);
          }
        });
      }
    } catch (error) {
      // Silently handle socket connection errors - don't show to user
      console.warn("Socket connection failed:", error.message);
    }
    
    return () => {
      socketService.removeAllListeners();
    };
  }, [isLoggedIn, currentUser, location.pathname]);

  // Reset notification count when visiting messages page
  useEffect(() => {
    if (location.pathname.startsWith('/messages')) {
      setNotificationCount(0);
    }
  }, [location.pathname]);

  const handleNotificationClick = () => {
    setNotificationCount(0);
    // Optionally, navigate to messages page
    window.location.href = '/messages';
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        notificationCount={notificationCount}
        onNotificationClick={handleNotificationClick}
      />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register onLogin={handleLogin} />} />
        <Route path="/messages" element={isLoggedIn ? <Messages isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/messages/:userId" element={isLoggedIn ? <Messages isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} onUpdateProfile={handleUpdateProfile} /> : <Navigate to="/login" />} />
        <Route path="/anonymous-post" element={isLoggedIn ? <AnonymousPost isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/jobs" element={<JobListing isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} />} />
        <Route path="/post-job" element={isLoggedIn ? <PostJob isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} />
        {/* Resource Sharing Routes */}
        <Route path="/resources" element={<ResourceSharing isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} />} />
        <Route path="/resources/browse" element={<ResourceBrowse isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} />} />
        <Route path="/resources/upload" element={isLoggedIn ? <ResourceUpload isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/resources/category/:categoryName" element={<ResourceCategory isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} />} />
        <Route path="/resources/category/:categoryName/year/:year" element={<ResourceYear isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} />} />
        <Route path="/events" element={<Events isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} />} />
        <Route path="/sessions" element={isLoggedIn ? <Sessions isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/qa-threads" element={isLoggedIn ? <QAThreads isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/buzz" element={isLoggedIn ? <Buzz isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
