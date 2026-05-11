import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, MoreHorizontal, Edit2, Trash2, Copy, Move, Pin,
  Archive, Check, ChevronDown, Filter, SlidersHorizontal, RefreshCw
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const PROGRESS_COLORS = {
  0: 'bg-gray-600',
  25: 'bg-red-500',
  50: 'bg-yellow-500',
  75: 'bg-orange-500',
  100: 'bg-green-500',
};
const progressColor = (p) => {
  if (p >= 100) return 'bg-green-500';
  if (p >= 75) return 'bg-orange-500';
  if (p >= 50) return 'bg-yellow-500';
  if (p >= 25) return 'bg-red-400';
  return 'bg-gray-600';
};

function TopicContextMenu({ topic, catId, onClose, onEdit, onDelete, onDuplicate, onPin, onArchive }) {
  const ref = useRef();
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      className="absolute right-0 top-8 z-50 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-1"
      onClick={e => e.stopPropagation()}>
      {[
        { label: topic.is_pinned ? 'Unpin' : 'Pin Topic', icon: Pin, action: onPin },
        { label: 'Edit Topic', icon: Edit2, action: onEdit },
        { label: 'Duplicate', icon: Copy, action: onDuplicate },
        { label: 'Archive', icon: Archive, action: onArchive },
        { label: 'Delete Topic', icon: Trash2, action: onDelete, danger: true },
      ].map(item => (
        <button key={item.label} onClick={() => { item.action?.(); onClose(); }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:bg-gray-700'}`}>
          <item.icon size={13} />
          {item.label}
        </button>
      ))}
    </motion.div>
  );
}

function EditTopicModal({ topic, onSave, onClose }) {
  const [name, setName] = useState(topic?.name || '');
  const [icon, setIcon] = useState(topic?.icon || '📝');
  const ICONS = ['📝','⚡','🔤','🔗','📚','🔄','🔍','📊','💡','🏆','↩️','💻','🪟','👆','🗄️','🌐','🎯','🏗️','⚖️','📋','🔵','⚛️','📜','🧮','💼','🔥'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()}
        className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-80 shadow-2xl">
        <h3 className="text-sm font-semibold text-gray-100 mb-4">{topic ? 'Edit Topic' : 'New Topic'}</h3>
        <div className="mb-3">
          <label className="text-xs text-gray-400 mb-1 block">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Topic name..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-[rgb(var(--accent))]" autoFocus />
        </div>
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-2 block">Icon</label>
          <div className="grid grid-cols-8 gap-1 max-h-24 overflow-y-auto">
            {ICONS.map(i => (
              <button key={i} onClick={() => setIcon(i)}
                className={`text-base p-1 rounded-md transition-colors ${icon === i ? 'bg-[rgb(var(--accent))]/20 ring-1 ring-[rgb(var(--accent))]' : 'hover:bg-gray-700'}`}>{i}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800">Cancel</button>
          <button onClick={() => { if (name.trim()) { onSave({ name: name.trim(), icon }); onClose(); } }}
            className="flex-1 py-2 text-sm font-medium rounded-lg accent-bg text-white hover:opacity-90">
            {topic ? 'Save' : 'Create'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function TopicsPanel() {
  const { isAdminMode, selectedCategory, selectedTopic, selectTopic, addTopic, updateTopic, deleteTopic, getTopicsForCategory } = useAppStore();
  const [contextMenu, setContextMenu] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('activity');

  if (!selectedCategory) return null;

  const allTopics = getTopicsForCategory(selectedCategory.id);
  const topics = allTopics.filter(t => !t.is_archived && t.name.toLowerCase().includes(search.toLowerCase()));
  const sorted = [...topics].sort((a, b) => {
    if (sortBy === 'activity') return new Date(b.last_activity_at) - new Date(a.last_activity_at);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'notes') return b.note_count - a.note_count;
    if (sortBy === 'progress') return b.progress - a.progress;
    return 0;
  });

  const pinned = sorted.filter(t => t.is_pinned);
  const unpinned = sorted.filter(t => !t.is_pinned);

  const handleTopicAction = (action, topic) => {
    const catId = selectedCategory.id;
    if (action === 'edit') setEditModal({ topic });
    else if (action === 'delete') { if (confirm(`Delete "${topic.name}"?`)) deleteTopic(catId, topic.id); }
    else if (action === 'duplicate') addTopic(catId, { ...topic, name: `${topic.name} (Copy)`, is_pinned: false });
    else if (action === 'pin') updateTopic(catId, topic.id, { is_pinned: !topic.is_pinned });
    else if (action === 'archive') updateTopic(catId, topic.id, { is_archived: !topic.is_archived });
  };

  const renderTopic = (topic) => {
    const isActive = selectedTopic?.id === topic.id;
    return (
      <div key={topic.id} className="relative group mb-1.5">
        <div
          onClick={() => selectTopic(topic)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && selectTopic(topic)}
          className={`w-full text-left px-3 py-3 rounded-xl border transition-all cursor-pointer select-none ${isActive ? 'bg-gray-800 border-[rgb(var(--accent))]/30 shadow-lg' : 'bg-gray-800/40 border-transparent hover:bg-gray-800/80 hover:border-gray-700/50'}`}>
          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-r-full accent-bg" />}
          <div className="flex items-center gap-2.5 mb-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 ${isActive ? 'accent-bg shadow-md' : 'bg-gray-700'}`}>
              <span className="leading-none">{topic.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                {topic.is_pinned && <Pin size={9} className="text-[rgb(var(--accent))] shrink-0" />}
                <span className={`text-xs font-semibold truncate ${isActive ? 'text-gray-100' : 'text-gray-200'}`}>{topic.name}</span>
              </div>
              <span className="text-[10px] text-gray-500">{topic.note_count} notes</span>
            </div>
            {isAdminMode && (
              <span
                role="button"
                tabIndex={0}
                onClick={e => { e.stopPropagation(); setContextMenu(contextMenu === topic.id ? null : topic.id); }}
                onKeyDown={e => e.key === 'Enter' && e.stopPropagation()}
                className="p-1 rounded opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-all cursor-pointer">
                <MoreHorizontal size={12} />
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full progress-bar-fill ${progressColor(topic.progress)}`} style={{ width: `${topic.progress}%` }} />
            </div>
            <span className="text-[10px] text-gray-500 shrink-0">{topic.progress}%</span>
          </div>
        </div>
        <AnimatePresence>
          {contextMenu === topic.id && (
            <TopicContextMenu topic={topic} catId={selectedCategory.id} onClose={() => setContextMenu(null)}
              onEdit={() => handleTopicAction('edit', topic)}
              onDelete={() => handleTopicAction('delete', topic)}
              onDuplicate={() => handleTopicAction('duplicate', topic)}
              onPin={() => handleTopicAction('pin', topic)}
              onArchive={() => handleTopicAction('archive', topic)} />
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="w-[220px] h-full bg-gray-900/50 border-r border-gray-800 flex flex-col shrink-0">

        {/* Header */}
        <div className="px-4 py-3.5 border-b border-gray-800">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">{selectedCategory.icon}</span>
              <div>
                <h2 className="text-sm font-bold text-gray-100 leading-none">{selectedCategory.name}</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">{topics.length} topics</p>
              </div>
            </div>
            {isAdminMode && (
              <button onClick={() => setEditModal({ topic: null })}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-white accent-bg hover:opacity-90 transition-opacity">
                <Plus size={10} />
                New
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search topics..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-gray-300 outline-none focus:border-[rgb(var(--accent))]/50 placeholder-gray-600" />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1 mt-2">
            <SlidersHorizontal size={10} className="text-gray-500" />
            {['activity','name','notes','progress'].map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`text-[9px] px-1.5 py-0.5 rounded capitalize transition-colors ${sortBy === s ? 'accent-bg text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Topics List */}
        <div className="flex-1 overflow-y-auto p-2">
          {pinned.length > 0 && (
            <div className="mb-1">
              <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-wider px-2 mb-1">Pinned</p>
              {pinned.map(renderTopic)}
            </div>
          )}
          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-wider px-2 mb-1 mt-2">Topics</p>}
              {unpinned.map(renderTopic)}
            </div>
          )}
          {topics.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <span className="text-2xl mb-2">📝</span>
              <p className="text-xs text-gray-500">No topics yet</p>
              {isAdminMode && <button onClick={() => setEditModal({ topic: null })} className="text-xs text-[rgb(var(--accent))] mt-1 hover:underline">Create one</button>}
            </div>
          )}
        </div>

        {/* Manage Topics */}
        <div className="border-t border-gray-800 p-3">
          <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <SlidersHorizontal size={12} />
            Manage Topics
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {editModal && (
          <EditTopicModal topic={editModal.topic}
            onClose={() => setEditModal(null)}
            onSave={(data) => {
              const catId = selectedCategory.id;
              if (editModal.topic) updateTopic(catId, editModal.topic.id, data);
              else addTopic(catId, data);
            }} />
        )}
      </AnimatePresence>
    </>
  );
}
