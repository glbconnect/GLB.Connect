import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CategoryCard from '../components/resource-sharing/CategoryCard';
import ResourceCard from '../components/resource-sharing/ResourceCard';
import { getCategories, getResources } from '../services/api';
import Button from '../components/ui/Button';

const ResourceSharing = ({ isLoggedIn, onLogout, currentUser }) => {
  const [categories, setCategories] = useState([]);
  const [recentResources, setRecentResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, resourcesData] = await Promise.all([
          getCategories(),
          getResources({ limit: 6 })
        ]);

        setCategories(categoriesData.data || []);
        setRecentResources(resourcesData.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load resource data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-xl text-gray-600">Loading amazing resources...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <div className="text-xl text-red-600 mb-2">{error}</div>
            <div className="text-gray-500">Please try again later</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Resource Sharing{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Hub
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Share and discover academic resources, notes, and study materials with your peers. 
              Build a collaborative learning community together.
            </p>
            
            {isLoggedIn && (
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/resources/upload">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    <span className="mr-2">📤</span>
                    Upload Resource
                  </Button>
                </Link>
                <Link to="/resources/browse">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300">
                    <span className="mr-2">🔍</span>
                    Browse All Resources
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="text-3xl font-bold text-blue-600 mb-2">{categories.length}</div>
            <div className="text-gray-600">Resource Categories</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="text-3xl font-bold text-purple-600 mb-2">{recentResources.length}+</div>
            <div className="text-gray-600">Available Resources</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">Access Available</div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect resources organized by subject and topic
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={category.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Resources Section */}
        {recentResources.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Resources</h2>
                <p className="text-xl text-gray-600">Latest additions to our resource library</p>
              </div>
              <Link
                to="/resources/browse"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                View All Resources
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentResources.map((resource, index) => (
                <div key={resource.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        {!isLoggedIn && (
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6">🚀</div>
              <h3 className="text-4xl font-bold mb-6">
                Join the Resource Sharing Community
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Sign in to upload your own resources, access the full library of study materials, 
                and connect with fellow learners.
              </p>
              <Link to="/login">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the best in collaborative learning and resource sharing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">Your resources are safe with our secure platform and reliable storage system.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Access</h3>
              <p className="text-gray-600">Quick downloads and instant access to all your study materials and resources.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Driven</h3>
              <p className="text-gray-600">Built by students, for students. Share knowledge and grow together.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </Layout>
  );
};

export default ResourceSharing;