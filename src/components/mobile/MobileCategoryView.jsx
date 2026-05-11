import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Search, MoreVertical, Check } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import useThemeStore from '../../store/useThemeStore';

export default function MobileCategoryView({ category, onBack }) {
  const { topics, selectedTopic, selectTopic, isAdminMode } = useAppStore();
  const { getAccentHex } = useThemeStore();
  const accentHex = getAccentHex();
  const [showTopicFilter, setShowTopicFilter] = useState(false);

  const categoryTopics = topics[category.id] || [];

  return (
    <div className="mobile-content-with-topbar min-h-screen bg-[#0a0a0a] pb-20">
      {/* Mobile Header Bar */}
      <div className="fixed top-[56px] left-0 right-0 h-[56px] bg-[#0a0a0a] border-b border-[#1f1f1f] z-[999] flex items-center justify-between px-4">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="p-2.5 rounded-xl touch-target flex items-center justify-center"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ChevronLeft size={24} className="text-white" />
        </button>

        {/* Category Info */}
        <div className="flex flex-col items-center">
          <span className="text-[16px] font-semibold text-white">{category.name}</span>
          <span className="text-[12px] text-[#9ca3af]">{categoryTopics.length} Topics</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl touch-target">
            <Search size={22} className="text-white" />
          </button>
          <button className="p-2.5 rounded-xl touch-target">
            <MoreVertical size={22} className="text-white" />
          </button>
        </div>
      </div>

      {/* Topic Chips Row (Horizontal Scroll) */}
      <div className="fixed top-[112px] left-0 right-0 h-[56px] bg-[#0a0a0a] border-b border-[#1f1f1f] z-[998] flex items-center overflow-x-auto hide-scrollbar px-4">
        {categoryTopics.map((topic, idx) => (
          <button
            key={topic.id}
            onClick={() => selectTopic(topic)}
            className={`h-8 px-3 rounded-full whitespace-nowrap mr-2 text-sm font-medium flex items-center gap-1.5 transition-colors ${
              selectedTopic?.id === topic.id
                ? 'text-white'
                : 'bg-[#1a1a1a] border border-[#1f1f1f] text-[#9ca3af]'
            }`}
            style={selectedTopic?.id === topic.id ? { background: accentHex } : {}}
          >
            <span>{topic.icon}</span>
            <span>{topic.name}</span>
            {topic.note_count > 0 && (
              <span 
                className="text-[11px] px-1.5 py-0.5 rounded-md"
                style={selectedTopic?.id === topic.id ? { background: 'rgba(255,255,255,0.2)' } : { background: '#2a2a2a' }}
              >
                {topic.note_count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Topics List */}
      <div className="pt-[168px] px-4">
        {categoryTopics.map((topic) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-4 mb-3 touch-card"
            onClick={() => selectTopic(topic)}
          >
            {/* Top Row: Icon + Title + Menu */}
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-lg"
                style={{ background: `${accentHex}22` }}
              >
                {topic.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-white truncate">{topic.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[13px] text-[#9ca3af]">{topic.note_count} notes</span>
                  <span className="text-[#6b7280]">•</span>
                  <span className="text-[13px] text-[#6b7280]">Updated 2h ago</span>
                </div>
              </div>
              {isAdminMode && (
                <button className="p-2 rounded-lg touch-target">
                  <MoreVertical size={18} className="text-[#6b7280]" />
                </button>
              )}
            </div>

            {/* Progress Bar (if applicable) */}
            {topic.progress !== undefined && topic.progress > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium" style={{ color: accentHex }}>
                    {topic.progress >= 100 ? 'Completed' : 'In Progress'}
                  </span>
                  <span className="text-[11px] text-[#9ca3af]">{topic.progress}%</span>
                </div>
                <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full progress-bar-fill"
                    style={{ width: `${topic.progress}%`, background: accentHex }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Floating Action Button (Admin Mode) */}
      {isAdminMode && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          className="mobile-fab admin-mode"
          onClick={() => {
            // Open new topic modal
            console.log('Create new topic');
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      )}
    </div>
  );
}
