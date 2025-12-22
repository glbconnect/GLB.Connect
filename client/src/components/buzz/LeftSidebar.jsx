import React from 'react';
import UserAvatar from '../ui/UserAvatar';
import { Link } from 'react-router-dom';

const LeftSidebar = ({ currentUser, stats }) => {
  return (
    <div className="hidden lg:block w-64 space-y-4">
      {/* User Profile Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <UserAvatar user={currentUser} size="xl" />
          <h3 className="mt-3 font-semibold text-gray-900 dark:text-white text-lg">
            {currentUser?.name || 'User Name'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {currentUser?.branch || 'Computer Science'} • {currentUser?.year || '3rd'} Year
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats?.posts || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Posts
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats?.followers || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Followers
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats?.following || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Following
            </div>
          </div>
        </div>

        <Link
          to="/profile"
          className="block mt-4 text-center text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default LeftSidebar;

