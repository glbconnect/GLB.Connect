import React from 'react';

const ResourceItem = ({ resource }) => {
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
              <span>📏 {resource.size}</span>
              <span>⬇️ {resource.downloadCount} downloads</span>
              <span>👤 {resource.user?.name || 'Unknown'}</span>
              <span>📅 {formatDate(resource.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <a
            href={`${import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || ""}${resource.fileUrl}`}
            download
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceItem; 