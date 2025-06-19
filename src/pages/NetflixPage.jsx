import React, { useState, useMemo } from 'react';
import PlatformFilters from '../components/PlatformFilters';
import FeaturedSection from '../components/FeaturedSection';
import ContentRow from '../components/ContentRow';
import { featuredContentDefault } from '../data/mockData';
import { getUniqueItems } from '../utils/helpers';

const NetflixPage = React.memo(({ onItemClick, setCurrentPage, mockMovies }) => { 
    const platformName = 'Netflix';
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all genres');
    const [selectedLanguage, setSelectedLanguage] = useState('all languages');

    const genresForFilter = useMemo(() => ['All Genres', ...getUniqueItems(mockMovies, 'genre')], [mockMovies]);
    const languagesForFilter = useMemo(() => ['All Languages', ...getUniqueItems(mockMovies, 'language')], [mockMovies]);

    const platformBaseMovies = useMemo(() => {
        if (!mockMovies) return [];
        return mockMovies.filter(m => m.ott?.includes(platformName));
    }, [mockMovies]);

    const filteredPlatformMovies = useMemo(() => {
        return platformBaseMovies.filter(item => {
            // FIX: Convert item.title to a string to prevent crashes if the title is a number.
            const titleMatch = !searchTerm || String(item.title).toLowerCase().includes(searchTerm.toLowerCase());
            const genreMatch = selectedGenre.toLowerCase() === 'all genres' || (item.genre && String(item.genre).toLowerCase().includes(selectedGenre.toLowerCase()));
            const languageMatch = selectedLanguage.toLowerCase() === 'all languages' || (item.language && String(item.language).toLowerCase() === selectedLanguage.toLowerCase());
            return titleMatch && genreMatch && languageMatch;
        });
    }, [platformBaseMovies, searchTerm, selectedGenre, selectedLanguage]);

    const netflixFeatured = useMemo(() => filteredPlatformMovies.find(m => m.type === 'series') || filteredPlatformMovies[0] || featuredContentDefault, [filteredPlatformMovies]);
    
    const netflixOriginals = useMemo(() => {
        return filteredPlatformMovies.filter(m => {
            // FIX: Also apply the String() conversion here for safety.
            return (String(m.title).toLowerCase().includes('original') || Math.random() < 0.3);
        }).slice(0, 10);
    }, [filteredPlatformMovies]);
    
    return (
        <div className="bg-black min-h-screen text-white pt-16"> 
            <div className="bg-black p-4 fixed top-16 left-0 right-0 z-40 flex items-center"> 
                <img src="https://placehold.co/100x30/E50914/FFFFFF?text=NETFLIX&font=Inter" alt="Netflix Logo" className="h-8 mr-6"/>
                <button onClick={() => setCurrentPage('Home')} className="ml-auto bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded-md text-sm">Back to Home</button>
            </div>
            <div className="pt-16">
                <PlatformFilters 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm}
                    selectedGenre={selectedGenre} 
                    setSelectedGenre={setSelectedGenre}
                    selectedLanguage={selectedLanguage} 
                    setSelectedLanguage={setSelectedLanguage}
                    platformName={platformName}
                    genres={genresForFilter}
                    languages={languagesForFilter}
                />
                <FeaturedSection item={netflixFeatured} onItemClick={onItemClick} />
                <div className="px-4 md:px-8">
                    {netflixOriginals.length > 0 && <ContentRow title="Netflix Originals" items={netflixOriginals} onItemClick={onItemClick} />}
                    {filteredPlatformMovies.length > 0 ?
                        <ContentRow title="All on Netflix" items={filteredPlatformMovies} onItemClick={onItemClick} />
                        : <p className="text-center text-gray-400 py-10 text-xl">No content matches your filters on Netflix.</p>
                    }
                </div>
            </div>
        </div>
    );
});

export default NetflixPage;
