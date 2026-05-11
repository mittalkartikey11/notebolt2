import React from 'react';
import { Trash2, RotateCcw, X } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import NoteCard from '../components/notes/NoteCard';

export default function Trash() {
  const { notes, updateNote } = useAppStore();
  const trashed = Object.entries(notes).flatMap(([topicId, noteList]) =>
    (noteList || []).filter(n => n.is_deleted).map(n => ({ ...n, _topicId: topicId }))
  );

  const restore = (note) => updateNote(note._topicId, note.id, { is_deleted: false });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trash2 size={18} className="text-red-400" />
            <div>
              <h1 className="text-lg font-bold text-gray-100">Trash</h1>
              <p className="text-xs text-gray-500">{trashed.length} deleted notes</p>
            </div>
          </div>
        </div>

        {trashed.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Trash2 size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Trash is empty</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trashed.map((note, idx) => (
              <div key={note.id} className="relative">
                <NoteCard note={note} topicId={note._topicId} index={idx} />
                <button onClick={() => restore(note)}
                  className="absolute top-3 right-10 flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] rounded-lg hover:bg-green-500/20 transition-colors">
                  <RotateCcw size={10} />
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
