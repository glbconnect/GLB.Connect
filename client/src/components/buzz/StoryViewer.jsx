import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import UserAvatar from '../ui/UserAvatar';

const STORY_DURATION = 5000; // 5 seconds per story

const StoryViewer = ({ stories, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const currentStory = stories[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < stories.length - 1) {
        return prevIndex + 1;
      } else {
        onClose();
        return prevIndex;
      }
    });
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      } else {
        onClose();
        return prevIndex;
      }
    });
  };

  useEffect(() => {
    if (!currentStory) {
      onClose();
      return;
    }

    // Reset progress
    setProgress(0);

    // Clear any existing intervals/timeouts
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start progress animation
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(newProgress);
    }, 50); // Update every 50ms for smooth animation

    // Auto-advance to next story
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, STORY_DURATION);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, currentStory, stories.length]);

  const handleProgressClick = (index) => {
    setCurrentIndex(index);
  };

  if (!stories || stories.length === 0 || !currentStory) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress Bars */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex gap-1 z-10">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-0.5 sm:h-1 bg-white bg-opacity-30 rounded-full overflow-hidden cursor-pointer"
            onClick={() => handleProgressClick(index)}
          >
            <div
              className={`h-full transition-all duration-75 ${
                index < currentIndex
                  ? 'bg-white'
                  : index === currentIndex
                  ? 'bg-white'
                  : 'bg-transparent'
              }`}
              style={{
                width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* User Info */}
      <div className="absolute top-8 sm:top-14 left-2 sm:left-4 right-2 sm:right-4 flex items-center gap-2 sm:gap-3 z-10">
        <UserAvatar user={currentStory.user} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-xs sm:text-sm truncate">{currentStory.user.name}</p>
          <p className="text-white text-opacity-70 text-xs">
            {currentStory.createdAt 
              ? new Date(currentStory.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : ''}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors p-1 sm:p-2 flex-shrink-0"
        >
          <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Story Image */}
      <div className="w-full h-full flex items-center justify-center px-2 sm:px-0">
        <img
          src={currentStory.imageUrl}
          alt={`Story by ${currentStory.user.name}`}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x600?text=Story+Not+Available';
          }}
        />
      </div>

      {/* Navigation Buttons - Hidden on mobile, shown on desktop */}
      <div className="absolute inset-0 hidden sm:flex items-center justify-between p-4 pointer-events-none">
        <button
          onClick={handlePrevious}
          className="text-white hover:text-gray-300 transition-colors p-2 pointer-events-auto"
          disabled={currentIndex === 0}
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>
        <button
          onClick={handleNext}
          className="text-white hover:text-gray-300 transition-colors p-2 pointer-events-auto"
          disabled={currentIndex === stories.length - 1}
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>
      </div>

      {/* Click Areas for Navigation - Full width on mobile for better touch targets */}
      <div className="absolute inset-0 flex">
        <div
          className="flex-1 cursor-pointer"
          style={{ touchAction: 'manipulation' }}
          onClick={handlePrevious}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePrevious();
          }}
        />
        <div
          className="flex-1 cursor-pointer"
          style={{ touchAction: 'manipulation' }}
          onClick={handleNext}
          onTouchStart={(e) => {
            e.preventDefault();
            handleNext();
          }}
        />
      </div>
    </div>
  );
};

export default StoryViewer;

