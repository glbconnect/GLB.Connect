import React, { useState } from 'react';
import { handleFileAccess } from '../../utils/fileUtils';

const ResourceItem = ({ resource }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getFileIcon = (fileType) => {
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      ppt: '📊',
      pptx: '📊',
      xls: '📈',
      xlsx: '📈',
      txt: '📄',
      zip: '📦',
      rar: '📦',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      mp4: '🎥',
      avi: '🎥',
      mov: '🎥',
      mp3: '🎵',
      wav: '🎵'
    };
    return iconMap[fileType] || '📄';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (size) => {
    if (!size) return 'Unknown';
    const bytes = parseInt(size);
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleViewFile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!resource.fileUrl) {
        throw new Error('File URL not available');
      }
      await handleFileAccess(
        resource.fileUrl,
        resource.title || 'download',
        resource.fileType
      );
    } catch (error) {
      console.error('Error accessing file:', error);
      alert(`Unable to access file. Please try again later or contact support.\n\nError: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-3xl">{getFileIcon(resource.fileType)}</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {resource.title}
            </h3>
            {resource.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {resource.description}
              </p>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>📁 {resource.fileType.toUpperCase()}</span>
              <span>📏 {formatFileSize(resource.size)}</span>
              <span>👤 {resource.user?.name || 'Unknown'}</span>
              <span>📅 {formatDate(resource.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={handleViewFile}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 text-white text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceItem; 