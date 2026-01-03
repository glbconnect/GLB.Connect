import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Improved SERVER_URL construction for production
const getServerUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    return 'http://localhost:5000';
  }
  
  // Handle different URL formats
  if (apiUrl.includes('/api')) {
    return apiUrl.replace('/api', '');
  }
  
  // If it's already a base URL without /api
  return apiUrl;
};

export const SERVER_URL = getServerUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
        localStorage.removeItem('auth');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 403 Forbidden errors (invalid token)
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      console.error('Authentication error:', error.response.data);
      // Clear invalid auth data
      if (error.config.url !== '/users/login' && error.config.url !== '/users/register') {
        // Only clear if not trying to log in or register
        localStorage.removeItem('auth');
        // Redirect to login page if needed
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// User API calls
export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return null;
  }
};

export const searchUsers = async (query) => {
  const response = await api.get(`/users?search=${query}`);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/users/change-password', passwordData);
  return response.data;
};

// Resource Sharing API calls
export const getResources = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(`/resources?${queryString}`);
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

export const createResource = async (formData) => {
  const response = await api.post('/resources', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateResource = async (id, resourceData) => {
  const response = await api.put(`/resources/${id}`, resourceData);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/resources/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/resources/categories');
  return response.data;
};

export const seedCategories = async () => {
  const response = await api.post('/seed-categories');
  return response.data;
};

export const getCategoryBySlug = async (slug) => {
  const response = await api.get(`/resources/categories/${slug}`);
  return response.data;
};

// Messages API calls
export const sendMessage = async (messageData) => {
  const response = await api.post('/messages/send', messageData);
  return response.data;
};

export const getChatHistory = async (user1Id, user2Id) => {
  const response = await api.get(`/messages/history/${user1Id}/${user2Id}`);
  return response.data;
};

export const getUnseenMessages = async (userId) => {
  const response = await api.get(`/messages/unseen/${userId}`);
  return response.data;
};

export const markMessageAsSeen = async (messageId) => {
  const response = await api.put(`/messages/seen/${messageId}`);
  return response.data;
};

// Anonymous Messages API calls
export const getAnonymousMessages = async () => {
  const response = await api.get('/anonymous-messages');
  return response.data;
};

export const sendAnonymousMessage = async (messageData) => {
  const response = await api.post('/anonymous-messages', messageData);
  return response.data;
};

// Events API calls
export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

export const registerForEvent = async (id) => {
  const response = await api.post(`/events/${id}/register`);
  return response.data;
};

export const unregisterFromEvent = async (id) => {
  const response = await api.post(`/events/${id}/unregister`);
  return response.data;
};

export const getEventRegistrations = async (id) => {
  const response = await api.get(`/events/${id}/registrations`);
  return response.data;
};

// Sessions API calls
export const getSessions = async () => {
  const response = await api.get('/sessions');
  return response.data;
};

export const getUpcomingSessions = async () => {
  const response = await api.get('/sessions/upcoming');
  return response.data;
};

export const getLiveSessions = async () => {
  const response = await api.get('/sessions/live');
  return response.data;
};

export const getSessionById = async (id) => {
  const response = await api.get(`/sessions/${id}`);
  return response.data;
};

export const createSession = async (sessionData) => {
  const response = await api.post('/sessions', sessionData);
  return response.data;
};

export const updateSession = async (id, sessionData) => {
  const response = await api.put(`/sessions/${id}`, sessionData);
  return response.data;
};

export const deleteSession = async (id) => {
  const response = await api.delete(`/sessions/${id}`);
  return response.data;
};

export const startSession = async (id, joinUrl = null) => {
  const response = await api.post(`/sessions/${id}/start`, { joinUrl });
  return response.data;
};

export const endSession = async (id) => {
  const response = await api.post(`/sessions/${id}/end`);
  return response.data;
};

// Generic file upload
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getAllConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

// Buzz API calls
export const getBuzzPosts = async () => {
  const response = await api.get('/buzz/posts');
  return response.data;
};

export const createBuzzPost = async (formData) => {
  const response = await api.post('/buzz/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const togglePostLike = async (postId) => {
  const response = await api.post(`/buzz/posts/${postId}/like`);
  return response.data;
};

export const addPostComment = async (postId, content) => {
  const response = await api.post(`/buzz/posts/${postId}/comment`, { content });
  return response.data;
};

export const getPostComments = async (postId) => {
  const response = await api.get(`/buzz/posts/${postId}/comments`);
  return response.data;
};

export const repostBuzzPost = async (postId) => {
  const response = await api.post(`/buzz/posts/${postId}/share`);
  return response.data;
};

export const deleteBuzzPost = async (postId) => {
  const response = await api.delete(`/buzz/posts/${postId}`);
  return response.data;
};

export const getBuzzUserStats = async () => {
  const response = await api.get('/buzz/stats');
  return response.data;
};

export const getSuggestedStudents = async () => {
  const response = await api.get('/buzz/suggestions');
  return response.data;
};

export const getTopContributors = async () => {
  const response = await api.get('/buzz/top-contributors');
  return response.data;
};

export const getTrendingPosts = async () => {
  const response = await api.get('/buzz/trending');
  return response.data;
};

export const getBuzzStories = async () => {
  const response = await api.get('/buzz/stories');
  return response.data;
};

export const createBuzzStory = async (formData) => {
  const response = await api.post('/buzz/stories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const toggleFollowUser = async (userId) => {
  const response = await api.post(`/buzz/users/${userId}/follow`);
  return response.data;
};

// Notification API calls
export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
};

export default api; 