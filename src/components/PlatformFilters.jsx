import React from 'react';

// FIX: Removed the incorrect import of GLOBAL_GENRES and GLOBAL_LANGUAGES.
// The component now relies entirely on the 'genres' and 'languages' props.

const PlatformFilters = React.memo(({ 
    searchTerm, 
    setSearchTerm, 
    selectedGenre, 
    setSelectedGenre, 
    selectedLanguage, 
    setSelectedLanguage = () => {},
    platformName,
    genres = [], // Default to an empty array to prevent errors if not provided
    languages = [] // Default to an empty array
}) => {
    return (
        <div className="px-4 md:px-8 py-4 mb-4 md:mb-6 bg-gray-800/70 rounded-lg shadow-md sticky top-16 z-30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                    <label htmlFor={`${platformName}-search`} className="block text-sm font-medium text-gray-300 mb-1">Search {platformName}</label>
                    <input type="search" id={`${platformName}-search`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Search in ${platformName}...`}
                        className="w-full p-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div>
                    <label htmlFor={`${platformName}-genreFilter`} className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
                    <select id={`${platformName}-genreFilter`} value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}
                        className="w-full p-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-sky-500 outline-none appearance-none">
                        {/* The component now maps over the 'genres' prop */}
                        {genres.map(genre => <option key={genre} value={genre.toLowerCase()}>{genre}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor={`${platformName}-languageFilter`} className="block text-sm font-medium text-gray-300 mb-1">Language</label>
                    <select id={`${platformName}-languageFilter`} value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full p-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-sky-500 outline-none appearance-none">
                        {/* The component now maps over the 'languages' prop */}
                        {languages.map(lang => <option key={lang} value={lang.toLowerCase()}>{lang}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
});

export default PlatformFilters;
