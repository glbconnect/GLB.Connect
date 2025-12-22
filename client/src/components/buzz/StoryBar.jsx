import React, { useState } from 'react';
import UserAvatar from '../ui/UserAvatar';
import { PlusIcon } from '@heroicons/react/24/outline';
import StoryUploadModal from './StoryUploadModal';

const StoryBar = ({ stories, currentUser, onStoryCreated, onStoryClick }) => {
  const [showStoryModal, setShowStoryModal] = useState(false);

  const handleStoryCreated = () => {
    setShowStoryModal(false);
    if (onStoryCreated) {
      onStoryCreated();
    }
  };

  const handleStoryClick = (storyIndex) => {
    if (onStoryClick) {
      onStoryClick(storyIndex);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
        {/* Create Story */}
        <div 
          onClick={() => setShowStoryModal(true)}
          className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <UserAvatar user={currentUser} size="lg" />
            <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 border-2 border-white dark:border-gray-800">
              <PlusIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Your Story
          </span>
        </div>

        {/* Stories */}
        {stories.map((story, index) => (
          <div
            key={story.id || index}
            onClick={() => handleStoryClick(index)}
            className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  <UserAvatar user={story.user} size="lg" className="!w-full !h-full" />
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center truncate w-full">
              {story.user.name.split(' ')[0]}
            </span>
          </div>
        ))}
        </div>
      </div>

      <StoryUploadModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        onSuccess={handleStoryCreated}
      />
    </>
  );
};

export default StoryBar;

