import React from 'react';
import { Search, Bell, MoreHorizontal, Crown } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import useThemeStore from '../../store/useThemeStore';

export default function MobileTopBar({ onSearchClick }) {
  const { isAdminMode, selectedCategory, selectedTopic, activeView } = useAppStore();
  const { getAccentHex } = useThemeStore();
  const accentHex = getAccentHex();

  // Get breadcrumb or title
  const getTitle = () => {
    if (selectedTopic) {
      return selectedTopic.name;
    } else if (selectedCategory) {
      return selectedCategory.name;
    } else {
      return activeView.charAt(0).toUpperCase() + activeView.slice(1);
    }
  };

  return (
    <header className="mobile-top-bar mobile-safe-area-bottom">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${accentHex}, ${accentHex}dd)` }}
        >
          <span className="text-white font-bold text-xs">F</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-white leading-tight">
            Interview Notes OS
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Admin Mode Badge - Icon only */}
        {isAdminMode && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: `${accentHex}22` }}>
            <Crown size={18} style={{ color: accentHex }} />
          </div>
        )}

        {/* Search Icon */}
        <button 
          onClick={onSearchClick}
          className="p-2.5 rounded-xl touch-target flex items-center justify-center"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <Search size={22} className="text-white" />
        </button>

        {/* More Menu */}
        <button 
          className="p-2.5 rounded-xl touch-target flex items-center justify-center"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <MoreHorizontal size={22} className="text-white" />
        </button>
      </div>
    </header>
  );
}
