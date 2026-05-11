import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, FileText, FolderOpen, Tag, Pin } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import NoteCard from '../components/notes/NoteCard';

export default function AllNotes() {
  const { notes, topics, categories } = useAppStore();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');

  const allNotes = Object.entries(notes).flatMap(([topicId, noteList]) =>
    (noteList || []).filter(n => !n.is_deleted).map(n => ({ ...n, _topicId: topicId }))
  );

  const filtered = allNotes.filter(n => {
    if (filter === 'starred') return n.is_starred;
    if (filter === 'pinned') return n.is_pinned;
    if (filter === 'completed') return n.is_completed;
    if (filter === 'in_progress') return n.review_status === 'in_progress';
    return true;
  }).sort((a, b) => {
    if (sort === 'recent') return new Date(b.updated_at) - new Date(a.updated_at);
    if (sort === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    return 0;
  });

  const FILTERS = [
    { id: 'all', label: 'All Notes', icon: FileText },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'pinned', label: 'Pinned', icon: Pin },
    { id: 'completed', label: 'Completed', icon: FileText },
    { id: 'in_progress', label: 'In Progress', icon: FileText },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-100">All Notes</h1>
            <p className="text-xs text-gray-500 mt-0.5">{allNotes.length} total notes</p>
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none">
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${filter === f.id ? 'accent-bg text-white border-transparent' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200'}`}>
              <f.icon size={12} />
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FileText size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notes found</p>
            </div>
          ) : (
            filtered.map((note, idx) => (
              <NoteCard key={note.id} note={note} topicId={note._topicId} index={idx} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
