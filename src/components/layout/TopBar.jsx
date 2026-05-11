import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sun, Moon, Bell, Crown, MoreHorizontal, Command, X,
  FileText, Tag, FolderOpen, Star, Pin
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import useThemeStore from '../../store/useThemeStore';
import { PALETTES } from '../../store/useThemeStore';

function PalettePickerDropdown({ onClose }) {
  const { currentPalette, setPalette } = useThemeStore();
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -8 }}
      className="absolute right-0 top-10 z-50 w-56 bg-[#131619] border border-[#24282B] rounded-xl shadow-2xl p-3">
      <p className="text-[10px] text-[#70777F] uppercase tracking-wider font-semibold px-2 mb-2">Accent Palette</p>
      <div className="grid grid-cols-2 gap-1.5">
        {Object.entries(PALETTES).map(([name, p]) => (
          <button key={name} onClick={() => { setPalette(name); onClose(); }}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all ${currentPalette === name ? 'bg-[#181B1E] text-[#F4F4F5]' : 'text-[#A7ADB2] hover:bg-[#181B1E] hover:text-[#F4F4F5]'}`}>
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.hex }} />
            <span className="truncate text-[11px]">{name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function SearchModal({ onClose }) {
  const { categories, topics, notes, selectCategory, selectTopic } = useAppStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef();
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const allTopics = Object.values(topics).flat();
  const allNotes = Object.values(notes).flat().filter(n => !n.is_deleted);

  const results = query.trim().length < 1 ? [] : [
    ...categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map(c => ({ type: 'category', item: c, label: c.name, sub: 'Category', icon: c.icon })),
    ...allTopics.filter(t => t.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4).map(t => ({ type: 'topic', item: t, label: t.name, sub: `${t.note_count} notes`, icon: t.icon })),
    ...allNotes.filter(n => (n.title || n.content_text || '').toLowerCase().includes(query.toLowerCase())).slice(0, 6).map(n => ({ type: 'note', item: n, label: n.title || n.content_text?.slice(0, 50) || 'Untitled', sub: 'Note', icon: '📝' })),
  ];

  useEffect(() => { setSelectedIdx(0); }, [query]);

  const handleSelect = (r) => {
    if (r.type === 'category') { const cat = categories.find(c => c.id === r.item.id); if (cat) selectCategory(cat); }
    else if (r.type === 'topic') { selectTopic(r.item); }
    onClose();
  };

  const handleKey = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { if (results[selectedIdx]) handleSelect(results[selectedIdx]); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-xl bg-[#131619] border border-[#24282B] rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#24282B]">
          <Search size={16} className="text-[#70777F] shrink-0" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKey}
            placeholder="Search notes, topics, categories, tags…"
            className="flex-1 bg-transparent text-sm text-[#F4F4F5] outline-none placeholder-[#70777F]" />
          <kbd className="text-[10px] text-[#70777F] bg-[#181B1E] px-1.5 py-0.5 rounded border border-[#24282B]">ESC</kbd>
        </div>
        {results.length > 0 ? (
          <div className="py-1 max-h-72 overflow-y-auto">
            {results.map((r, i) => (
              <button key={`${r.type}-${r.item.id}`} onClick={() => handleSelect(r)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === selectedIdx ? 'bg-[#181B1E] text-[#F97316]' : 'text-[#A7ADB2] hover:bg-[#181B1E]'}`}>
                <span className="text-base shrink-0">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-[#F4F4F5]">{r.label}</p>
                  <p className="text-[10px] text-[#70777F]">{r.type.charAt(0).toUpperCase() + r.type.slice(1)} · {r.sub}</p>
                </div>
              </button>
            ))}
          </div>
        ) : query.trim() ? (
          <div className="py-8 text-center text-[#70777F] text-sm">No results for "{query}"</div>
        ) : (
          <div className="py-4 px-4">
            <p className="text-[10px] text-[#70777F] uppercase tracking-wider mb-2">Quick shortcuts</p>
            {[
              { icon: Star, label: 'Starred Notes', action: () => { useAppStore.getState().setActiveView('starred'); onClose(); } },
              { icon: Pin, label: 'Pinned Notes', action: () => { useAppStore.getState().setActiveView('allnotes'); onClose(); } },
              { icon: Tag, label: 'Browse Tags', action: () => { useAppStore.getState().setActiveView('tags'); onClose(); } },
            ].map(s => (
              <button key={s.label} onClick={s.action} className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-[#A7ADB2] hover:text-[#F4F4F5] hover:bg-[#181B1E] transition-colors text-sm">
                <s.icon size={14} />
                {s.label}
              </button>
            ))}
          </div>
        )}
        <div className="px-4 py-2.5 border-t border-[#24282B] flex gap-3 text-[10px] text-[#70777F]">
          <span><kbd className="bg-[#181B1E] border border-[#24282B] px-1 rounded">↑↓</kbd> navigate</span>
          <span><kbd className="bg-[#181B1E] border border-[#24282B] px-1 rounded">Enter</kbd> select</span>
          <span><kbd className="bg-[#181B1E] border border-[#24282B] px-1 rounded">Esc</kbd> close</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function TopBar() {
  const { isAdminMode, toggleAdminMode, selectedCategory, selectedTopic, activeView } = useAppStore();
  const { isDark, toggleDark } = useThemeStore();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const h = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const breadcrumb = selectedTopic
    ? `${selectedCategory?.name || ''} / ${selectedTopic.name}`
    : selectedCategory
    ? selectedCategory.name
    : activeView.charAt(0).toUpperCase() + activeView.slice(1);

  return (
    <>
      <div className="h-[64px] border-b border-[#24282B] bg-[#0B0D0E] flex items-center gap-3 px-6 shrink-0 z-20">
        {/* Breadcrumb */}
        {(selectedCategory || activeView !== 'home') && (
          <div className="flex items-center gap-1.5 text-xs text-[#70777F] min-w-0 shrink-0">
            {selectedCategory && (
              <>
                <span className="text-sm">{selectedCategory.icon}</span>
                <span className="font-medium text-[#F4F4F5] truncate max-w-24">{selectedCategory.name}</span>
              </>
            )}
            {selectedTopic && (
              <>
                <span className="text-[#24282B]">/</span>
                <span className="font-medium text-[#A7ADB2] truncate max-w-24">{selectedTopic.name}</span>
              </>
            )}
          </div>
        )}

        {/* Search bar - center */}
        <button onClick={() => setSearchOpen(true)}
          className="flex-1 max-w-[500px] mx-auto flex items-center gap-2.5 px-4 py-2 bg-[#0F1113] border border-[#24282B] rounded-lg text-sm text-[#70777F] hover:border-[#F97316]/50 hover:text-[#F4F4F5] transition-colors cursor-text">
          <Search size={14} />
          <span className="flex-1 text-left">Search notes, topics, tags…</span>
          <kbd className="text-[10px] bg-[#181B1E] border border-[#24282B] px-2 py-1 rounded">Ctrl + K</kbd>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {/* Dark/Light toggle */}
          <button onClick={toggleDark}
            className="p-2.5 rounded-lg text-[#70777F] hover:text-[#F4F4F5] hover:bg-[#181B1E] transition-colors">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Palette picker */}
          <div className="relative">
            <button onClick={() => setPaletteOpen(!paletteOpen)}
              className="p-2.5 rounded-lg text-[#70777F] hover:text-[#F4F4F5] hover:bg-[#181B1E] transition-colors">
              <div className="w-4 h-4 rounded-full bg-[#F97316] shadow-lg" />
            </button>
            <AnimatePresence>
              {paletteOpen && <PalettePickerDropdown onClose={() => setPaletteOpen(false)} />}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <button className="p-2.5 rounded-lg text-[#70777F] hover:text-[#F4F4F5] hover:bg-[#181B1E] transition-colors relative">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#F97316] rounded-full" />
          </button>

          {/* Admin Mode */}
          <button onClick={toggleAdminMode}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-sm font-medium border transition-all ${isAdminMode ? 'bg-[#F97316] border-[#F97316] text-white shadow-lg' : 'bg-[#0F1113] border-[#24282B] text-[#70777F] hover:text-[#F4F4F5]'}`}>
            <Crown size={13} />
            {isAdminMode ? 'Admin Mode' : 'View Only'}
          </button>

          <button className="p-2.5 rounded-lg text-[#70777F] hover:text-[#F4F4F5] hover:bg-[#181B1E] transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
