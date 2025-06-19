import React from 'react';

const OttGrid = React.memo(({ platforms, onPlatformClick }) => {
  // This guard clause prevents rendering if the whole array is missing.
  if (!platforms || platforms.length === 0) return null;

  return (
    <div className="mb-8 px-4 md:px-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Your Apps & Channels</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
        {platforms
          // FIX: Added a filter to ensure we only process valid platform objects.
          // This prevents crashes if the platforms array contains null or undefined entries.
          .filter(platform => platform && platform.id) 
          .map((platform) => (
            <button
              key={platform.id}
              onClick={() => onPlatformClick(platform.page, platform.name)}
              className={`aspect-[16/9] rounded-lg shadow-lg flex items-center justify-center p-2 md:p-4 transition-all duration-200 ease-in-out transform hover:scale-105 
                          ${platform.themeColor || 'bg-gray-700 hover:bg-gray-600'}`}
              aria-label={`Open ${platform.name}`}
            >
              <img src={platform.logoUrl} alt={`${platform.name} logo`} className="max-h-12 md:max-h-16 w-auto object-contain" />
            </button>
        ))}
      </div>
    </div>
  );
});

export default OttGrid;
