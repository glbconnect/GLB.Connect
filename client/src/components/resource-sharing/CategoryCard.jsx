import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Academics Notes': '📚',
      'Gate Notes': '🎯',
      'Quantum': '⚛️',
      'Placement Resources': '💼',
      'Others': '📁'
    };
    return iconMap[categoryName] || '📁';
  };

  return (
    <Link
      to={`/resources/category/${category.slug}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{getCategoryIcon(category.name)}</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {category.description}
              </p>
            )}
            <div className="mt-3 text-sm text-gray-500">
              {category.resources?.length || 0} resources available
            </div>
          </div>
          <div className="text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard; 