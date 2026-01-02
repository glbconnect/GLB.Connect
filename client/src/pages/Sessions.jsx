import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import SessionCard from '../components/sessions/SessionCard';
import SessionForm from '../components/sessions/SessionForm';
import Button from '../components/ui/Button';
import {
  getSessions,
  getLiveSessions,
  getUpcomingSessions,
  createSession,
  updateSession,
  deleteSession,
  startSession,
  endSession
} from '../services/api';
import { subscribeToSessionUpdates } from '../services/socket';

const Sessions = ({ isLoggedIn, onLogout, currentUser }) => {
  const [sessions, setSessions] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'live', 'upcoming'

  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    fetchSessions();
    
    // Subscribe to real-time session updates
    if (isLoggedIn) {
      const unsubscribe = subscribeToSessionUpdates({
        onNewSession: (session) => {
          setSessions(prev => [session, ...prev].sort((a, b) => 
            new Date(b.scheduledAt) - new Date(a.scheduledAt)
          ));
          if (session.status === 'LIVE') {
            setLiveSessions(prev => [session, ...prev]);
          } else if (session.status === 'SCHEDULED') {
            setUpcomingSessions(prev => [session, ...prev].sort((a, b) => 
              new Date(a.scheduledAt) - new Date(b.scheduledAt)
            ));
          }
        },
        onUpdateSession: (session) => {
          setSessions(prev => prev.map(s => s.id === session.id ? session : s));
          setLiveSessions(prev => {
            if (session.status === 'LIVE') {
              return prev.some(s => s.id === session.id) 
                ? prev.map(s => s.id === session.id ? session : s)
                : [session, ...prev];
            } else {
              return prev.filter(s => s.id !== session.id);
            }
          });
          setUpcomingSessions(prev => {
            if (session.status === 'SCHEDULED') {
              return prev.some(s => s.id === session.id)
                ? prev.map(s => s.id === session.id ? session : s).sort((a, b) => 
                    new Date(a.scheduledAt) - new Date(b.scheduledAt)
                  )
                : [session, ...prev].sort((a, b) => 
                    new Date(a.scheduledAt) - new Date(b.scheduledAt)
                  );
            } else {
              return prev.filter(s => s.id !== session.id);
            }
          });
        },
        onDeleteSession: ({ id }) => {
          setSessions(prev => prev.filter(s => s.id !== id));
          setLiveSessions(prev => prev.filter(s => s.id !== id));
          setUpcomingSessions(prev => prev.filter(s => s.id !== id));
        },
        onStartSession: (session) => {
          setSessions(prev => prev.map(s => s.id === session.id ? session : s));
          setLiveSessions(prev => [session, ...prev]);
          setUpcomingSessions(prev => prev.filter(s => s.id !== session.id));
        },
        onEndSession: (session) => {
          setSessions(prev => prev.map(s => s.id === session.id ? session : s));
          setLiveSessions(prev => prev.filter(s => s.id !== session.id));
        }
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [isLoggedIn]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [allSessionsRes, liveRes, upcomingRes] = await Promise.all([
        getSessions(),
        getLiveSessions(),
        getUpcomingSessions()
      ]);

      if (allSessionsRes.success) {
        setSessions(allSessionsRes.data || []);
      }
      if (liveRes.success) {
        setLiveSessions(liveRes.data || []);
      }
      if (upcomingRes.success) {
        setUpcomingSessions(upcomingRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (formData) => {
    try {
      setError('');
      const response = await createSession(formData);
      
      if (response.success) {
        setShowCreateForm(false);
        await fetchSessions();
      } else {
        setError(response.message || 'Failed to create session');
      }
    } catch (err) {
      console.error('Error creating session:', err);
      setError(err.response?.data?.message || 'Failed to create session');
    }
  };

  const handleUpdateSession = async (formData) => {
    try {
      setError('');
      const response = await updateSession(editingSession.id, formData);
      
      if (response.success) {
        setEditingSession(null);
        await fetchSessions();
      } else {
        setError(response.message || 'Failed to update session');
      }
    } catch (err) {
      console.error('Error updating session:', err);
      setError(err.response?.data?.message || 'Failed to update session');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      setError('');
      const response = await deleteSession(sessionId);
      
      if (response.success) {
        await fetchSessions();
      } else {
        setError(response.message || 'Failed to delete session');
      }
    } catch (err) {
      console.error('Error deleting session:', err);
      setError(err.response?.data?.message || 'Failed to delete session');
    }
  };

  const handleStartSession = async (session) => {
    if (!window.confirm(`Start the session "${session.title}" now?`)) {
      return;
    }

    try {
      setError('');
      // You can optionally provide a join URL (e.g., Zoom, Google Meet link)
      const joinUrl = prompt('Enter join URL (or leave empty):') || null;
      
      const response = await startSession(session.id, joinUrl);
      
      if (response.success) {
        await fetchSessions();
      } else {
        setError(response.message || 'Failed to start session');
      }
    } catch (err) {
      console.error('Error starting session:', err);
      setError(err.response?.data?.message || 'Failed to start session');
    }
  };

  const handleEndSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to end this session?')) {
      return;
    }

    try {
      setError('');
      const response = await endSession(sessionId);
      
      if (response.success) {
        await fetchSessions();
      } else {
        setError(response.message || 'Failed to end session');
      }
    } catch (err) {
      console.error('Error ending session:', err);
      setError(err.response?.data?.message || 'Failed to end session');
    }
  };

  const handleJoinSession = (session) => {
    if (session.joinUrl) {
      window.open(session.joinUrl, '_blank');
    } else {
      // If no join URL, you could implement a custom video/audio solution
      alert('Join URL not available. Please contact the session host.');
    }
  };

  const getDisplayedSessions = () => {
    switch (activeTab) {
      case 'live':
        return liveSessions;
      case 'upcoming':
        return upcomingSessions;
      default:
        return sessions;
    }
  };

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout} currentUser={currentUser}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-2 sm:px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Live Sessions
                </h1>
                <p className="text-gray-600">
                  Join live classes and webinars, or view upcoming sessions
                </p>
              </div>
              {isAdmin && (
                <Button
                  onClick={() => {
                    setEditingSession(null);
                    setShowCreateForm(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Session
                </Button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 font-semibold transition-colors ${
                  activeTab === 'all'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                All Sessions ({sessions.length})
              </button>
              <button
                onClick={() => setActiveTab('live')}
                className={`px-4 py-2 font-semibold transition-colors relative ${
                  activeTab === 'live'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Live ({liveSessions.length})
                {liveSessions.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 font-semibold transition-colors ${
                  activeTab === 'upcoming'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Upcoming ({upcomingSessions.length})
              </button>
            </div>
          </div>

          {/* Create/Edit Form Modal */}
          {(showCreateForm || editingSession) && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto shadow-2xl">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingSession(null);
                  }}
                  className="absolute top-4 right-4 text-3xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {editingSession ? 'Edit Session' : 'Create New Session'}
                </h2>
                <SessionForm
                  initialData={editingSession || {}}
                  onSubmit={editingSession ? handleUpdateSession : handleCreateSession}
                  onCancel={() => {
                    setShowCreateForm(false);
                    setEditingSession(null);
                  }}
                />
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Sessions Grid */}
              {getDisplayedSessions().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getDisplayedSessions().map(session => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isAdmin={isAdmin}
                      onStart={handleStartSession}
                      onEnd={handleEndSession}
                      onEdit={(session) => {
                        setEditingSession(session);
                        setShowCreateForm(true);
                      }}
                      onDelete={handleDeleteSession}
                      onJoin={handleJoinSession}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                  <div className="text-6xl mb-4">📹</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    {activeTab === 'live' 
                      ? 'No Live Sessions'
                      : activeTab === 'upcoming'
                      ? 'No Upcoming Sessions'
                      : 'No Sessions Found'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === 'live'
                      ? 'There are currently no live sessions. Check back later!'
                      : activeTab === 'upcoming'
                      ? 'No upcoming sessions scheduled.'
                      : 'Create your first session to get started!'}
                  </p>
                  {isAdmin && activeTab !== 'live' && (
                    <Button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                      Create Your First Session
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Sessions;

