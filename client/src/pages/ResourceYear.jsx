import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ResourceItem from '../components/resource-sharing/ResourceItem';
import { getResources } from '../services/api';
import Button from '../components/ui/Button';

const ResourceYear = ({ isLoggedIn, onLogout, currentUser }) => {
  const { categoryName, year } = useParams();
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const response = await getResources({ 
          categorySlug: categoryName,
          year: parseInt(year)
        });
        
        if (response.success) {
          setResources(response.data);
        } else {
          setError(response.message || 'Failed to fetch resources');
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('An error occurred while fetching resources');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [categoryName, year]);

  const handleUploadClick = () => {
    navigate('/resources/upload');
  };

  const getCategoryTitle = (slug) => {
    const titles = {
      'academics-notes': 'Academic Notes',
      'gate-notes': 'Gate Notes',
      'quantum': 'Quantum',
      'placement-resources': 'Placement Resources',
      'others': 'Others'
    };
    return titles[slug] || 'Resources';
  };

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {getCategoryTitle(categoryName)} - Year {year}
          </h1>
          <p className="text-xl text-gray-600">
            Browse and download resources for Year {year}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-md">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No resources found
            </h3>
            <p className="text-gray-600 mb-6">
              No resources found for {getCategoryTitle(categoryName)} - Year {year}.
            </p>
            {isLoggedIn && (
              <Button
                onClick={handleUploadClick}
                className="bg-blue-600 hover:bg-blue-700"
              >
                📤 Upload a Resource
              </Button>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Available Resources ({resources.length})
              </h2>
              {isLoggedIn && (
                <Button
                  onClick={handleUploadClick}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  📤 Upload Resource
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {resources.map(resource => (
                <ResourceItem
                  key={resource.id}
                  resource={resource}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResourceYear; 