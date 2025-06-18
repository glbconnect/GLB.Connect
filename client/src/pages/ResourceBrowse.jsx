import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ResourceCard from '../components/resource-sharing/ResourceCard';
import { getResources, getCategories } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ResourceBrowse = ({ isLoggedIn, onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    year: '',
    page: 1
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const params = { ...filters };
        
        // Remove empty filters
        Object.keys(params).forEach(key => {
          if (!params[key] || params[key] === '') {
            delete params[key];
          }
        });
        
        const response = await getResources(params);
        
        if (response.success) {
          setResources(response.data);
          setPagination({
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            totalCount: response.totalCount
          });
        } else {
          setError(response.message || 'Failed to fetch resources');
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('An error occurred while fetching resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleUploadClick = () => {
    navigate('/resources/upload');
  };

  const yearOptions = [
    { value: '', label: 'All Years' },
    { value: 1, label: 'Year 1' },
    { value: 2, label: 'Year 2' },
    { value: 3, label: 'Year 3' },
    { value: 4, label: 'Year 4' }
  ];

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Resources</h1>
          <p className="text-xl text-gray-600">
            Discover and download academic resources shared by the community
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                type="text"
                name="search"
                label="Search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search resources..."
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <select
                value={filters.categoryId}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {yearOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={() => setFilters({ search: '', categoryId: '', year: '', page: 1 })}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Resources ({pagination.totalCount})
            </h2>
            {filters.search && (
              <p className="text-gray-600">
                Showing results for "{filters.search}"
              </p>
            )}
          </div>
          
          {isLoggedIn && (
            <Button
              onClick={handleUploadClick}
              className="bg-blue-600 hover:bg-blue-700"
            >
              📤 Upload Resource
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-md">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
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
              Try adjusting your filters or be the first to upload a resource!
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
          <>
            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={page === pagination.currentPage ? "primary" : "outline"}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ResourceBrowse; 