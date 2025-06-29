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

  const getCategoryColor = (categoryName) => {
    const colorMap = {
      'Academics Notes': 'from-blue-500 to-cyan-500',
      'Gate Notes': 'from-purple-500 to-pink-500',
      'Quantum': 'from-indigo-500 to-purple-500',
      'Placement Resources': 'from-green-500 to-emerald-500',
      'Others': 'from-gray-500 to-slate-500'
    };
    return colorMap[categoryName] || 'from-gray-500 to-slate-500';
  };

  return (
    <Link
      to={`/resources/category/${category.slug}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
    >
      <div className="p-8">
        <div className="flex items-center space-x-6">
          <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${getCategoryColor(category.name)} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {getCategoryIcon(category.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                {category.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">{category.resources?.length || 0} resources</span>
              </div>
              <div className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300">
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </Link>
  );
};

export default CategoryCard; 