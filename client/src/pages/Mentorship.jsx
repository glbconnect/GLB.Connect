import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import {
  getActivePolls,
  createPoll,
  voteOnPoll,
  getUpcomingSessions,
  createSession,
  enrollInSession,
  getMySessions,
  getMentorSessions
} from '../services/api';
import CreatePollModal from '../components/mentorship/CreatePollModal';
import CreateSessionModal from '../components/mentorship/CreateSessionModal';
import PollCard from '../components/mentorship/PollCard';
import SessionCard from '../components/mentorship/SessionCard';

const Mentorship = ({ isLoggedIn, onLogout, currentUser }) => {
  const [activeTab, setActiveTab] = useState('polls');
  const [polls, setPolls] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [mentorSessions, setMentorSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);

  // Check if user is mentor/alumni (graduated 2+ years ago)
  const isMentor = currentUser?.batchYear && (new Date().getFullYear() - currentUser.batchYear) >= 2;

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      if (activeTab === 'polls') {
        const pollsData = await getActivePolls();
        setPolls(pollsData);
      } else if (activeTab === 'sessions') {
        const sessionsData = await getUpcomingSessions();
        setSessions(sessionsData);
      } else if (activeTab === 'my-sessions') {
        const mySessionsData = await getMySessions();
        setMySessions(mySessionsData);
        if (isMentor) {
          const mentorSessionsData = await getMentorSessions();
          setMentorSessions(mentorSessionsData);
        }
      }
    } catch (err) {
      console.error('Error fetching mentorship data:', err);
      setError(err.response?.data?.error || 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePoll = async (pollData) => {
    try {
      const newPoll = await createPoll(pollData);
      setPolls([newPoll, ...polls]);
      setShowCreatePoll(false);
      setError('');
    } catch (err) {
      console.error('Error creating poll:', err);
      setError(err.response?.data?.error || 'Failed to create poll. Please try again.');
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      const result = await voteOnPoll(pollId, optionId);
      // Update poll in state
      setPolls(polls.map(poll => 
        poll.id === pollId 
          ? { ...poll, ...result.poll, hasVoted: true, userVote: optionId }
          : poll
      ));
    } catch (err) {
      console.error('Error voting:', err);
      setError(err.response?.data?.error || 'Failed to vote. Please try again.');
    }
  };

  const handleCreateSession = async (sessionData) => {
    try {
      const newSession = await createSession(sessionData);
      setSessions([newSession, ...sessions]);
      setShowCreateSession(false);
      setError('');
    } catch (err) {
      console.error('Error creating session:', err);
      setError(err.response?.data?.error || 'Failed to create session. Please try again.');
    }
  };

  const handleEnroll = async (sessionId) => {
    try {
      await enrollInSession(sessionId);
      // Refresh sessions
      await fetchData();
      setError('');
    } catch (err) {
      console.error('Error enrolling:', err);
      setError(err.response?.data?.error || 'Failed to enroll. Please try again.');
    }
  };

  const tabs = [
    { id: 'polls', label: 'Active Polls' },
    { id: 'sessions', label: 'Upcoming Sessions' },
    { id: 'my-sessions', label: 'My Sessions' }
  ];

  if (loading && polls.length === 0 && sessions.length === 0 && mySessions.length === 0) {
    return (
      <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mentorship
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with alumni mentors and join mentorship sessions
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Mentor Actions */}
          {isMentor && (
            <div className="mb-6 flex gap-4 flex-wrap">
              <button
                onClick={() => setShowCreatePoll(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Poll
              </button>
              <button
                onClick={() => setShowCreateSession(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Session
              </button>
            </div>
          )}

          {/* Content */}
          <div>
            {activeTab === 'polls' && (
              <div>
                {polls.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No active polls available.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {polls.map((poll) => (
                      <PollCard
                        key={poll.id}
                        poll={poll}
                        onVote={handleVote}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sessions' && (
              <div>
                {sessions.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No upcoming sessions available.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onEnroll={handleEnroll}
                        isMentor={isMentor}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'my-sessions' && (
              <div>
                {isMentor && mentorSessions.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Sessions I'm Hosting
                    </h2>
                    <div className="space-y-4 mb-8">
                      {mentorSessions.map((session) => (
                        <SessionCard
                          key={session.id}
                          session={{ ...session, isMentor: true }}
                          isMentor={true}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Sessions I'm Enrolled In
                </h2>
                {mySessions.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">You haven't enrolled in any sessions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mySessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        isMentor={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreatePollModal
        isOpen={showCreatePoll}
        onClose={() => setShowCreatePoll(false)}
        onSubmit={handleCreatePoll}
      />

      <CreateSessionModal
        isOpen={showCreateSession}
        onClose={() => setShowCreateSession(false)}
        onSubmit={handleCreateSession}
      />
    </Layout>
  );
};

export default Mentorship;

