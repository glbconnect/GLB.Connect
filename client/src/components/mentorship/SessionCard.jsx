import React from 'react';
import UserAvatar from '../ui/UserAvatar';
import { CalendarIcon, ClockIcon, UsersIcon, VideoCameraIcon, LinkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const SessionCard = ({ session, onEnroll, isMentor = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const isLive = session.isLive || (session.scheduledAt && 
    new Date(session.scheduledAt) <= new Date() && 
    new Date(new Date(session.scheduledAt).getTime() + session.duration * 60000) >= new Date());

  const isPast = session.scheduledAt && new Date(session.scheduledAt) < new Date();

  const handleEnroll = () => {
    if (onEnroll && !session.isEnrolled) {
      onEnroll(session.id);
    }
  };

  const handleJoinMeeting = () => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <UserAvatar user={session.mentor} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {session.mentor.name}
              </h3>
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                Alumni
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Batch {session.mentor.batchYear}
            </p>
          </div>
        </div>
        {isLive && (
          <span className="px-3 py-1 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
            Live Now
          </span>
        )}
        {isPast && !isLive && (
          <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
            Past Session
          </span>
        )}
      </div>

      {/* Session Content */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {session.title}
        </h2>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
            {session.topic}
          </span>
        </div>
        {session.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {session.description}
          </p>
        )}
      </div>

      {/* Session Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <CalendarIcon className="w-5 h-5" />
          <span>{formatDate(session.scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <ClockIcon className="w-5 h-5" />
          <span>{formatDuration(session.duration)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <UsersIcon className="w-5 h-5" />
          <span>
            {session.seatsRemaining !== undefined ? (
              <>
                {session.seatsRemaining} of {session.maxParticipants} seats remaining
              </>
            ) : (
              <>
                {session.enrolledCount || 0} enrolled
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <VideoCameraIcon className="w-5 h-5" />
          <span>{session.mode}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {session.isEnrolled || isMentor ? (
          <>
            {(isLive || isMentor) && session.meetingLink && (
              <Button
                onClick={handleJoinMeeting}
                variant="primary"
                className="flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                {isLive ? 'Join Meeting' : 'Meeting Link'}
              </Button>
            )}
            {session.isEnrolled && (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ Enrolled
              </span>
            )}
          </>
        ) : (
          <>
            {session.seatsRemaining > 0 && !isPast ? (
              <Button
                onClick={handleEnroll}
                variant="primary"
              >
                I'm Interested
              </Button>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {session.seatsRemaining === 0 ? 'Session Full' : 'Session Ended'}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SessionCard;

