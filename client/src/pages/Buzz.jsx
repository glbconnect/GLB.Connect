import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PostCard from '../components/buzz/PostCard';
import StoryBar from '../components/buzz/StoryBar';
import CreatePost from '../components/buzz/CreatePost';
import LeftSidebar from '../components/buzz/LeftSidebar';
import RightSidebar from '../components/buzz/RightSidebar';
import {
  getBuzzPosts,
  createBuzzPost,
  getBuzzUserStats,
  getSuggestedStudents,
  getTopContributors,
  getTrendingPosts,
  getBuzzStories
} from '../services/api';

const Buzz = ({ isLoggedIn, onLogout, currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [suggestedStudents, setSuggestedStudents] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [userStats, setUserStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Default current user if not provided
  const defaultUser = {
    id: currentUser?.id,
    name: currentUser?.name || 'You',
    branch: currentUser?.branch || 'Computer Science',
    year: currentUser?.year || '3rd',
    avatarUrl: currentUser?.avatarUrl || null
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, storiesData, statsData, suggestionsData, contributorsData, trendingData] = await Promise.all([
          getBuzzPosts(),
          getBuzzStories(),
          getBuzzUserStats(),
          getSuggestedStudents(),
          getTopContributors(),
          getTrendingPosts()
        ]);

        setPosts(postsData);
        setStories(storiesData);
        setUserStats(statsData);
        setSuggestedStudents(suggestionsData);
        setTopContributors(contributorsData);
        setTrendingPosts(trendingData);
        setError('');
      } catch (err) {
        console.error('Error fetching Buzz data:', err);
        let errorMessage = err.response?.data?.error || err.message || 'Failed to load feed. Please try again.';
        
        // Check if it's a database migration issue
        if (errorMessage.includes('does not exist') || errorMessage.includes('Database tables not found')) {
          errorMessage = 'Database tables not found. Please run: npx prisma migrate dev --name add_buzz_models';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreatePost = async (postData) => {
    try {
      const formData = new FormData();
      formData.append('content', postData.content || '');
      if (postData.imageFile) {
        formData.append('image', postData.imageFile);
      }

      const newPost = await createBuzzPost(formData);
      setPosts([newPost, ...posts]);
      setError(''); // Clear any previous errors
      
      // Refresh stats
      const stats = await getBuzzUserStats();
      setUserStats(stats);
    } catch (err) {
      console.error('Error creating post:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create post. Please try again.';
      setError(errorMessage);
      // Show error for 5 seconds then clear
      setTimeout(() => setError(''), 5000);
    }
  };

  const handlePostUpdate = () => {
    // Refresh posts when a post is liked/commented/shared
    getBuzzPosts().then(setPosts).catch(console.error);
  };

  if (loading) {
    return (
      <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading feed...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}
          <div className="flex gap-6">
            {/* Left Sidebar */}
            <LeftSidebar currentUser={defaultUser} stats={userStats} />

            {/* Main Feed */}
            <div className="flex-1 max-w-2xl">
              {/* Story Bar */}
              <StoryBar stories={stories} currentUser={defaultUser} />

              {/* Create Post */}
              <CreatePost currentUser={defaultUser} onCreatePost={handleCreatePost} />

              {/* Posts Feed */}
              <div>
                {posts.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to share something!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} onUpdate={handlePostUpdate} />
                  ))
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <RightSidebar
              suggestedStudents={suggestedStudents}
              topContributors={topContributors}
              trendingPosts={trendingPosts}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Buzz;
