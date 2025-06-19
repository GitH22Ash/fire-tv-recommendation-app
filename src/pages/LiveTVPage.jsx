import React from 'react';
import { mockLiveChannels } from '../data/mockData';

const LiveTVPage = React.memo(({ onItemClick }) => ( 
    <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Live TV Channels</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockLiveChannels.map(channel => (
                <div key={channel.id} className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => onItemClick({ ...channel, title: channel.name }, 'tune-in')}>
                    <img src={channel.logo} alt={`${channel.name} logo`} className="h-16 w-auto mb-3 rounded"/>
                    <h3 className="text-xl font-semibold text-white mb-1">{channel.name}</h3>
                    <p className="text-sm text-gray-400">Now: {channel.currentShow}</p>
                    <p className="text-xs text-gray-500 mt-1">Genre: {channel.genre}</p>
                </div>
            ))}
        </div>
    </div>
));

export default LiveTVPage;
