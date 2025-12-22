import React, { useState, useEffect, useRef } from 'react';
import UserAvatar from '../ui/UserAvatar';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { togglePostLike, addPostComment, getPostComments, repostBuzzPost, deleteBuzzPost } from '../../services/api';

const PostCard = ({ post, onUpdate, currentUser, onDelete, onRepost }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (showComments && comments.length === 0) {
      loadComments();
    }
  }, [showComments]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const loadComments = async () => {
    try {
      const commentsData = await getPostComments(post.id);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      const result = await togglePostLike(post.id);
      setIsLiked(result.liked);
      setLikesCount(prev => result.liked ? prev + 1 : prev - 1);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newComment = await addPostComment(post.id, commentText);
      setComments([newComment, ...comments]);
      setCommentsCount(prev => prev + 1);
      setCommentText('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRepost = async () => {
    try {
      const repostedPost = await repostBuzzPost(post.id);
      if (onRepost) {
        onRepost(repostedPost);
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error reposting:', error);
      alert('Failed to repost. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteBuzzPost(post.id);
      if (onDelete) {
        onDelete(post.id);
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
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

  const isOwnPost = currentUser?.id === post.user?.id;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-3 sm:mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <UserAvatar user={post.user} size="md" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
              {post.user.name}
            </h3>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap">
              <span className="truncate">{post.user.branch}</span>
              <span>•</span>
              <span>{post.user.year} Year</span>
              <span>•</span>
              <span>{formatTimestamp(post.timestamp)}</span>
            </div>
          </div>
        </div>
        <div className="relative flex-shrink-0 ml-2" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <EllipsisHorizontalIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              {isOwnPost && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50 rounded-t-lg"
                >
                  <TrashIcon className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Post'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-2 sm:mb-3">
        <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="mb-2 sm:mb-3 rounded-lg overflow-hidden -mx-3 sm:-mx-4">
          <img 
            src={post.image} 
            alt="Post content" 
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 sm:gap-4">
          {likesCount > 0 && (
            <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
          )}
          {commentsCount > 0 && (
            <span>{commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}</span>
          )}
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-around pt-2 gap-1 sm:gap-0">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition-colors flex-1 justify-center sm:flex-initial ${
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
          <span className="font-medium text-xs sm:text-base hidden sm:inline">Like</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-1 justify-center sm:flex-initial"
        >
          <ChatBubbleLeftIcon className="w-5 h-5" />
          <span className="font-medium text-xs sm:text-base hidden sm:inline">Comment</span>
        </button>
        
        <button 
          onClick={handleRepost}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-1 justify-center sm:flex-initial"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span className="font-medium text-xs sm:text-base hidden sm:inline">Repost</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Existing Comments */}
          {comments.length > 0 && (
            <div className="mb-3 sm:mb-4 space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2 sm:gap-3">
                  <UserAvatar user={comment.user} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {comment.user.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 break-words">
                        {comment.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatTimestamp(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2 sm:gap-3">
            <UserAvatar user={{ name: 'You' }} size="sm" />
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
