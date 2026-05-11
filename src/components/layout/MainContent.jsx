import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, FileText, List, MoreHorizontal } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import NoteCard from '../notes/NoteCard';
import NoteEditor from '../notes/NoteEditor';




export default function MainContent() {
  const { isAdminMode, selectedTopic, selectedCategory, getNotesForTopic, addNote, updateNote, deleteNote, duplicateNote, updateTopic } = useAppStore();
  const [view, setView] = useState('list');

  if (!selectedTopic) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center bg-gray-950">
        <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
          <FileText size={24} className="text-gray-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-400 mb-1">Select a Topic</h3>
        <p className="text-sm text-gray-600">Choose a topic from the left panel to view notes</p>
      </div>
    );
  }

  const notes = getNotesForTopic(selectedTopic.id);

  const handleMarkComplete = () => {
    updateTopic(selectedCategory?.id, selectedTopic.id, {
      progress: selectedTopic.progress === 100 ? 0 : 100
    });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-gray-950 overflow-hidden">
      {/* Topic Header */}
      <div className="flex items-center gap-4 px-6 py-3.5 border-b border-gray-800 shrink-0 bg-gray-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl accent-bg flex items-center justify-center">
            <span className="text-base">{selectedTopic.icon}</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-100">{selectedTopic.name}</h1>
            <p className="text-[10px] text-gray-500">{notes.length} notes</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={handleMarkComplete}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedTopic.progress === 100 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-[rgb(var(--accent))]/30 hover:text-[rgb(var(--accent))]'}`}>
            <CheckCircle size={13} />
            {selectedTopic.progress === 100 ? 'Completed' : 'Mark as Completed'}
          </button>
          {/* View toggle */}
          <div className="flex bg-gray-800 rounded-lg p-0.5">
            {[['list', <List size={13} />], ['grid', <FileText size={13} />]].map(([v, icon]) => (
              <button key={v} onClick={() => setView(v)}
                className={`p-1.5 rounded-md transition-colors ${view === v ? 'accent-bg text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                {icon}
              </button>
            ))}
          </div>
          <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center mb-3">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-400 mb-1">No notes yet</h3>
            <p className="text-xs text-gray-600 mb-4">Start adding notes to this topic</p>
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
            <AnimatePresence initial={false}>
              {notes.map((note, idx) => (
                <NoteCard key={note.id} note={note} index={idx} topicId={selectedTopic.id} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Editor */}
      {isAdminMode && <NoteEditor topicId={selectedTopic.id} categoryId={selectedCategory?.id} />}
    </div>
  );
}
