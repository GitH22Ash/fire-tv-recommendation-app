import React from 'react';

const ContentItem = React.memo(({ item, onClick }) => {
  const baseClasses = "flex-shrink-0 m-2 cursor-pointer transform transition-all duration-200 ease-in-out rounded-lg overflow-hidden shadow-lg bg-gray-800 group flex flex-col hover:scale-105 hover:ring-2 hover:ring-sky-400";
  const standardSize = "w-48 md:w-56 lg:w-64"; 
  let imageClassName = `w-full object-cover`;
  imageClassName += item.type === 'youtube_video' ? ' aspect-video h-auto' : ' aspect-[2/3] h-auto';

  return (
    <div className={`${baseClasses} ${standardSize}`}
      onClick={() => onClick(item, 'details')} role="button" tabIndex="0"
      onKeyPress={(e) => e.key === 'Enter' && onClick(item, 'details')}>
      <img src={item.poster_url} alt={item.title} className={imageClassName}
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/${item.type === 'youtube_video' ? '320x180' : '300x450'}/1a202c/ffffff?text=Error`; }} />
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm md:text-md font-semibold text-white truncate group-hover:text-sky-300">{item.title}</h3>
        <p className="text-xs text-gray-400 truncate" title={item.genre}>Genre: {item.genre}</p>
        <p className="text-xs text-gray-400 truncate" title={item.cast}>Cast: {item.cast}</p>
        <p className="text-xs text-gray-400">Lang: {item.language}</p>
        <p className="text-xs text-gray-400">Year: {item.year}</p>
        {item.rating && <p className="text-xs text-yellow-400 mt-auto pt-1">Rating: {item.rating}</p>}
      </div>
    </div>
  );
});

export default ContentItem;
