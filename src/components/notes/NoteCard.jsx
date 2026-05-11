import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MoreHorizontal, Edit2, Trash2, Copy, Pin, CheckCircle,
  Circle, Tag, Link2, Palette, Code, X, Check, Clock, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExt from '@tiptap/extension-underline';
import CodeBlockExt from '@tiptap/extension-code-block';
import LinkExt from '@tiptap/extension-link';
import useAppStore from '../../store/useAppStore';
import useThemeStore from '../../store/useThemeStore';
import CodeBlock from './CodeBlock';

const REVIEW_CONFIG = {
  not_started: { label: 'Not Started', color: 'text-gray-500', barColor: 'bg-gray-600' },
  in_progress: { label: 'In Progress', color: 'text-orange-400', barColor: 'bg-orange-500' },
  reviewed: { label: 'Reviewed', color: 'text-green-400', barColor: 'bg-green-500' },
};

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', color: 'text-green-400', bg: 'bg-green-400/10' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  hard: { label: 'Hard', color: 'text-red-400', bg: 'bg-red-400/10' },
};

const BG_COLORS = [
  { name: 'none', label: 'Default', bg: 'bg-gray-800/40', border: 'border-gray-700/30' },
  { name: 'golden', label: 'Golden', bg: 'bg-yellow-500/8', border: 'border-yellow-500/30' },
  { name: 'orange', label: 'Orange', bg: 'bg-orange-500/8', border: 'border-orange-500/30' },
  { name: 'blue', label: 'Blue', bg: 'bg-blue-500/8', border: 'border-blue-500/30' },
  { name: 'cyan', label: 'Cyan', bg: 'bg-cyan-500/8', border: 'border-cyan-500/30' },
  { name: 'green', label: 'Green', bg: 'bg-green-500/8', border: 'border-green-500/30' },
  { name: 'purple', label: 'Purple', bg: 'bg-purple-500/8', border: 'border-purple-500/30' },
  { name: 'red', label: 'Red', bg: 'bg-red-500/8', border: 'border-red-500/30' },
];
const BG_COLOR_MAP = Object.fromEntries(BG_COLORS.map(c => [c.name, c]));

function NoteContextMenu({ note, topicId, onClose, onEdit, onDelete, onDuplicate, onTogglePin, onToggleStar, onMarkComplete, onColorChange, onTagAdd }) {
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  const [showColors, setShowColors] = useState(false);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }}
      className="absolute right-0 top-8 z-50 w-52 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-1 overflow-hidden"
      onClick={e => e.stopPropagation()}>
      <button onClick={() => { onEdit(); onClose(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
        <Edit2 size={13} /> Edit Note
      </button>
      <button onClick={() => { onTogglePin(); onClose(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
        <Pin size={13} /> {note.is_pinned ? 'Unpin' : 'Pin Note'}
      </button>
      <button onClick={() => { onToggleStar(); onClose(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
        <Star size={13} /> {note.is_starred ? 'Unstar' : 'Star Note'}
      </button>
      <button onClick={() => { onMarkComplete(); onClose(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
        <CheckCircle size={13} /> {note.is_completed ? 'Unmark' : 'Mark Completed'}
      </button>
      <div className="border-t border-gray-700 my-1" />
      <button onClick={() => setShowColors(!showColors)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
        <Palette size={13} /> Change Color
      </button>
      {showColors && (
        <div className="px-3 pb-2 grid grid-cols-4 gap-1">
          {BG_COLORS.map(c => (
            <button key={c.name} onClick={() => { onColorChange(c.name === 'none' ? null : c.name); onClose(); }}
              className={`h-5 rounded-md border-2 transition-all ${c.name === 'none' ? 'bg-gray-700 border-gray-600' : c.bg.replace('/8', '/40') + ' ' + c.border}`}
              title={c.label} />
          ))}
        </div>
      )}
      <div className="border-t border-gray-700 my-1" />
      <button onClick={() => { onDuplicate(); onClose(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
        <Copy size={13} /> Duplicate
      </button>
      <button onClick={() => {
        const text = note.content_text || note.title || '';
        const md = `# ${note.title || 'Note'}\n\n${text}`;
        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${note.title || 'note'}.md`; a.click();
        onClose();
      }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
        <Link2 size={13} /> Export Markdown
      </button>
      <button onClick={() => { navigator.clipboard.writeText(note.content_text || ''); onClose(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
        <Copy size={13} /> Copy Note
      </button>
      <div className="border-t border-gray-700 my-1" />
      <button onClick={() => { onDelete(); onClose(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
        <Trash2 size={13} /> Delete Note
      </button>
    </motion.div>
  );
}

function InlineEditor({ note, topicId, onSave, onCancel }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExt,
      CodeBlockExt,
      LinkExt.configure({ openOnClick: false }),
    ],
    content: note.content || { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: note.content_text || '' }] }] },
  });

  const [title, setTitle] = useState(note.title || '');

  const handleSave = () => {
    if (!editor) return;
    const content = editor.getJSON();
    const content_text = editor.getText();
    onSave({ title, content, content_text });
  };

  return (
    <div className="mt-2">
      <input value={title} onChange={e => setTitle(e.target.value)}
        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-100 outline-none focus:border-[rgb(var(--accent))]/50 mb-2 placeholder-gray-600"
        placeholder="Note title..." />
      <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 min-h-[80px] editor-content">
        <EditorContent editor={editor} />
      </div>
      <div className="flex gap-2 mt-2 justify-end">
        <button onClick={onCancel} className="px-3 py-1.5 text-xs text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">Cancel</button>
        <button onClick={handleSave} className="px-3 py-1.5 text-xs font-medium accent-bg text-white rounded-lg hover:opacity-90 transition-opacity">Save Changes</button>
      </div>
    </div>
  );
}

function renderContentNode(node, idx) {
  if (!node) return null;
  switch (node.type) {
    case 'doc':
      return <div key={idx} className="editor-content">{node.content?.map((n, i) => renderContentNode(n, i))}</div>;
    case 'paragraph':
      return <p key={idx} className="mb-1.5 text-sm text-gray-300 leading-relaxed last:mb-0">
        {node.content?.map((n, i) => renderContentNode(n, i)) || <br />}
      </p>;
    case 'text': {
      let el = <span key={idx}>{node.text}</span>;
      if (node.marks) {
        node.marks.forEach(mark => {
          if (mark.type === 'bold') el = <strong key={idx} className="font-bold text-gray-100">{el}</strong>;
          else if (mark.type === 'italic') el = <em key={idx} className="italic">{el}</em>;
          else if (mark.type === 'underline') el = <u key={idx}>{el}</u>;
          else if (mark.type === 'code') el = <code key={idx} className="code-block text-xs bg-gray-800 text-orange-300 px-1.5 py-0.5 rounded">{el}</code>;
          else if (mark.type === 'link') el = <a key={idx} href={mark.attrs?.href} target="_blank" rel="noreferrer" className="text-[rgb(var(--accent))] hover:underline">{el}</a>;
        });
      }
      return el;
    }
    case 'bulletList':
      return <ul key={idx} className="list-disc list-inside space-y-0.5 mb-1.5 text-sm text-gray-300">{node.content?.map((n, i) => renderContentNode(n, i))}</ul>;
    case 'orderedList':
      return <ol key={idx} className="list-decimal list-inside space-y-0.5 mb-1.5 text-sm text-gray-300">{node.content?.map((n, i) => renderContentNode(n, i))}</ol>;
    case 'listItem':
      return <li key={idx}>{node.content?.map((n, i) => renderContentNode(n, i))}</li>;
    case 'codeBlock':
      return <CodeBlock key={idx} code={node.content?.[0]?.text || ''} language={node.attrs?.language || 'javascript'} />;
    case 'blockquote':
      return <blockquote key={idx} className="border-l-2 border-[rgb(var(--accent))] pl-3 italic text-gray-400 text-sm my-1.5">{node.content?.map((n, i) => renderContentNode(n, i))}</blockquote>;
    case 'heading':
      const level = node.attrs?.level || 2;
      const classes = { 1: 'text-lg font-bold text-gray-100 mb-1', 2: 'text-base font-semibold text-gray-100 mb-1', 3: 'text-sm font-semibold text-gray-200 mb-1' };
      return React.createElement(`h${level}`, { key: idx, className: classes[level] || classes[2] }, node.content?.map((n, i) => renderContentNode(n, i)));
    case 'hardBreak':
      return <br key={idx} />;
    default:
      return null;
  }
}

export default function NoteCard({ note, topicId, index }) {
  const { isAdminMode, updateNote, deleteNote, duplicateNote } = useAppStore();
  const { getAccentHex } = useThemeStore();
  const [contextMenu, setContextMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const bgConfig = BG_COLOR_MAP[note.bg_color] || BG_COLOR_MAP['none'];
  const reviewConfig = REVIEW_CONFIG[note.review_status] || REVIEW_CONFIG.not_started;
  const diffConfig = note.difficulty ? DIFFICULTY_CONFIG[note.difficulty] : null;

  const handleToggleStar = () => updateNote(topicId, note.id, { is_starred: !note.is_starred });
  const handleTogglePin = () => updateNote(topicId, note.id, { is_pinned: !note.is_pinned });
  const handleMarkComplete = () => updateNote(topicId, note.id, { is_completed: !note.is_completed, review_status: !note.is_completed ? 'reviewed' : 'in_progress', progress: !note.is_completed ? 100 : note.progress });
  const handleColorChange = (color) => updateNote(topicId, note.id, { bg_color: color });
  const handleDelete = () => { if (confirm('Delete this note?')) deleteNote(topicId, note.id); };
  const handleSaveEdit = (updates) => { updateNote(topicId, note.id, updates); setIsEditing(false); };

  const hasContent = note.content && note.content.content && note.content.content.some(n => n.content?.length > 0 || n.type === 'codeBlock' || n.type === 'bulletList' || n.type === 'orderedList');

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      className={`rounded-xl border transition-all note-card-hover ${bgConfig.bg} ${bgConfig.border} ${note.is_pinned ? 'ring-1 ring-[rgb(var(--accent))]/20' : ''}`}>
      <div className="p-4">
        {/* Note Header */}
        <div className="flex items-start gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {note.is_pinned && <Pin size={11} className="text-[rgb(var(--accent))] shrink-0 mt-0.5" />}
            {note.title ? (
              <h3 className={`text-sm font-semibold leading-snug truncate ${note.is_completed ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                {note.title}
              </h3>
            ) : null}
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            <button onClick={handleToggleStar} className={`p-1 rounded-md transition-colors ${note.is_starred ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}>
              <Star size={13} fill={note.is_starred ? 'currentColor' : 'none'} />
            </button>
            <span className="text-[10px] text-gray-500">
              {note.created_at ? format(new Date(note.created_at), 'dd MMM yyyy') : ''}
            </span>
            {isAdminMode && (
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setContextMenu(!contextMenu); }}
                  className="p-1 rounded-md text-gray-600 hover:text-gray-300 hover:bg-gray-700 transition-colors">
                  <MoreHorizontal size={14} />
                </button>
                <AnimatePresence>
                  {contextMenu && (
                    <NoteContextMenu note={note} topicId={topicId} onClose={() => setContextMenu(false)}
                      onEdit={() => setIsEditing(true)}
                      onDelete={handleDelete}
                      onDuplicate={() => duplicateNote(topicId, note.id)}
                      onTogglePin={handleTogglePin}
                      onToggleStar={handleToggleStar}
                      onMarkComplete={handleMarkComplete}
                      onColorChange={handleColorChange} />
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Inline Editor or Content */}
        {isEditing ? (
          <InlineEditor note={note} topicId={topicId} onSave={handleSaveEdit} onCancel={() => setIsEditing(false)} />
        ) : (
          hasContent && (
            <div className="editor-content">
              {note.content?.content?.map((n, i) => renderContentNode(n, i))}
            </div>
          )
        )}

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {note.tags.map(tag => (
              <span key={tag.id} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: tag.color + '22', color: tag.color, border: `1px solid ${tag.color}44` }}>
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer: progress, difficulty, review status */}
        {(note.review_status !== 'not_started' || note.difficulty || note.progress > 0) && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {note.difficulty && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${diffConfig?.bg} ${diffConfig?.color}`}>
                  {diffConfig?.label}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 max-w-[180px]">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] ${reviewConfig.color}`}>{reviewConfig.label}</span>
                <span className="text-[10px] text-gray-500">{note.progress}%</span>
              </div>
              <div className="h-1 bg-gray-700/50 rounded-full overflow-hidden">
                <div className={`h-full rounded-full progress-bar-fill ${reviewConfig.barColor}`} style={{ width: `${note.progress}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
