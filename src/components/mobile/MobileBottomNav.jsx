import React from 'react';
import { motion } from 'framer-motion';
import { Home, Star, Search, Tag, MoreHorizontal } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import useThemeStore from '../../store/useThemeStore';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'allnotes', label: 'Notes', icon: Star },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'tags', label: 'Tags', icon: Tag },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

export default function MobileBottomNav() {
  const { activeView, setActiveView, selectCategory, selectedTopic } = useAppStore();
  const { getAccentHex } = useThemeStore();
  const accentHex = getAccentHex();

  const handleNavClick = (itemId) => {
    if (itemId === 'search') {
      // Open search modal - we'll need to expose this from TopBar or create a global search state
      useAppStore.getState().setActiveView('allnotes');
    } else if (['home', 'allnotes', 'starred', 'recent', 'tags', 'trash', 'progress', 'settings'].includes(itemId)) {
      setActiveView(itemId);
      // Clear category/topic selection when navigating to main views
      if (selectedTopic || useAppStore.getState().selectedCategory) {
        useAppStore.getState().selectCategory(null);
      }
    }
  };

  return (
    <nav className="mobile-bottom-nav mobile-safe-area-bottom">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id || 
          (item.id === 'allnotes' && activeView === 'starred') ||
          (item.id === 'allnotes' && activeView === 'recent');
        
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className="flex flex-col items-center justify-center w-[20%] h-full py-2 touch-target"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <div className="relative flex items-center justify-center mb-1">
              <Icon 
                size={24} 
                style={{ 
                  color: isActive ? accentHex : '#6b7280',
                  transition: 'color 0.2s ease'
                }} 
              />
              {isActive && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 w-1 h-1 rounded-full"
                  style={{ background: accentHex }}
                />
              )}
            </div>
            <span 
              className="text-[11px] font-medium"
              style={{ 
                color: isActive ? accentHex : '#6b7280',
                transition: 'color 0.2s ease'
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
