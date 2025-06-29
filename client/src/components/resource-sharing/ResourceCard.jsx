import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { handleFileAccess } from '../../utils/fileUtils';

const ResourceCard = ({ resource }) => {
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

  const getFileTypeColor = (fileType) => {
    const colorMap = {
      pdf: 'bg-red-100 text-red-700',
      doc: 'bg-blue-100 text-blue-700',
      docx: 'bg-blue-100 text-blue-700',
      ppt: 'bg-orange-100 text-orange-700',
      pptx: 'bg-orange-100 text-orange-700',
      xls: 'bg-green-100 text-green-700',
      xlsx: 'bg-green-100 text-green-700',
      txt: 'bg-gray-100 text-gray-700',
      zip: 'bg-purple-100 text-purple-700',
      rar: 'bg-purple-100 text-purple-700',
      jpg: 'bg-pink-100 text-pink-700',
      jpeg: 'bg-pink-100 text-pink-700',
      png: 'bg-pink-100 text-pink-700',
      gif: 'bg-pink-100 text-pink-700',
      mp4: 'bg-indigo-100 text-indigo-700',
      avi: 'bg-indigo-100 text-indigo-700',
      mov: 'bg-indigo-100 text-indigo-700',
      mp3: 'bg-yellow-100 text-yellow-700',
      wav: 'bg-yellow-100 text-yellow-700'
    };
    return colorMap[fileType] || 'bg-gray-100 text-gray-700';
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

      console.log('Attempting to access file:', resource.fileUrl);
      
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
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              {getFileIcon(resource.fileType)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                {resource.title}
              </h3>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-gray-500">
                  {resource.category?.name}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">
                  Year {resource.year}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Description */}
        {resource.description && (
          <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
            {resource.description}
          </p>
        )}
        
        {/* File Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getFileTypeColor(resource.fileType)}`}>
                {resource.fileType.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {formatFileSize(resource.size)}
              </span>
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {resource.downloadCount} downloads
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-medium">
              {resource.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">By {resource.user?.name}</p>
              <p className="text-xs text-gray-500">{formatDate(resource.createdAt)}</p>
            </div>
          </div>
          
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
                {resource.fileType === 'pdf' ? 'View' : 'Download'}
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ResourceCard; 