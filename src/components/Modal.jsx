import React from 'react';
import { PlayCircle } from 'lucide-react';

const Modal = React.memo(({ isOpen, onClose, title, children, selectedItem }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>
        <div className="text-gray-300">
            <p className="whitespace-pre-wrap">{children}</p>
            {/* FIX: This block will now only render if a selectedItem actually exists. */}
            {selectedItem && (
                <div className="mt-4 border-t border-gray-700 pt-4">
                    <p className="text-sm text-gray-400"><b>Language:</b> {selectedItem.language || "N/A"}</p>
                    <p className="text-sm text-gray-400"><b>Release:</b> {selectedItem.release_date || "N/A"}</p>
                    <p className="text-sm text-gray-400"><b>Rating:</b> {selectedItem.rating || "N/A"}</p>
                    <p className="text-sm text-gray-400"><b>Duration:</b> {selectedItem.duration || "N/A"}</p>
                    <button onClick={() => alert(`This would start playing ${selectedItem.title}`)} className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                        <PlayCircle size={20} className="mr-2" /> Play Movie
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
});

export default Modal;
