import React from 'react';
import { PlayCircle, Info } from 'lucide-react';

const FeaturedSection = React.memo(({ item, onItemClick }) => {
  if (!item) return <div className="h-[60vh] md:h-[70vh] bg-gray-800 flex items-center justify-center text-white">Loading featured content...</div>;
  
  return (
    <div 
      className="relative h-[60vh] md:h-[70vh] bg-cover bg-center mb-8 group" 
      style={{ backgroundImage: `url(${item.poster_url || item.imageUrl})` }} 
      role="banner"
      onClick={() => onItemClick(item, 'details')}
      tabIndex="0"
      onKeyPress={(e) => e.key === 'Enter' && onItemClick(item, 'details')}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent opacity-90"></div>
      <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-12 text-white">
        {item.logoUrl && <img src={item.logoUrl} alt={`${item.title} logo`} className="w-32 md:w-48 mb-4 h-auto" onError={(e) => e.target.style.display='none'} />}
        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 max-w-2xl">{item.title}</h1>
        <p className="text-sm md:text-lg mb-4 md:mb-6 max-w-xl line-clamp-3">{item.description}</p>
        <div className="flex space-x-3">
          <button onClick={(e) => { e.stopPropagation(); onItemClick(item, 'play'); }} className="flex items-center bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors text-sm md:text-base" aria-label={`Play ${item.title}`}>
              <PlayCircle size={20} className="mr-2" /> Play
          </button>
          <button onClick={(e) => { e.stopPropagation(); onItemClick(item, 'details'); }} className="flex items-center bg-gray-700/70 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-600/70 transition-colors text-sm md:text-base" aria-label={`More info about ${item.title}`}>
              <Info size={20} className="mr-2" /> More Info
          </button>
        </div>
      </div>
    </div>
  );
});

export default FeaturedSection;
