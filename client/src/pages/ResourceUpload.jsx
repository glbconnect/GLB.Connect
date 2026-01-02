import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { createResource, getCategories, seedCategories } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const yearOptions = [
  { value: 1, label: 'Year 1' },
  { value: 2, label: 'Year 2' },
  { value: 3, label: 'Year 3' },
  { value: 4, label: 'Year 4' }
];

const ResourceUpload = ({ isLoggedIn, onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    year: '',
    file: null
  });
  const [categories, setCategories] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const fetchCategories = async (retryCount = 0) => {
    try {
      setIsLoadingCategories(true);
      setCategoryError('');
      const response = await getCategories();
      console.log('Categories response:', response); // Debug log
      if (response.success) {
        setCategories(response.data || []);
      } else {
        setCategoryError('Failed to load categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategoryError('Failed to load categories');
      
      // Retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        setTimeout(() => {
          fetchCategories(retryCount + 1);
        }, Math.pow(2, retryCount) * 1000); // 1s, 2s, 4s delays
      }
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleSeedCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setCategoryError('');
      
      const result = await seedCategories();
      
      if (result.success) {
        // Refetch categories after seeding
        await fetchCategories();
      } else {
        setCategoryError('Failed to seed categories');
      }
    } catch (err) {
      console.error('Error seeding categories:', err);
      setCategoryError('Failed to seed categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        file
      });
      
      // Create a preview for PDF files
      if (file.type === 'application/pdf') {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!formData.title || !formData.categoryId || !formData.year || !formData.file) {
      setError('Please fill all required fields');
      return;
    }
    
    setIsUploading(true);
    
    // Create FormData object for file upload
    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description || '');
    uploadData.append('categoryId', formData.categoryId);
    uploadData.append('year', formData.year);
    uploadData.append('file', formData.file);
    
    try {
      const response = await createResource(uploadData);
      
      if (response.success) {
        // Get the slug from the selected category
        const category = categories.find(cat => cat.id === parseInt(formData.categoryId));
        const categorySlug = category ? category.slug : 'academics-notes';
        
        // Redirect to the resource category page
        navigate(`/resources/category/${categorySlug}`);
      } else {
        setError(response.message || 'Failed to upload resource');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload resource. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-6">🔒</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Please log in to upload resources
            </h2>
            <p className="text-gray-600 mb-8">
              You need to be logged in to share resources with the community.
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (currentUser?.role !== 'ADMIN') {
    return (
      <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-6">🚫</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-8">
              Only Admin users can upload resources. Please contact an administrator if you need to upload resources.
            </p>
            <Button 
              onClick={() => navigate('/resources')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Back to Resources
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Upload Resource
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Share your academic resources with the community. Help your peers by uploading 
              notes, study materials, and other educational content.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 mb-8 rounded-2xl flex items-center">
            <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Title Field */}
          <div className="mb-8">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-3">
              Resource Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a descriptive title for your resource"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          
          {/* Description Field */}
          <div className="mb-8">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-3">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe your resource to help others understand its content and value"
            ></textarea>
          </div>
          
          {/* Category and Year Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label htmlFor="categoryId" className="block text-gray-700 font-semibold mb-3">
                Category <span className="text-red-500">*</span>
              </label>
              {isLoadingCategories ? (
                <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-gray-500">Loading categories...</span>
                </div>
              ) : categories.length > 0 ? (
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-4 py-3 border border-red-200 rounded-xl bg-red-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-red-700 text-sm">No categories available</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSeedCategories}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                    >
                      Load Categories
                    </button>
                  </div>
                </div>
              )}
              {categoryError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-red-700 text-sm">{categoryError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchCategories()}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="year" className="block text-gray-700 font-semibold mb-3">
                Year <span className="text-red-500">*</span>
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                required
              >
                <option value="">Select year</option>
                {yearOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* File Upload Field */}
          <div className="mb-8">
            <label htmlFor="file" className="block text-gray-700 font-semibold mb-3">
              File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                required
              />
              <label htmlFor="file" className="cursor-pointer">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-600 mb-2 text-lg">
                  Click to select a file or drag and drop
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Supported formats: PDF, DOC, PPT, XLS, TXT, ZIP, Images, Videos, Audio
                </p>
                <p className="text-sm text-gray-500">
                  Maximum size: 50MB
                </p>
              </label>
            </div>
            {formData.file && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-green-700 font-medium">File selected successfully</p>
                  <p className="text-green-600 text-sm">{formData.file.name}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* File Preview */}
          {previewUrl && (
            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-3">
                File Preview
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <iframe
                  src={previewUrl}
                  className="w-full h-64"
                  title="File preview"
                />
              </div>
            </div>
          )}
          
          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/resources')}
              className="px-8 py-3 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isUploading}
              disabled={isUploading || isLoadingCategories}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isUploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Uploading...
                </div>
              ) : (
                'Upload Resource'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ResourceUpload; 