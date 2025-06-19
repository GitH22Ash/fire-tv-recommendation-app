import React from 'react';
import ContentItem from './ContentItem';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ContentRow = React.memo(({ title, items, onItemClick, isLoading = false, itemType = 'standard' }) => {
  const scrollRef = React.useRef(null);

  if (isLoading) { return <div className="mb-8 px-4 md:px-8 text-white">Loading {title}...</div>; }
  if (!items || items.length === 0) { return null; } 

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3 px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        {items.length > 3 && <div className="hidden md:flex space-x-2">
          <button onClick={() => scroll('left')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors" aria-label={`Scroll left in ${title}`}><ChevronLeft size={20} /></button>
          <button onClick={() => scroll('right')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors" aria-label={`Scroll right in ${title}`}><ChevronRight size={20} /></button>
        </div>}
      </div>
      <div ref={scrollRef} className="flex overflow-x-auto pb-4 scrollbar-hide px-2 md:px-6">
        {items.map((item, index) => 
            <ContentItem 
                key={`${item.id}-${title}-${index}`} 
                item={item} 
                onClick={onItemClick} 
                itemType={item.type === 'youtube_video' ? 'youtube' : itemType}
            />
        )}
      </div>
    </div>
  );
});

export default ContentRow;
