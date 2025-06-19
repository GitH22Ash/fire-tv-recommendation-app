import React, { useState, useMemo } from 'react';
import ContentRow from '../components/ContentRow';
// FIX: Removed direct import of mockMovies
import { getUniqueItems } from '../utils/helpers';
import { ListFilter, XCircle } from 'lucide-react';

// FIX: Added mockMovies to the component's props
const FindPage = React.memo(({ onItemClick, mockMovies }) => { 
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All Genres');
    const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
    const [selectedContentType, setSelectedContentType] = useState('All Types');

    const contentTypesList = ['All Types', 'Movies', 'TV Shows']; 

    // FIX: Generate genre and language lists from the passed-in movie data
    const genresForFilter = useMemo(() => ['All Genres', ...getUniqueItems(mockMovies, 'genre')], [mockMovies]);
    const languagesForFilter = useMemo(() => ['All Languages', ...getUniqueItems(mockMovies, 'language')], [mockMovies]);

    const filteredContent = useMemo(() => {
        if (!mockMovies) return [];
        return mockMovies
            .filter(Boolean) 
            .filter(item => {
                const titleMatch = !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase()) || (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
                const genreMatch = selectedGenre.toLowerCase() === 'all genres' || (item.genre && String(item.genre).toLowerCase().includes(selectedGenre.toLowerCase()));
                const languageMatch = selectedLanguage.toLowerCase() === 'all languages' || (item.language && String(item.language).toLowerCase() === selectedLanguage.toLowerCase());
                
                let typeMatches = false;
                switch(selectedContentType) {
                    case 'All Types': typeMatches = true; break;
                    case 'Movies': typeMatches = item.type === 'movie'; break;
                    case 'TV Shows': typeMatches = item.type === 'series'; break;
                    default: typeMatches = true;
                }
                return titleMatch && genreMatch && languageMatch && typeMatches;
            });
    }, [searchTerm, selectedGenre, selectedLanguage, selectedContentType, mockMovies]);

    return (
    <div className="p-4 md:p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 flex items-center"><ListFilter size={28} className="mr-3"/> Find All Content</h1>
        <div className="mb-6"><input type="search" placeholder="Search all content..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"/></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div><label htmlFor="contentTypeFilter" className="block text-sm font-medium text-gray-300 mb-1">Content Type</label><select id="contentTypeFilter" value={selectedContentType} onChange={(e) => setSelectedContentType(e.target.value)} className="w-full p-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none appearance-none">{contentTypesList.map(type => <option key={type} value={type}>{type}</option>)}</select></div>
            <div><label htmlFor="genreFilter" className="block text-sm font-medium text-gray-300 mb-1">Genre</label><select id="genreFilter" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="w-full p-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none appearance-none">{genresForFilter.map(genre => <option key={genre} value={genre.toLowerCase()}>{genre}</option>)}</select></div>
            <div><label htmlFor="languageFilter" className="block text-sm font-medium text-gray-300 mb-1">Language</label><select id="languageFilter" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full p-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none appearance-none">{languagesForFilter.map(lang => <option key={lang} value={lang.toLowerCase()}>{lang}</option>)}</select></div>
        </div>
        {filteredContent.length > 0 ? <ContentRow title={`Results (${filteredContent.length})`} items={filteredContent} onItemClick={onItemClick} /> : <div className="text-center py-10"><XCircle size={48} className="mx-auto text-gray-500 mb-4" /><p className="text-xl text-gray-400">No content found.</p></div>}
    </div>);
});

export default FindPage;
