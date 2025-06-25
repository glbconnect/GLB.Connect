import React, { useEffect, useState } from 'react';
import UserCard from '../components/ui/UserCard';
import * as api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { FaUserCircle, FaEnvelope, FaMapMarkerAlt, FaStar, FaTimes, FaUsers, FaSearch, FaFilter } from 'react-icons/fa';

const QAThreads = ({ isLoggedIn, onLogout, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState({}); // { userId: 'none' | 'pending' | 'connected' }
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Get all users (no need to fetch current user)
        const allUsers = await api.getUsers();
        console.log('API Response:', allUsers);
        console.log('Users array length:', allUsers.length);
        setUsers(allUsers);
        // TODO: Fetch connection status for each user
      } catch (err) {
        console.error('Error fetching users:', err);
        // Optionally handle error, but do not redirect
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search and batch
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.skills && user.skills.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBatch = selectedBatch === 'all' || user.batchYear === parseInt(selectedBatch);
    return matchesSearch && matchesBatch;
  });

  // Group users by batch year
  const usersByBatch = filteredUsers.reduce((acc, user) => {
    acc[user.batchYear] = acc[user.batchYear] || [];
    acc[user.batchYear].push(user);
    return acc;
  }, {});

  // Get unique batch years for filter
  const batchYears = [...new Set(users.map(user => user.batchYear))].sort((a, b) => b - a);

  // Handle message button click to navigate to chat
  const handleMessageClick = (user, e) => {
    e.stopPropagation();
    navigate(`/messages/${user.id}`);
  };

  // Dummy connect handler (replace with API call)
  const handleConnect = (userId) => {
    setConnections(prev => ({ ...prev, [userId]: 'pending' }));
    // TODO: Call API to send connection request
  };

  // Handle user card click to show profile
  const handleUserCardClick = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  // Close profile modal
  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedUser(null);
  };

  console.log('Users state:', users);
  console.log('Loading state:', loading);
  console.log('Users length:', users.length);

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-2 sm:px-4 md:px-8 py-4 md:py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-16">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-2 sm:px-4 md:px-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                <FaUsers className="text-white text-2xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Q&amp;A Threads</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Turn confusion into clarity with peer-powered Q&amp;A threads
            </p>
            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="bg-white bg-opacity-20 rounded-full px-6 py-2">
                <span className="text-white font-medium">{filteredUsers.length} Students</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full px-6 py-2">
                <span className="text-white font-medium">{batchYears.length} Batches</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              {/* Batch Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  <option value="all">All Batches</option>
                  {batchYears.map(year => (
                    <option key={year} value={year}>Batch {year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                <div className="mt-4 text-center">
                  <p className="text-gray-600 font-medium">Loading amazing students...</p>
                </div>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedBatch !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No registered students found yet.'
                  }
                </p>
                {(searchTerm || selectedBatch !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedBatch('all');
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.keys(usersByBatch).sort((a, b) => b - a).map(batch => (
                <div key={batch} className="space-y-6">
                  <div className="text-center">
                    <div className="inline-block relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-30 transform scale-110"></div>
                      <h2 className="relative text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Batch {batch}
                      </h2>
                    </div>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full shadow-lg"></div>
                    <div className="mt-3 inline-block bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 px-4 py-2 rounded-full">
                      <p className="text-gray-700 font-medium">{usersByBatch[batch].length} students</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {usersByBatch[batch].map((user, index) => (
                      <div 
                        key={user.id} 
                        onClick={() => handleUserCardClick(user)} 
                        className="cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
                        style={{
                          background: `linear-gradient(45deg, 
                            hsl(${(index * 60) % 360}, 70%, 95%), 
                            hsl(${(index * 60 + 30) % 360}, 70%, 95%))`,
                          borderRadius: '20px',
                          padding: '3px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div className="bg-white rounded-2xl p-1 h-full">
                  <UserCard
                    user={user}
                    connectionStatus={connections[user.id] || 'none'}
                    onConnect={(e) => {
                      e.stopPropagation();
                      handleMessageClick(user, e);
                    }}
                  />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Modal */}
        {showProfileModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Profile Details</h2>
                  <button
                    onClick={closeProfileModal}
                    className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left: Avatar & Main Info */}
                  <div className="lg:w-1/3 flex flex-col items-center">
                    <div className="relative">
                      {selectedUser.avatarUrl ? (
                        <img 
                          src={selectedUser.avatarUrl} 
                          alt={selectedUser.name} 
                          className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-xl"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                      ) : (
                        <FaUserCircle className="w-40 h-40 text-gray-300 bg-white rounded-full border-4 border-blue-100 shadow-xl" />
                      )}
                      <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-2 text-center">{selectedUser.name}</h3>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-3">
                      Batch {selectedUser.batchYear || 'N/A'}
                    </div>
                    <div className="flex items-center justify-center text-gray-500 text-sm mb-6">
                      <FaMapMarkerAlt className="mr-2" /> GL Bajaj, Greater Noida
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Contact Info */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <FaEnvelope className="mr-2 text-blue-500" /> Contact Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-700">
                            <span className="font-medium w-20">Email:</span> {selectedUser.email}
                          </div>
                          <div className="flex items-center text-gray-700">
                            <span className="font-medium w-20">Phone:</span> +91 9876543210
                          </div>
                          <div className="flex items-center text-gray-700">
                            <span className="font-medium w-20">Roll No:</span> GLB{selectedUser.batchYear}CS123
                          </div>
                        </div>
                      </div>

                      {/* Basic Info */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-700">
                            <span className="font-medium w-20">Branch:</span> Computer Science
                          </div>
                          <div className="flex items-center text-gray-700">
                            <span className="font-medium w-20">Year:</span> {selectedUser.batchYear ? `${2024 - selectedUser.batchYear}rd Year` : 'N/A'}
                          </div>
                          <div className="flex items-center text-gray-700">
                            <span className="font-medium w-20">CGPA:</span> 8.7 <FaStar className="text-yellow-400 ml-2" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Skills & Expertise</h4>
                      {selectedUser.skills ? (
                        <div className="flex flex-wrap gap-3">
                          {selectedUser.skills.split(',').map((skill, index) => (
                            <span 
                              key={index} 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No skills listed yet</p>
                      )}
                    </div>

                    {/* Connect Button */}
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => handleMessageClick(selectedUser, { stopPropagation: () => {} })}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Message {selectedUser.name.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QAThreads; 