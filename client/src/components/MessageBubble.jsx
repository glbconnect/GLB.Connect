import React from 'react';

const MessageBubble = ({ message, isOwn }) => {
  const formattedTime = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  
  // Render message status indicator
  const renderMessageStatus = () => {
    if (!isOwn) return null;
    
    // Message is still sending (temporary ID)
    if (message.id && message.id.toString().startsWith('temp-')) {
      return (
        <span className="ml-1 lg:ml-2">
          <svg className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
      );
    }
    
    // Message delivered but not seen
    if (!message.seen) {
      return (
        <span className="ml-1 lg:ml-2">
          <svg className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" />
          </svg>
        </span>
      );
    }
    
    // Message seen
    return (
      <span className="ml-1 lg:ml-2">
        <svg className="h-3 w-3 lg:h-4 lg:w-4 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 12.75l6 6 15-15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" />
        </svg>
      </span>
    );
  };
  
  return (
    <div className={`flex w-full mb-2 lg:mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for other user's messages */}
      {!isOwn && (
        <div className="mr-2 flex-shrink-0 self-end">
          <div className="flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600 text-xs lg:text-sm font-medium shadow-sm">
            {message.sender?.name ? message.sender.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
      )}
      
      <div className={`flex max-w-[85%] lg:max-w-[75%] flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender name for other user's messages */}
        {!isOwn && (
          <div className="mb-1">
            {message.isAnonymous ? (
              <span className="text-xs font-medium text-gray-500">Anonymous</span>
            ) : (
              <span className="text-xs font-medium text-gray-700">{message.sender?.name || 'User'}</span>
            )}
          </div>
        )}
        
        {/* Message bubble */}
        <div
          className={`
            rounded-2xl px-3 py-2 lg:px-4 lg:py-2.5 shadow-sm
            ${isOwn
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
              : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
            }
            break-words
          `}
        >
          <p className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        {/* Message time and status */}
        <div className="mt-1 flex items-center text-xs text-gray-500">
          <span>{formattedTime}</span>
          {renderMessageStatus()}
        </div>
      </div>
      
      {/* Avatar for own messages */}
      {isOwn && (
        <div className="ml-2 flex-shrink-0 self-end">
          <div className="flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs lg:text-sm font-medium shadow-sm">
            {message.sender?.name ? message.sender.name.charAt(0).toUpperCase() : 'Y'}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble; 