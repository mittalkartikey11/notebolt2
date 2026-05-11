import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import TopicsPanel from './components/layout/TopicsPanel';
import MainContent from './components/layout/MainContent';
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
  const { activeView, selectedCategory, selectedTopic } = useAppStore();
  const { init } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => { init(); }, [init]);

  // Determine if we're in the 3-panel layout (category/topic view) or a single-page view
  const isKnowledgeView = activeView === 'category' || activeView === 'topic';
  const showTopicsPanel = !!selectedCategory;
  const showMainContent = !!selectedTopic || (selectedCategory && activeView === 'category');

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-950">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {isKnowledgeView ? (
          <>
            {showTopicsPanel && <TopicsPanel />}
            <MainContent />
          </>
        ) : (
          <PageContent view={activeView} />
        )}
      </div>
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
