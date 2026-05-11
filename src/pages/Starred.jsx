import React from 'react';
import { Star, FileText } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import NoteCard from '../components/notes/NoteCard';

export default function Starred() {
  const { notes } = useAppStore();
  const starred = Object.entries(notes).flatMap(([topicId, noteList]) =>
    (noteList || []).filter(n => !n.is_deleted && n.is_starred).map(n => ({ ...n, _topicId: topicId }))
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Star size={18} className="text-yellow-400" fill="currentColor" />
          <div>
            <h1 className="text-lg font-bold text-gray-100">Starred Notes</h1>
            <p className="text-xs text-gray-500">{starred.length} starred notes</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {starred.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Star size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No starred notes yet</p>
              <p className="text-xs text-gray-600 mt-1">Click the star icon on any note to save it here</p>
            </div>
          ) : starred.map((note, idx) => (
            <NoteCard key={note.id} note={note} topicId={note._topicId} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
