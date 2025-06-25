import React from 'react';
import Button from './Button';

const UserCard = ({ user, onConnect, connectionStatus }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center w-full max-w-xs mx-auto">
      <img
        src={user.avatarUrl || '/default-avatar.png'}
        alt={user.name || 'No Name'}
        className="w-20 h-20 rounded-full object-cover mb-3 border"
        onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
      />
      <div className="font-semibold text-lg text-center mb-1">{user.name || 'No Name'}</div>
      <div className="text-sm text-gray-500 mb-1">Batch: {user.batchYear || 'N/A'}</div>
      <div className="text-xs text-gray-700 mb-2 text-center">
        {user.skills ? (
          <>
            Skills: {user.skills.split(',').map(skill => (
              <span key={skill.trim()} className="inline-block bg-yellow-100 text-yellow-800 rounded px-2 py-0.5 m-0.5">{skill.trim()}</span>
            ))}
          </>
        ) : (
          <span className="text-gray-400">No skills listed</span>
        )}
      </div>
      {connectionStatus === 'none' && (
        <Button onClick={onConnect} className="mt-2 w-full">Message</Button>
      )}
      {connectionStatus === 'pending' && (
        <div className="mt-2 text-yellow-600 text-sm">Request Sent</div>
      )}
      {connectionStatus === 'connected' && (
        <div className="mt-2 text-green-600 text-sm">Connected</div>
      )}
    </div>
  );
};

export default UserCard; 