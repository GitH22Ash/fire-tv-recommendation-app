// FIX: getMostFrequentGenre now receives the movie list as an argument.
export const getMostFrequentGenre = (history, mockMovies) => { 
    if (!history || history.length === 0 || !mockMovies || mockMovies.length === 0) return "Action"; 
    
    const genreCounts = history.reduce((acc, item) => {
        const content = mockMovies.find(m => m.id === item.contentId); 
        if (content && content.genre) {
            const genres = String(content.genre).split(',').map(g => g.trim());
            genres.forEach(g => { if(g) acc[g] = (acc[g] || 0) + 1; });
        }
        return acc;
    }, {});

    if (Object.keys(genreCounts).length === 0) return "Action"; 
    return Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);
};

export const getUniqueItems = (items, key) => {
    if (!items || items.length === 0) return [];
    const uniqueSet = new Set();
    items.forEach(item => {
        if (item && item[key]) {
            if (key === 'genre' && typeof item[key] === 'string') { 
                item[key].split(',').map(g => g.trim()).filter(Boolean).forEach(g => uniqueSet.add(g));
            } else {
                uniqueSet.add(item[key]);
            }
        }
    });
    return Array.from(uniqueSet).sort();
};
