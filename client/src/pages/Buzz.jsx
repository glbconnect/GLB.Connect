import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PostCard from '../components/buzz/PostCard';
import StoryBar from '../components/buzz/StoryBar';
import CreatePost from '../components/buzz/CreatePost';
import LeftSidebar from '../components/buzz/LeftSidebar';
import RightSidebar from '../components/buzz/RightSidebar';

// Dummy data generator
const generateDummyPosts = () => {
  const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
  const years = ['1st', '2nd', '3rd', '4th'];
  const names = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vikram Mehta',
    'Anjali Desai', 'Rohit Verma', 'Kavita Reddy', 'Arjun Nair', 'Meera Joshi',
    'Siddharth Iyer', 'Divya Menon', 'Karan Malhotra', 'Neha Agarwal', 'Ravi Krishnan'
  ];

  const postContents = [
    "Just finished my project presentation! Feeling great about the feedback from professors. 🎓",
    "Anyone else excited about the upcoming hackathon? Let's form a team! 💻",
    "Sharing some amazing resources I found for data structures. Check them out!",
    "College life is all about balance - studies, friends, and personal growth. What's your take?",
    "Just discovered this amazing library for React. Game changer! 🔥",
    "Mid-semester exams are around the corner. Study groups anyone?",
    "The new lab equipment is incredible! Can't wait to experiment more.",
    "Sharing my internship experience at a tech startup. Learned so much!",
    "Anyone attending the tech talk tomorrow? Let's meet up!",
    "Just published my first research paper! So grateful for the support from mentors.",
    "The coding competition was intense! Made it to the top 10. 🏆",
    "Study tips that actually work: Pomodoro technique + group discussions = success!",
    "Found an amazing online course for machine learning. Highly recommend!",
    "College fest preparations are in full swing. Excited to showcase our project!",
    "Networking event next week - great opportunity to connect with alumni."
  ];

  const posts = [];
  for (let i = 0; i < 15; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const year = years[Math.floor(Math.random() * years.length)];
    
    posts.push({
      id: i + 1,
      user: {
        name,
        branch,
        year,
        avatarUrl: null
      },
      content: postContents[i],
      image: Math.random() > 0.7 ? `https://picsum.photos/600/400?random=${i}` : null,
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.5,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const generateDummyStories = () => {
  const names = [
    'Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram',
    'Anjali', 'Rohit', 'Kavita', 'Arjun', 'Meera'
  ];

  return names.slice(0, 8).map((name, index) => ({
    id: index + 1,
    user: {
      name,
      avatarUrl: null
    }
  }));
};

const generateSuggestedStudents = () => {
  const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil'];
  const years = ['2nd', '3rd', '4th'];
  const names = [
    'Rahul Gupta', 'Sonia Kapoor', 'Manish Tiwari', 'Deepika Rao', 'Kunal Shah',
    'Isha Mehta', 'Varun Agarwal', 'Tanya Singh', 'Aditya Kumar', 'Pooja Nair'
  ];

  return names.slice(0, 8).map((name, index) => ({
    id: index + 1,
    name,
    branch: branches[Math.floor(Math.random() * branches.length)],
    year: years[Math.floor(Math.random() * years.length)],
    avatarUrl: null
  }));
};

const generateTopContributors = () => {
  const names = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vikram Mehta'
  ];

  return names.map((name, index) => ({
    id: index + 1,
    name,
    posts: Math.floor(Math.random() * 50) + 20,
    avatarUrl: null
  })).sort((a, b) => b.posts - a.posts);
};

const Buzz = ({ isLoggedIn, onLogout, currentUser }) => {
  const [posts, setPosts] = useState(generateDummyPosts());
  const [stories] = useState(generateDummyStories());
  const [suggestedStudents] = useState(generateSuggestedStudents());
  const [topContributors] = useState(generateTopContributors());
  const [trendingPosts] = useState(posts.slice(0, 5).map(p => ({
    content: p.content,
    likes: p.likes,
    comments: p.comments
  })));

  // Default current user if not provided
  const defaultUser = {
    name: currentUser?.name || 'You',
    branch: currentUser?.branch || 'Computer Science',
    year: currentUser?.year || '3rd',
    avatarUrl: currentUser?.avatarUrl || null
  };

  const userStats = {
    posts: 12,
    followers: 156,
    following: 89
  };

  const handleCreatePost = (postData) => {
    const newPost = {
      id: posts.length + 1,
      user: {
        name: defaultUser.name,
        branch: defaultUser.branch,
        year: defaultUser.year,
        avatarUrl: defaultUser.avatarUrl
      },
      content: postData.content,
      image: postData.image,
      likes: 0,
      comments: 0,
      isLiked: false,
      timestamp: new Date().toISOString()
    };

    setPosts([newPost, ...posts]);
  };

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
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

