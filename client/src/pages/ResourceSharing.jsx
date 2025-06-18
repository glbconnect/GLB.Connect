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
          <div className="text-xl">Loading resources...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resource Sharing Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Share and discover academic resources, notes, and study materials
          </p>
          
          {isLoggedIn && (
            <div className="flex justify-center space-x-4">
              <Link to="/resources/upload">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  📤 Upload Resource
                </Button>
              </Link>
              <Link to="/resources/browse">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  🔍 Browse All Resources
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Resource Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Recent Resources Section */}
        {recentResources.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Recent Resources</h2>
              <Link
                to="/resources/browse"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        {!isLoggedIn && (
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join the Resource Sharing Community
            </h3>
            <p className="text-gray-600 mb-6">
              Sign in to upload your own resources and access the full library of study materials.
            </p>
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sign In to Continue
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResourceSharing; 