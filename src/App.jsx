import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import TopicsPanel from './components/layout/TopicsPanel';
import MainContent from './components/layout/MainContent';
import MobileBottomNav from './components/mobile/MobileBottomNav';
import MobileTopBar from './components/mobile/MobileTopBar';
import MobileCategoryView from './components/mobile/MobileCategoryView';
import Home from './pages/Home';
import AllNotes from './pages/AllNotes';
import Starred from './pages/Starred';
import Recent from './pages/Recent';
import Tags from './pages/Tags';
import Trash from './pages/Trash';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import useAppStore from './store/useAppStore';
import useThemeStore from './store/useThemeStore';

function PageContent({ view }) {
  switch (view) {
    case 'home':     return <Home />;
    case 'allnotes': return <AllNotes />;
    case 'starred':  return <Starred />;
    case 'recent':   return <Recent />;
    case 'tags':     return <Tags />;
    case 'trash':    return <Trash />;
    case 'progress': return <Progress />;
    case 'settings': return <Settings />;
    default:         return null;
  }
}

export default function App() {
  const { activeView, selectedCategory, selectedTopic, selectCategory } = useAppStore();
  const { init } = useThemeStore();
  const [, setSearchOpen] = useState(false);

  // Initialize theme on mount
  useEffect(() => { init(); }, [init]);

  // Determine if we're in the 3-panel layout (category/topic view) or a single-page view
  const isKnowledgeView = activeView === 'category' || activeView === 'topic';
  const showTopicsPanel = !!selectedCategory;

  // Handle back navigation from mobile category view
  const handleBackFromCategory = () => {
    selectCategory(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0a0a0a]">
      {/* Desktop Top Bar - hidden on mobile */}
      <div className="hidden md:block">
        <TopBar />
      </div>

      {/* Mobile Top Bar - visible only on mobile */}
      <MobileTopBar onSearchClick={() => setSearchOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:block desktop-sidebar">
          <Sidebar />
        </div>

        {isKnowledgeView ? (
          <>
            {/* Mobile Category View - full screen on mobile */}
            <div className="md:hidden">
              {selectedCategory && (
                <MobileCategoryView 
                  category={selectedCategory} 
                  onBack={handleBackFromCategory}
                />
              )}
            </div>
            
            {/* Desktop Topics Panel + Main Content */}
            <div className="hidden md:flex flex-1 overflow-hidden">
              {showTopicsPanel && <TopicsPanel />}
              <MainContent />
            </div>
          </>
        ) : (
          <>
            {/* Desktop Content */}
            <div className="hidden md:flex flex-1 overflow-hidden">
              <PageContent view={activeView} />
            </div>
            
            {/* Mobile Content - Full Screen */}
            <div className="md:hidden flex-1 overflow-y-auto mobile-content-with-topbar main-content">
              <PageContent view={activeView} />
            </div>
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation - visible only on mobile */}
      <MobileBottomNav />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #374151',
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />
    </div>
  );
}
