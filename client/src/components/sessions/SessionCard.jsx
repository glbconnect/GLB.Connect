import React from 'react';
import Button from '../ui/Button';
import { formatDistanceToNow, format } from 'date-fns';

const SessionCard = ({ session, isAdmin, onStart, onEnd, onEdit, onDelete, onJoin, onViewDetails }) => {
  const isLive = session.status === 'LIVE';
  const isScheduled = session.status === 'SCHEDULED';
  const isEnded = session.status === 'ENDED';
  const isCreator = isAdmin && session.creator?.id;

  const handleCardClick = (e) => {
    // Don't trigger if clicking on buttons or action elements
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    if (onViewDetails) {
      onViewDetails(session);
    }
  };

  const getStatusBadge = () => {
    if (isLive) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 animate-pulse">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          LIVE
        </span>
      );
    } else if (isScheduled) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
          Scheduled
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
          Ended
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPp');
    } catch (error) {
      return dateString;
    }
  };

  const getTimeUntil = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      if (date > now) {
        return formatDistanceToNow(date, { addSuffix: true });
      }
      return 'Now';
    } catch (error) {
      return '';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{session.title}</h3>
            {getStatusBadge()}
          </div>
          {isCreator && (
            <div className="flex gap-2 ml-4">
              {isScheduled && (
                <button
                  onClick={() => onEdit(session)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Session"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {!isEnded && (
                <button
                  onClick={() => onDelete(session.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Session"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {session.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{session.description}</p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Scheduled: {formatDate(session.scheduledAt)}</span>
          </div>

          {isLive && session.startedAt && (
            <div className="flex items-center text-gray-600 text-sm">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Started: {formatDate(session.startedAt)}</span>
            </div>
          )}

          {session.creator && (
            <div className="flex items-center text-gray-600 text-sm">
              <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Host: {session.creator.name}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          {isCreator && isScheduled && (
            <Button
              onClick={() => onStart(session)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Session
            </Button>
          )}

          {isCreator && isLive && (
            <Button
              onClick={() => onEnd(session.id)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
              </svg>
              End Session
            </Button>
          )}

          {isLive && !isCreator && (
            <Button
              onClick={() => onJoin(session)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 flex-1 justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Join Session
            </Button>
          )}

          {isScheduled && !isCreator && (
            <div className="flex-1 text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-lg font-medium">
              Starts {getTimeUntil(session.scheduledAt)}
            </div>
          )}

          {isEnded && (
            <div className="flex-1 text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-lg font-medium">
              Session Ended
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;

