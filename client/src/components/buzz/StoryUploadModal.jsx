import React, { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import { createBuzzStory } from '../../services/api';

const StoryUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('image', imageFile);

      await createBuzzStory(formData);
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Error creating story:', err);
      setError(err.response?.data?.error || 'Failed to upload story. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setImagePreview(null);
    setImageFile(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Create Your Story
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {error && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}

          {!imagePreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
              <PhotoIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Upload an image for your story
              </p>
              <label className="inline-block px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Story will expire after 24 hours
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Story preview"
                  className="w-full h-auto max-h-64 sm:max-h-96 object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-1.5 text-white transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 text-center">
                Your story will be visible for 24 hours
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 p-3 sm:p-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
            className="text-sm sm:text-base px-3 sm:px-4"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!imageFile || isUploading}
            loading={isUploading}
            className="text-sm sm:text-base px-3 sm:px-4"
          >
            {isUploading ? 'Uploading...' : 'Post Story'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryUploadModal;

