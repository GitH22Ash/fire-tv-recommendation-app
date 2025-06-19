import React, { useState, useMemo } from 'react';
import PlatformFilters from '../components/PlatformFilters';
import ContentRow from '../components/ContentRow';
// FIX: mockMovies is no longer imported directly. It's passed as a prop.
import { Youtube, PlayCircle } from 'lucide-react';
import { getUniqueItems } from '../utils/helpers';

const YouTubePage = React.memo(({ onItemClick, setCurrentPage, mockMovies }) => { 
    const platformName = 'YouTube';
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all categories');

    // FIX: Pass the loaded mockMovies data to these functions
    const GLOBAL_GENRES = useMemo(() => ['All Genres', ...getUniqueItems(mockMovies, 'genre')], [mockMovies]);
    const GLOBAL_LANGUAGES = useMemo(() => ['All Languages', ...getUniqueItems(mockMovies, 'language')], [mockMovies]);

    // Assuming some movies are tagged as youtube videos
    const platformBaseMovies = useMemo(() => mockMovies.filter(m => m.type === 'youtube_video'), [mockMovies]); 

    const filteredPlatformVideos = useMemo(() => {
        return platformBaseMovies.filter(item => {
            const titleMatch = !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase()) || (item.uploader && item.uploader.toLowerCase().includes(searchTerm.toLowerCase()));
            const categoryMatch = selectedCategory.toLowerCase() === 'all categories' || (item.genre && String(item.genre).toLowerCase().includes(selectedCategory.toLowerCase())); 
            return titleMatch && categoryMatch;
        });
    }, [platformBaseMovies, searchTerm, selectedCategory]);
    
    const youtubeFeatured = useMemo(() => filteredPlatformVideos[0] || null, [filteredPlatformVideos]);

    return (
        <div className="bg-gray-900 min-h-screen text-white pt-16">
            <div className="bg-gray-800 p-3 fixed top-16 left-0 right-0 z-40 flex items-center justify-between">
                <div className="flex items-center"> <Youtube size={32} className="text-red-600 mr-2"/> <span className="text-xl font-bold">YouTube</span> </div>
                <button onClick={() => setCurrentPage('Home')} className="ml-auto bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded-md text-sm">Back to Home</button>
            </div>
             <div className="pt-16">
                <PlatformFilters 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm}
                    selectedGenre={selectedCategory} 
                    setSelectedGenre={setSelectedCategory} 
                    selectedLanguage={"all languages"} 
                    setSelectedLanguage={() => {}} // Simplified for YouTube page
                    platformName={platformName} 
                    genres={GLOBAL_GENRES} // Pass genres for the dropdown
                    languages={GLOBAL_LANGUAGES} // Pass languages for the dropdown
                />
                {youtubeFeatured && (
                     <div className="p-4 md:p-8">
                        <h2 className="text-2xl font-bold mb-4">{youtubeFeatured.title}</h2>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow-lg">
                             <img src={youtubeFeatured.poster_url?.replace('320x180', '1280x720')} alt={youtubeFeatured.title} className="w-full h-full object-cover"/>
                        </div>
                        <button onClick={() => onItemClick(youtubeFeatured, 'play_video')} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-semibold flex items-center"><PlayCircle size={20} className="mr-2"/> Watch Now</button>
                     </div>
                )}
                <div className="px-4 md:px-8">
                    {filteredPlatformVideos.length > 0 ? 
                        <ContentRow title="Videos" items={filteredPlatformVideos} onItemClick={onItemClick} itemType="youtube" />
                        : <p className="text-center text-gray-400 py-10 text-xl">No videos match your filters on YouTube.</p>
                    }
                </div>
            </div>
        </div>
    );
});

export default YouTubePage;
