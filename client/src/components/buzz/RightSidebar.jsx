import React from 'react';
import UserAvatar from '../ui/UserAvatar';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, FireIcon } from '@heroicons/react/24/outline';

const RightSidebar = ({ suggestedStudents, topContributors, trendingPosts }) => {
  return (
    <div className="hidden xl:block w-80 space-y-4">
      {/* Suggested Students */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Suggested Students
        </h3>
        <div className="space-y-3">
          {suggestedStudents?.slice(0, 5).map((student, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar user={student} size="md" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {student.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {student.branch} • {student.year} Year
                  </p>
                </div>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                Follow
              </button>
            </div>
          ))}
        </div>
        <Link
          to="#"
          className="flex items-center justify-center gap-2 mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
        >
          See all
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      {/* Top Contributors */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FireIcon className="w-5 h-5 text-orange-500" />
          Top Contributors
        </h3>
        <div className="space-y-3">
          {topContributors?.slice(0, 5).map((contributor, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 text-xs font-bold">
                  {index + 1}
                </div>
                <UserAvatar user={contributor} size="sm" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {contributor.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {contributor.posts} posts
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Trending Posts
        </h3>
        <div className="space-y-3">
          {trendingPosts?.slice(0, 3).map((post, index) => (
            <div key={index} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
              <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                {post.content}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{post.likes} likes</span>
                <span>•</span>
                <span>{post.comments} comments</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;

