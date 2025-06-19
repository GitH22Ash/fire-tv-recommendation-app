import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, ArrowRightCircle } from 'lucide-react';

const HotsPage = React.memo(({ onItemClick, handleInteraction, setCurrentPage, likedItems, mockMovies }) => {
    const [shuffledMovies, setShuffledMovies] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        if (mockMovies && mockMovies.length > 0) {
            // We can shuffle the entire list, as CSS scroll-snap is very performant.
            // For extremely large lists (>200), you might still want to slice it.
            const limitedShuffledMovies = [...mockMovies]
                .sort(() => Math.random() - 0.5)
                .slice(0, 50); // Kept the slice for good measure, but you can increase it.
            setShuffledMovies(limitedShuffledMovies);
        }
    }, [mockMovies]);

    const handleLikeClick = (e, item) => {
        e.stopPropagation(); 
        const isLiked = likedItems.has(item.id);
        handleInteraction(item, 'liked_hot', { isLiked: !isLiked });
    };

    // This simplified effect just handles the 'Escape' key to go back.
    // The up/down arrow key scrolling is handled natively by the browser's scroll-snap behavior.
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setCurrentPage('Home');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setCurrentPage]);

    if (shuffledMovies.length === 0) {
        return <div className="w-full h-screen bg-black flex items-center justify-center text-white">Loading Hots...</div>;
    }

    return (
        // FIX: This container uses native CSS Scroll Snap to achieve the TikTok/Reels effect.
        // The `snap-y` and `snap-mandatory` classes are key.
        <div 
            ref={containerRef} 
            className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black"
        >
            <button onClick={() => setCurrentPage('Home')} className="fixed top-4 left-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm hover:bg-black/80">&larr; Home</button>
            {shuffledMovies.map((item) => {
                const isLiked = likedItems.has(item.id);
                // FIX: Each child is now a snap-point that takes up the full screen.
                return (
                    <div key={item.id} className="h-screen w-screen snap-center flex items-center justify-center relative">
                        <img 
                            src={item.poster_url} 
                            alt={String(item.title)} 
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = 'https://placehold.co/800x1200/111827/ffffff?text=Trailer+Not+Available'; }}
                        />
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
                            <h2 className="text-2xl font-bold text-white shadow-lg">{String(item.title)}</h2>
                        </div>
                        <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-4">
                            <button onClick={(e) => handleLikeClick(e, item)} className="flex flex-col items-center text-white">
                                <Heart size={32} className={`${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} />
                                <span className="text-xs mt-1">Like</span>
                            </button>
                            <button onClick={() => onItemClick(item, 'comment_hot')} className="flex flex-col items-center text-white">
                                <MessageCircle size={32} />
                                <span className="text-xs mt-1">Comment</span>
                            </button>
                             <button onClick={() => onItemClick(item, 'details')} className="flex flex-col items-center text-white">
                                <ArrowRightCircle size={32} />
                                <span className="text-xs mt-1">Go to Movie</span>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export default HotsPage;
