import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, FileText, Star, Clock, Tag, Trash2, BarChart2, Settings,
  Plus, ChevronRight, MoreHorizontal, Crown, ChevronsLeft, ChevronsRight,
  Archive, Copy, Move, Edit2, Palette, Check
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import useThemeStore from '../../store/useThemeStore';

const NAV_LINKS = [
  { id: 'home',     label: 'Home',      icon: Home,     badge: null },
  { id: 'allnotes', label: 'All Notes', icon: FileText,  badge: 'total' },
  { id: 'starred',  label: 'Starred',   icon: Star,      badge: 'starred' },
  { id: 'recent',   label: 'Recent',    icon: Clock,     badge: 'recent' },
  { id: 'tags',     label: 'Tags',      icon: Tag,       badge: null },
  { id: 'trash',    label: 'Trash',     icon: Trash2,    badge: 'trash' },
  { id: 'progress', label: 'Progress',  icon: BarChart2, badge: null },
  { id: 'settings', label: 'Settings',  icon: Settings,  badge: null },
];

const BADGE_VALUES = { total: 1248, starred: 86, recent: 24, trash: 12 };

function CategoryContextMenu({ cat, onClose, onEdit, onDelete, onDuplicate, onArchive }) {
  const ref = useRef();
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const items = [
    { label: 'Edit', icon: Edit2, action: onEdit },
    { label: 'Duplicate', icon: Copy, action: onDuplicate },
    { label: 'Archive', icon: Archive, action: onArchive },
    { label: 'Delete', icon: Trash2, action: onDelete, danger: true },
  ];

  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }}
      className="absolute right-0 top-8 z-50 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-1 overflow-hidden"
      onClick={e => e.stopPropagation()}>
      {items.map(item => (
        <button key={item.label} onClick={() => { item.action?.(); onClose(); }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:bg-gray-700'}`}>
          <item.icon size={13} />
          {item.label}
        </button>
      ))}
    </motion.div>
  );
}

function EditCategoryModal({ cat, onSave, onClose }) {
  const [name, setName] = useState(cat?.name || '');
  const [icon, setIcon] = useState(cat?.icon || '📁');
  const ICONS = ['📁','⚡','🎓','🏗️','💼','🌐','🧮','⚙️','🗄️','📦','🔥','💡','🎯','📊','🔗','🏆'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()}
        className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-80 shadow-2xl">
        <h3 className="text-sm font-semibold text-gray-100 mb-4">{cat ? 'Edit Category' : 'New Category'}</h3>
        <div className="mb-3">
          <label className="text-xs text-gray-400 mb-1 block">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-[rgb(var(--accent))]" autoFocus />
        </div>
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-2 block">Icon</label>
          <div className="grid grid-cols-8 gap-1">
            {ICONS.map(i => (
              <button key={i} onClick={() => setIcon(i)}
                className={`text-base p-1 rounded-md transition-colors ${icon === i ? 'bg-[rgb(var(--accent))]/20 ring-1 ring-[rgb(var(--accent))]' : 'hover:bg-gray-700'}`}>{i}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">Cancel</button>
          <button onClick={() => { if (name.trim()) { onSave({ name: name.trim(), icon }); onClose(); } }}
            className="flex-1 py-2 text-sm font-medium rounded-lg accent-bg text-white hover:opacity-90 transition-opacity">
            {cat ? 'Save' : 'Create'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Sidebar() {
  const { isAdminMode, activeView, selectedCategory, categories, setActiveView, selectCategory, addCategory, updateCategory, deleteCategory, duplicateNote, getStats } = useAppStore();
  const { isDark, toggleDark } = useThemeStore();
  const [contextMenu, setContextMenu] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const stats = getStats();

  const badgeMap = { total: stats.total, starred: stats.starred, recent: 24, trash: 12 };

  const handleCatAction = (action, cat) => {
    if (action === 'edit') setEditModal({ cat });
    else if (action === 'delete') { if (confirm(`Delete "${cat.name}"?`)) deleteCategory(cat.id); }
    else if (action === 'duplicate') addCategory({ ...cat, name: `${cat.name} (Copy)` });
    else if (action === 'archive') updateCategory(cat.id, { is_archived: !cat.is_archived });
  };

  return (
    <>
      <motion.aside animate={{ width: collapsed ? 60 : 220 }} transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="h-full bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden shrink-0 relative">

        {/* Header */}
        <div className={`flex items-center gap-2.5 px-4 py-4 border-b border-gray-800 ${collapsed ? 'justify-center px-0' : ''}`}>
          <div className="w-8 h-8 rounded-xl accent-bg flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
              <p className="text-xs font-bold text-gray-100 leading-none truncate">Interview Notes OS</p>
              <p className="text-[10px] text-gray-500 leading-none mt-0.5 truncate">Personal Knowledge Dashboard</p>
            </motion.div>
          )}
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute top-3.5 right-2 p-1 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors z-10">
          {collapsed ? <ChevronsRight size={13} /> : <ChevronsLeft size={13} />}
        </button>

        <div className="flex-1 overflow-y-auto py-2">
          {/* New Category */}
          {isAdminMode && !collapsed && (
            <div className="px-3 mb-3">
              <button onClick={() => setEditModal({ cat: null })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl accent-bg text-white text-xs font-semibold shadow-lg hover:opacity-90 transition-opacity">
                <Plus size={14} />
                New Category
              </button>
            </div>
          )}

          {/* Nav links */}
          <nav className="px-2 mb-4">
            {NAV_LINKS.map(({ id, label, icon: Icon, badge }) => {
              const isActive = activeView === id;
              return (
                <button key={id} onClick={() => setActiveView(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 transition-all text-left ${isActive ? 'accent-subtle-bg text-[rgb(var(--accent))]' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'} ${collapsed ? 'justify-center px-0' : ''}`}>
                  <Icon size={15} className="shrink-0" />
                  {!collapsed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between flex-1 min-w-0">
                      <span className="text-xs font-medium truncate">{label}</span>
                      {badge && badgeMap[badge] && (
                        <span className="text-[10px] text-gray-500">{badgeMap[badge]}</span>
                      )}
                    </motion.div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Categories */}
          {!collapsed && (
            <div className="px-2">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">Categories</span>
                {isAdminMode && (
                  <button onClick={() => setEditModal({ cat: null })} className="p-0.5 rounded text-gray-500 hover:text-[rgb(var(--accent))] transition-colors">
                    <Plus size={12} />
                  </button>
                )}
              </div>
              {categories.map(cat => {
                const isActive = selectedCategory?.id === cat.id;
                return (
                  <div key={cat.id} className="relative group">
                    <button onClick={() => selectCategory(cat)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 transition-all text-left ${isActive ? 'bg-gray-800 text-gray-100' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'}`}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: cat.color + '22', border: `1px solid ${cat.color}44` }}>
                        <span style={{ filter: isActive ? 'none' : 'grayscale(0.3)' }}>{cat.icon}</span>
                      </div>
                      <span className="flex-1 text-xs font-medium truncate">{cat.name}</span>
                      <span className="text-[10px] text-gray-500 shrink-0">{cat.note_count}</span>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full" style={{ background: cat.color }} />}
                    </button>
                    {isAdminMode && (
                      <button onClick={(e) => { e.stopPropagation(); setContextMenu(cat.id); }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-all">
                        <MoreHorizontal size={12} />
                      </button>
                    )}
                    <AnimatePresence>
                      {contextMenu === cat.id && (
                        <CategoryContextMenu cat={cat} onClose={() => setContextMenu(null)}
                          onEdit={() => handleCatAction('edit', cat)}
                          onDelete={() => handleCatAction('delete', cat)}
                          onDuplicate={() => handleCatAction('duplicate', cat)}
                          onArchive={() => handleCatAction('archive', cat)} />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Profile */}
        <div className={`border-t border-gray-800 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">A</div>
          ) : (
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white text-xs font-bold shrink-0">A</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-200 truncate">Aditya Verma</p>
                  <p className="text-[10px] text-gray-500 truncate">aditya.verma@gmail.com</p>
                </div>
              </div>
              <button onClick={() => useAppStore.getState().toggleAdminMode()}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all ${isAdminMode ? 'accent-subtle-bg border border-[rgb(var(--accent))]/30' : 'bg-gray-800'}`}>
                <div className="flex items-center gap-1.5">
                  <Crown size={12} className={isAdminMode ? 'text-[rgb(var(--accent))]' : 'text-gray-500'} />
                  <span className="text-[11px] font-medium text-gray-300">Admin Mode</span>
                </div>
                <div className={`w-7 h-4 rounded-full transition-all relative ${isAdminMode ? 'accent-bg' : 'bg-gray-700'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${isAdminMode ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      <AnimatePresence>
        {editModal && (
          <EditCategoryModal cat={editModal.cat}
            onClose={() => setEditModal(null)}
            onSave={(data) => {
              if (editModal.cat) updateCategory(editModal.cat.id, data);
              else addCategory(data);
            }} />
        )}
      </AnimatePresence>
    </>
  );
}
