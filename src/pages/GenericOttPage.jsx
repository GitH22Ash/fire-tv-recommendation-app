import React, { useState, useMemo } from 'react';
import { ottPlatforms, featuredContentDefault } from '../data/mockData';
import PlatformFilters from '../components/PlatformFilters';
import FeaturedSection from '../components/FeaturedSection';
import ContentRow from '../components/ContentRow';
import { getUniqueItems } from '../utils/helpers';

// FIX: Added mockMovies to the component's props
const GenericOttPage = React.memo(({ onItemClick, platformName, setCurrentPage, mockMovies }) => { 
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all genres'); 
    const [selectedLanguage, setSelectedLanguage] = useState('all languages'); 
    const [activeCategory, setActiveCategory] = useState('all'); 

    // FIX: Generate genre and language lists from the passed-in movie data
    const genresForFilter = useMemo(() => ['All Genres', ...getUniqueItems(mockMovies, 'genre')], [mockMovies]);
    const languagesForFilter = useMemo(() => ['All Languages', ...getUniqueItems(mockMovies, 'language')], [mockMovies]);

    const platformDetails = useMemo(() => ottPlatforms.find(p => p.name === platformName) || 
        { name: platformName, themeColor: 'bg-gray-900', logoUrl: `https://placehold.co/150x50/222222/FFFFFF?text=${platformName.toUpperCase()}&font=Inter`}, [platformName]);
    
    const platformBaseMovies = useMemo(() => {
        if (!mockMovies) return [];
        return mockMovies.filter(m => m.ott?.includes(platformName));
    }, [mockMovies, platformName]);

    const filteredPlatformMovies = useMemo(() => {
        return platformBaseMovies.filter(item => {
            const titleMatch = !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
            const genreMatch = selectedGenre.toLowerCase() === 'all genres' || (item.genre && String(item.genre).toLowerCase().includes(selectedGenre.toLowerCase()));
            const languageMatch = selectedLanguage.toLowerCase() === 'all languages' || (item.language && String(item.language).toLowerCase() === selectedLanguage.toLowerCase());
            const categoryMatch = activeCategory === 'all' || 
                                  (activeCategory === 'movies' && item.type === 'movie') ||
                                  (activeCategory === 'series' && item.type === 'series');
            return titleMatch && genreMatch && languageMatch && categoryMatch;
        });
    }, [platformBaseMovies, searchTerm, selectedGenre, selectedLanguage, activeCategory]);
    
    const platformFeatured = useMemo(() => filteredPlatformMovies[0] || featuredContentDefault, [filteredPlatformMovies]);
    
    const platformOriginals = useMemo(() => filteredPlatformMovies.filter(m => (m.title?.toLowerCase().includes("original") || Math.random() < 0.2 )).slice(0,10), [filteredPlatformMovies]);
    const popularOnPlatform = useMemo(() => filteredPlatformMovies.filter(item => !platformOriginals.find(o => o.id === item.id)).slice(0,10), [filteredPlatformMovies, platformOriginals]);
    const moreFromPlatform = useMemo(() => filteredPlatformMovies.filter(item => !platformOriginals.find(o => o.id === item.id) && !popularOnPlatform.find(p => p.id === item.id)).slice(0,20), [filteredPlatformMovies, platformOriginals, popularOnPlatform]);

    return (
        <div className="min-h-screen text-white pt-16">
            <div className={`${platformDetails.themeColor} p-4 fixed top-16 left-0 right-0 z-40 flex items-center shadow-md`}> 
                <img src={platformDetails.logoUrl} alt={`${platformName} Logo`} className="h-8 mr-6"/>
                
                {[{label:'All', key:'all'}, {label:'Movies', key:'movies'}, {label:'TV Shows', key:'series'}].map(item => (
                    <button 
                        key={item.key} 
                        onClick={() => setActiveCategory(item.key)}
                        className={`text-gray-200 hover:text-white mr-4 text-sm px-3 py-1 rounded-md transition-colors ${activeCategory === item.key ? 'bg-white/20 font-bold' : ''}`}
                    >
                        {item.label}
                    </button>
                ))}

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
                <FeaturedSection item={platformFeatured} onItemClick={onItemClick} />
                <div className="px-4 md:px-8">
                    {activeCategory === 'all' && (
                        <>
                           {platformOriginals.length > 0 && <ContentRow title={`${platformName} Originals`} items={platformOriginals} onItemClick={onItemClick} />}
                           {popularOnPlatform.length > 0 && <ContentRow title={`Popular on ${platformName}`} items={popularOnPlatform} onItemClick={onItemClick} />}
                           {moreFromPlatform.length > 0 && <ContentRow title={`More from ${platformName}`} items={moreFromPlatform} onItemClick={onItemClick} />}
                        </>
                    )}
                    
                    {(activeCategory === 'movies' || activeCategory === 'series') && filteredPlatformMovies.length > 0 &&
                        <ContentRow title={`All ${activeCategory === 'movies' ? 'Movies' : 'TV Shows'} on ${platformName}`} items={filteredPlatformMovies} onItemClick={onItemClick} />
                    }

                    {filteredPlatformMovies.length === 0 &&
                        <p className="text-center text-gray-400 py-10 text-xl">No content matches your current filters on {platformName}.</p>
                    }
                </div>
            </div>
        </div>
    );
});

export default GenericOttPage;
