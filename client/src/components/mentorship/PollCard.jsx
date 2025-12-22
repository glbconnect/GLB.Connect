import React from 'react';
import UserAvatar from '../ui/UserAvatar';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const PollCard = ({ poll, onVote }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVote = (optionId) => {
    if (!poll.hasVoted) {
      onVote(poll.id, optionId);
    }
  };

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <UserAvatar user={poll.mentor} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {poll.mentor.name}
              </h3>
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                Alumni
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Batch {poll.mentor.batchYear}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Expires: {formatDate(poll.expiresAt)}
          </p>
        </div>
      </div>

      {/* Poll Content */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {poll.title}
        </h2>
        {poll.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {poll.description}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {poll.options.map((option) => {
          const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
          const isSelected = poll.userVote === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={poll.hasVoted}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : poll.hasVoted
                  ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-gray-900 dark:text-white font-medium">
                    {option.text}
                  </span>
                  {isSelected && (
                    <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {option.voteCount} {option.voteCount === 1 ? 'vote' : 'votes'}
                </span>
              </div>
              {poll.hasVoted && totalVotes > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {poll.hasVoted ? (
          <span className="text-green-600 dark:text-green-400">✓ You've voted</span>
        ) : (
          <span>Click an option to vote</span>
        )}
        {' • '}
        <span>{totalVotes} total {totalVotes === 1 ? 'vote' : 'votes'}</span>
      </div>
    </div>
  );
};

export default PollCard;

