import React from 'react';
import { Link } from 'react-router-dom';

const MessageList = ({ conversations, activeUserId, onSelectConversation }) => {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
        <p className="text-center text-gray-500 text-sm">
          Start a new conversation to connect with others.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => {
        const isActive = conversation.userId === activeUserId;
        const hasUnread = conversation.unreadCount > 0;
        
        return (
          <div
            key={conversation.userId}
            onClick={() => onSelectConversation(conversation.userId, conversation)}
            className={`
              block cursor-pointer transition-all duration-200 
              hover:bg-gray-50 active:bg-gray-100
              ${isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
              touch-manipulation
            `}
          >
            <div className="flex items-center p-3 lg:p-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {conversation.isAnonymous ? (
                  <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-sm">
                    <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                ) : (
                  <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm lg:text-base font-semibold shadow-sm">
                    {conversation.name ? conversation.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="ml-3 lg:ml-4 flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="font-medium text-gray-900 text-sm lg:text-base truncate">
                    {conversation.isAnonymous ? 'Anonymous User' : conversation.name}
                  </h4>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {conversation.lastMessageTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                    {conversation.lastMessage}
                  </p>
                  {hasUnread && (
                    <span className="flex-shrink-0 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white min-w-[20px] text-center">
                      {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList; 