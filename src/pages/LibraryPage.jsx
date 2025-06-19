import React from 'react';
import ContentRow from '../components/ContentRow';

// FIX: mockMovies is now passed in as a prop instead of being imported.
const LibraryPage = React.memo(({ onItemClick, mockMovies }) => {
    // A guard clause to prevent errors if the movie data hasn't loaded yet.
    if (!mockMovies || mockMovies.length === 0) {
        return <div className="p-4 md:p-8 text-white">Loading Library...</div>;
    }

    return (
        <div className="p-4 md:p-8 text-white">
            <h1 className="text-3xl font-bold mb-6">My Library</h1>
            {/* The component now uses the mockMovies prop for its data. */}
            <ContentRow title="My Watchlist (Mock)" items={mockMovies.slice(0, 5)} onItemClick={onItemClick} />
            <ContentRow title="Purchases & Rentals (Mock)" items={mockMovies.slice(5, 10)} onItemClick={onItemClick} />
            <p className="text-gray-500 mt-8">This page is a placeholder for your watchlist, purchases, and rentals. In a real app, this data would be fetched from Firestore based on the user's account.</p>
        </div>
    );
});

export default LibraryPage;
