import React, { useState } from 'react';
import UserAvatar from '../ui/UserAvatar';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ShareIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <UserAvatar user={post.user} size="md" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {post.user.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{post.user.branch}</span>
              <span>•</span>
              <span>{post.user.year} Year</span>
              <span>•</span>
              <span>{formatTimestamp(post.timestamp)}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <img 
            src={post.image} 
            alt="Post content" 
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          {likesCount > 0 && (
            <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
          )}
          {post.comments > 0 && (
            <span>{post.comments} {post.comments === 1 ? 'comment' : 'comments'}</span>
          )}
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-around pt-2">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isLiked
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {isLiked ? (
            <HeartIconSolid className="w-5 h-5" />
          ) : (
            <HeartIcon className="w-5 h-5" />
          )}
          <span className="font-medium">Like</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChatBubbleLeftIcon className="w-5 h-5" />
          <span className="font-medium">Comment</span>
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <ShareIcon className="w-5 h-5" />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <UserAvatar user={{ name: 'You' }} size="sm" />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Write a comment..."
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;

