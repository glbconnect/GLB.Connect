import React, { useState } from 'react';
import UserAvatar from '../ui/UserAvatar';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const CreatePost = ({ currentUser, onCreatePost }) => {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() || imageFile) {
      onCreatePost({
        content: content.trim(),
        image: imagePreview,
        imageFile: imageFile
      });
      setContent('');
      setImagePreview(null);
      setImageFile(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div className="flex gap-3 mb-3">
        <UserAvatar user={currentUser} size="md" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
          />
        </div>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative mb-3 rounded-lg overflow-hidden">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-auto max-h-96 object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-1.5 text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <label className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
          <PhotoIcon className="w-5 h-5" />
          <span className="font-medium">Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </label>

        <Button
          onClick={handleSubmit}
          disabled={!content.trim() && !imageFile}
          variant="primary"
          size="md"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;

