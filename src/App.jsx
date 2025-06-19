import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db, auth, appId } from './services/firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
// FIX: Removed 'onSnapshot' from this import line as it was not being used.
import { collection, addDoc, serverTimestamp} from 'firebase/firestore';

// Components
import Navigation from './components/Navigation';
import Modal from './components/Modal';

// Pages
import HomePage from './pages/HomePage';
import LiveTVPage from './pages/LiveTVPage';
import FindPage from './pages/FindPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import NetflixPage from './pages/NetflixPage';
import YouTubePage from './pages/YouTubePage';
import GenericOttPage from './pages/GenericOttPage';
import HotsPage from './pages/HotsPage';

// --- UPDATED DATA IMPORT ---
import { getMovies, featuredContentDefault } from './data/mockData';

function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Notification');
  const [modalMessage, setModalMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [viewHistory, setViewHistory] = useState([]);

  // --- NEW STATE FOR MOVIE DATA ---
  const [mockMovies, setMockMovies] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // --- NEW EFFECT TO LOAD DATA ON STARTUP ---
  useEffect(() => {
    getMovies()
      .then(data => {
        setMockMovies(data);
        setIsDataLoading(false);
      })
      .catch(error => {
        console.error("Failed to load movie data:", error);
        setIsDataLoading(false);
        // Optionally, show an error message to the user
      });
  }, []);

  useEffect(() => {
    // This effect now needs to be adapted to handle the fact that we don't have a real-time listener.
    // For this mock app, we can just log the user ID. In a real app, you would fetch initial data here.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        setUserEmail(user.email);
        if (currentPage === 'Login' && !user.isAnonymous) {
            setCurrentPage('Home');
        }
      } else {
        setCurrentUserId(null);
        setUserEmail(null);
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Anonymous sign-in failed:", error);
        }
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, [currentPage]);
  
  const likedItems = useMemo(() => new Set(viewHistory.filter(item => item.isLiked).map(item => item.contentId)), [viewHistory]);

  const showNotificationModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleInteraction = useCallback(async (item, action = 'viewed', extraData = {}) => {
    if (!currentUserId || !item?.id) return;
    if (action === 'viewed_hot') return;
    try {
        const interactionData = { userId: currentUserId, contentId: String(item.id), contentType: item.type || 'unknown', title: item.title, action: action, timestamp: serverTimestamp(), ...extraData };
        const historyCollectionPath = `artifacts/${appId}/users/${currentUserId}/viewHistory`;
        await addDoc(collection(db, historyCollectionPath), interactionData);
        // For local simulation, we can also update the local history state
        setViewHistory(prev => [interactionData, ...prev]);
    } catch (error) {
        console.error("Failed to save interaction:", error);
    }
  }, [currentUserId]);

  const handleItemClick = useCallback((item, action = 'details') => {
    if (!item || !item.title) {
        showNotificationModal("Error", "Cannot display details for this item.");
        return;
    }
     if (action === 'comment_hot') { 
        showNotificationModal("Coming Soon!", "Comments are not yet implemented.");
        return; 
    }
    setSelectedItem(item);
    setModalMessage(`Description: ${item.description}\nCast: ${item.cast}`);
    setModalTitle(item.title);
    setIsModalOpen(true);
    handleInteraction(item, action);
  }, [handleInteraction]);

  const handleAppIconClick = useCallback((page, appName) => {
    if (page) {
      setCurrentPage(page);
    } else {
      showNotificationModal(appName, `This app page for ${appName} is not yet implemented.`);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const featuredContent = useMemo(() => {
    if (mockMovies.length === 0) return featuredContentDefault; // Return default if data is not loaded yet
    if (viewHistory.length > 0 && viewHistory[0].contentId) {
        const lastWatched = mockMovies.find(m => m.id === viewHistory[0].contentId);
        if (lastWatched) return lastWatched;
    }
    return mockMovies.find(m => m.id === '693134') || mockMovies[0] || featuredContentDefault;
  }, [viewHistory, mockMovies]);

  const renderPage = () => {
    const pageProps = { mockMovies, onItemClick: handleItemClick, setCurrentPage };

    switch (currentPage) {
        case 'Home': return <HomePage viewHistory={viewHistory} onItemClick={handleItemClick} featuredContent={featuredContent} onPlatformClick={handleAppIconClick} mockMovies={mockMovies} />;
        case 'LiveTV': return <LiveTVPage {...pageProps} />;
        case 'Find': return <FindPage {...pageProps} />;
        case 'Library': return <LibraryPage {...pageProps} />;
        case 'Login': return <LoginPage setCurrentPage={setCurrentPage} showNotificationModal={showNotificationModal} />;
        case 'SettingsPage': return <SettingsPage viewHistory={viewHistory} currentUserId={currentUserId} userEmail={userEmail} />;
        case 'NetflixPage': return <NetflixPage {...pageProps} />;
        case 'YouTubePage': return <YouTubePage {...pageProps} />;
        case 'HuluPage': return <GenericOttPage {...pageProps} platformName="Hulu" />;
        case 'PrimePage': return <GenericOttPage {...pageProps} platformName="Prime Video" />;
        case 'DisneyPlusPage': return <GenericOttPage {...pageProps} platformName="Disney+" />;
        case 'HotstarPage': return <GenericOttPage {...pageProps} platformName="Hotstar" />;
        case 'HotsPage': return <HotsPage onItemClick={handleItemClick} handleInteraction={handleInteraction} setCurrentPage={setCurrentPage} likedItems={likedItems} mockMovies={mockMovies}/>;
        default: return <HomePage viewHistory={viewHistory} onItemClick={handleItemClick} featuredContent={featuredContent} onPlatformClick={handleAppIconClick} mockMovies={mockMovies} />;
    }
  };

  if (!isAuthReady || isDataLoading) {
    return <div className="bg-black min-h-screen flex items-center justify-center text-white text-xl">Loading Data...</div>;
  }

  return (
    <div className="bg-black min-h-screen text-gray-100 font-sans">
      <Navigation 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          onAppIconClick={handleAppIconClick}
          onSettingsClick={() => setCurrentPage('SettingsPage')}
          onProfileClick={() => setCurrentPage('Login')}
          showNotificationModal={showNotificationModal}
        />
      <main className="pb-12">
        {renderPage()}
      </main>
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={modalTitle}
        selectedItem={selectedItem}
      >
        {modalMessage}
      </Modal>
      <footer className="text-center p-6 text-gray-500 text-sm border-t border-gray-800">
          Fire TV Clone - OTT Simulation
      </footer>
    </div>
  );
}

export default App;
