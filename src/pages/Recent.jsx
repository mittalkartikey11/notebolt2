import React from 'react';
import { Clock } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import NoteCard from '../components/notes/NoteCard';

export default function Recent() {
  const { notes } = useAppStore();
  const allNotes = Object.entries(notes).flatMap(([topicId, noteList]) =>
    (noteList || []).filter(n => !n.is_deleted).map(n => ({ ...n, _topicId: topicId }))
  ).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 24);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Clock size={18} className="accent-text" />
          <div>
            <h1 className="text-lg font-bold text-gray-100">Recent Notes</h1>
            <p className="text-xs text-gray-500">Last 24 accessed notes</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {allNotes.map((note, idx) => (
            <NoteCard key={note.id} note={note} topicId={note._topicId} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
