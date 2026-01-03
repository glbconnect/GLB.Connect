import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { HeartIcon, ChatBubbleLeftIcon, UserPlusIcon, ShareIcon, BellIcon } from '@heroicons/react/24/outline';
import UserAvatar from '../ui/UserAvatar';

const NotificationDropdown = ({ notifications, onMarkAsRead, onClose }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-4 text-center">
        <BellIcon className="w-10 h-10 mx-auto text-gray-300 mb-2" />
        <p className="text-gray-500">No notifications yet</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'LIKE':
        return <HeartIcon className="w-4 h-4 text-red-500" />;
      case 'COMMENT':
        return <ChatBubbleLeftIcon className="w-4 h-4 text-blue-500" />;
      case 'FOLLOW':
        return <UserPlusIcon className="w-4 h-4 text-green-500" />;
      case 'SHARE':
        return <ShareIcon className="w-4 h-4 text-purple-500" />;
      default:
        return <BellIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLink = (notification) => {
    if (notification.type === 'FOLLOW') {
      return `/profile/${notification.senderId}`;
    }
    // Assuming Buzz posts link
    return `/buzz`; 
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-[500px] overflow-y-auto">
      <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl sticky top-0 z-10">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <button 
          onClick={() => onMarkAsRead('all')}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Mark all as read
        </button>
      </div>
      
      <div className="divide-y divide-gray-50">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-3 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
            onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
          >
            <Link 
              to={getLink(notification)} 
              className="flex items-start gap-3"
              onClick={onClose}
            >
              <div className="relative">
                <UserAvatar user={notification.sender} size="sm" />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  {getIcon(notification.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{notification.sender?.name}</span>{' '}
                  <span className="text-gray-600">{notification.message}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;
