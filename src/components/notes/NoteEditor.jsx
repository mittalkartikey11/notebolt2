import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold, Italic, Underline, Code, AlignLeft, List, ListOrdered,
  Quote, Minus, Link2, Image, Paperclip, Smile, Plus, ChevronDown,
  Type, Hash, Send
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExt from '@tiptap/extension-underline';
import CodeBlockExt from '@tiptap/extension-code-block';
import LinkExt from '@tiptap/extension-link';
import PlaceholderExt from '@tiptap/extension-placeholder';
import useAppStore from '../../store/useAppStore';

const TOOLBAR_GROUPS = [
  [
    { id: 'bold', icon: Bold, label: 'Bold (Ctrl+B)', action: (e) => e.chain().focus().toggleBold().run(), isActive: (e) => e.isActive('bold') },
    { id: 'italic', icon: Italic, label: 'Italic (Ctrl+I)', action: (e) => e.chain().focus().toggleItalic().run(), isActive: (e) => e.isActive('italic') },
    { id: 'underline', icon: Underline, label: 'Underline (Ctrl+U)', action: (e) => e.chain().focus().toggleUnderline().run(), isActive: (e) => e.isActive('underline') },
  ],
  [
    { id: 'h2', icon: Type, label: 'Heading 2', action: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(), isActive: (e) => e.isActive('heading', { level: 2 }) },
    { id: 'h3', icon: Hash, label: 'Heading 3', action: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(), isActive: (e) => e.isActive('heading', { level: 3 }) },
  ],
  [
    { id: 'code', icon: Code, label: 'Inline Code (Ctrl+M)', action: (e) => e.chain().focus().toggleCode().run(), isActive: (e) => e.isActive('code') },
    { id: 'codeBlock', label: 'Code Block', icon: () => <span className="text-[10px] font-mono font-bold">{'</>'}</span>, action: (e) => e.chain().focus().toggleCodeBlock().run(), isActive: (e) => e.isActive('codeBlock') },
  ],
  [
    { id: 'bulletList', icon: List, label: 'Bullet List', action: (e) => e.chain().focus().toggleBulletList().run(), isActive: (e) => e.isActive('bulletList') },
    { id: 'orderedList', icon: ListOrdered, label: 'Numbered List', action: (e) => e.chain().focus().toggleOrderedList().run(), isActive: (e) => e.isActive('orderedList') },
    { id: 'blockquote', icon: Quote, label: 'Quote', action: (e) => e.chain().focus().toggleBlockquote().run(), isActive: (e) => e.isActive('blockquote') },
  ],
  [
    { id: 'hr', icon: Minus, label: 'Divider', action: (e) => e.chain().focus().setHorizontalRule().run(), isActive: () => false },
  ],
];

export default function NoteEditor({ topicId, categoryId }) {
  const { addNote } = useAppStore();
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileRef = useRef();

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExt,
      LinkExt.configure({ openOnClick: false }),
      PlaceholderExt.configure({ placeholder: 'Write a note… Use Ctrl+B/I/U for formatting, Ctrl+M for inline code' }),
    ],
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setIsExpanded(text.length > 0);
    },
    onFocus: () => { setIsFocused(true); setIsExpanded(true); },
    onBlur: ({ editor }) => {
      if (!editor.getText()) { setIsFocused(false); setIsExpanded(false); }
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.ctrlKey && event.key === 'Enter') {
          handleSubmit();
          return true;
        }
        return false;
      },
    },
  });

  // Keyboard shortcut bindings
  useEffect(() => {
    if (!editor) return;
    const handleKeyDown = (e) => {
      if (!isFocused) return;
      if (e.ctrlKey && e.key === 'm') { e.preventDefault(); editor.chain().focus().toggleCode().run(); }
      if (e.ctrlKey && e.key === 'k') { e.preventDefault(); const url = prompt('Enter URL:'); if (url) editor.chain().focus().setLink({ href: url }).run(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, isFocused]);

  const handleSubmit = () => {
    if (!editor) return;
    const content = editor.getJSON();
    const content_text = editor.getText();
    if (!content_text.trim() && !title.trim()) return;

    addNote(topicId, {
      topic_id: topicId,
      category_id: categoryId,
      title: title.trim() || null,
      content,
      content_text,
      is_pinned: false,
      is_starred: false,
      is_completed: false,
      progress: 0,
      review_status: 'not_started',
      difficulty: null,
      bg_color: null,
      tags: [],
    });

    editor.commands.clearContent();
    setTitle('');
    setIsExpanded(false);
    setIsFocused(false);
  };

  if (!editor) return null;

  return (
    <div className="border-t border-gray-800 bg-gray-900/60 shrink-0">
      <motion.div
        animate={{ height: isExpanded ? 'auto' : 'auto' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="px-4 py-3">

        {/* Title input - only shown when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-2">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Note title (optional)…"
                className="w-full bg-transparent border-b border-gray-700/50 pb-1 text-sm font-semibold text-gray-100 outline-none placeholder-gray-600 focus:border-[rgb(var(--accent))]/40 transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor area */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className={`transition-all duration-200 editor-content text-sm text-gray-300 ${isExpanded ? 'min-h-[60px]' : 'min-h-[36px]'}`}>
              <EditorContent editor={editor} />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl accent-bg text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-lg mt-0.5">
            <Plus size={13} />
            Add Note
          </button>
        </div>

        {/* Toolbar - only shown when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-800 flex-wrap">
              {TOOLBAR_GROUPS.map((group, gi) => (
                <React.Fragment key={gi}>
                  {gi > 0 && <div className="w-px h-4 bg-gray-700 mx-0.5" />}
                  {group.map(({ id, icon: Icon, label, action, isActive }) => (
                    <button key={id} title={label}
                      onClick={() => action(editor)}
                      className={`p-1.5 rounded-md transition-colors text-xs ${isActive(editor) ? 'accent-bg text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}>
                      {typeof Icon === 'function' && Icon.length === 0 ? <Icon /> : <Icon size={13} />}
                    </button>
                  ))}
                </React.Fragment>
              ))}
              <div className="w-px h-4 bg-gray-700 mx-0.5" />
              <button title="Image Upload" onClick={() => fileRef.current?.click()} className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors">
                <Image size={13} />
              </button>
              <button title="Attachment" className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors">
                <Paperclip size={13} />
              </button>
              <button title="Link (Ctrl+K)" onClick={() => { const url = prompt('Enter URL:'); if (url) editor.chain().focus().setLink({ href: url }).run(); }}
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors">
                <Link2 size={13} />
              </button>
              <div className="ml-auto text-[9px] text-gray-600">Ctrl+Enter to save</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
        const file = e.target.files?.[0];
        if (file) { const url = URL.createObjectURL(file); editor.chain().focus().setImage({ src: url }).run(); }
      }} />
    </div>
  );
}
