import React from 'react';

const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'md':
        return 'w-12 h-12 text-base';
      case 'lg':
        return 'w-16 h-16 text-lg';
      case 'xl':
        return 'w-20 h-20 text-xl';
      case '2xl':
        return 'w-24 h-24 text-2xl';
      default:
        return 'w-12 h-12 text-base';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const getRandomColor = (name) => {
    if (!name) return 'bg-gray-500';
    
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-violet-500'
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name || 'User'}
        className={`${getSizeClasses()} rounded-full object-cover border-2 border-gray-200 ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div className="relative">
      <img
        src="/default-avatar.png"
        alt={user?.name || 'User'}
        className={`${getSizeClasses()} rounded-full object-cover border-2 border-gray-200 ${className} hidden`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div 
        className={`${getSizeClasses()} ${getRandomColor(user?.name)} rounded-full flex items-center justify-center text-white font-bold border-2 border-gray-200 ${className}`}
        style={{ display: user?.avatarUrl ? 'none' : 'flex' }}
      >
        {getInitials(user?.name)}
      </div>
    </div>
  );
};

export default UserAvatar; 