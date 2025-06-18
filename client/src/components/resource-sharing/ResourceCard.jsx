import React from 'react';
import { Link } from 'react-router-dom';

const ResourceCard = ({ resource }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getFileIcon(resource.fileType)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-500">
                {resource.category?.name} • Year {resource.year}
              </p>
            </div>
          </div>
        </div>
        
        {resource.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {resource.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span>📁 {resource.fileType.toUpperCase()}</span>
            <span>📏 {resource.size}</span>
            <span>⬇️ {resource.downloadCount} downloads</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <p>By {resource.user?.name}</p>
            <p>{formatDate(resource.createdAt)}</p>
          </div>
          
          <div className="flex space-x-2">
            <Link
              to={`/resources/${resource.id}`}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>
            <a
              href={resource.fileUrl}
              download
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard; 