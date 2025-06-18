import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { createResource, getCategories } from '../services/api';
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
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };

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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Please log in to upload resources
            </h2>
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Resource</h1>
          <p className="text-gray-600">
            Share your academic resources with the community
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <Input
              type="text"
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter resource title"
              required
              fullWidth
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your resource (optional)"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="categoryId" className="block text-gray-700 font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="year" className="block text-gray-700 font-medium mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Year</option>
                {yearOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="file" className="block text-gray-700 font-medium mb-2">
              File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
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
                <div className="text-4xl mb-4">📁</div>
                <p className="text-gray-600 mb-2">
                  Click to select a file or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, DOC, PPT, XLS, TXT, ZIP, Images, Videos, Audio
                </p>
                <p className="text-sm text-gray-500">
                  Maximum size: 50MB
                </p>
              </label>
            </div>
            {formData.file && (
              <div className="mt-4 p-3 bg-green-50 rounded-md">
                <p className="text-green-700">
                  Selected file: {formData.file.name}
                </p>
              </div>
            )}
          </div>
          
          {previewUrl && (
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                File Preview
              </label>
              <iframe
                src={previewUrl}
                className="w-full h-64 border border-gray-300 rounded-md"
                title="File preview"
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/resources')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isUploading}
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? 'Uploading...' : 'Upload Resource'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ResourceUpload; 