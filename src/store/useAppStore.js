import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEMO_CATEGORIES = [
  { id: 'cat-1', name: 'DSA Sheets', icon: '⚡', color: '#ea580c', note_count: 389, sort_order: 0 },
  { id: 'cat-2', name: 'Core CS Subjects', icon: '🎓', color: '#3b82f6', note_count: 284, sort_order: 1 },
  { id: 'cat-3', name: 'System Design', icon: '🏗️', color: '#22c55e', note_count: 156, sort_order: 2 },
  { id: 'cat-4', name: 'Interview Experience', icon: '💼', color: '#a855f7', note_count: 112, sort_order: 3 },
  { id: 'cat-5', name: 'Web Development', icon: '🌐', color: '#f59e0b', note_count: 98, sort_order: 4 },
  { id: 'cat-6', name: 'Aptitude', icon: '🧮', color: '#ec4899', note_count: 76, sort_order: 5 },
  { id: 'cat-7', name: 'DevOps', icon: '⚙️', color: '#8b5cf6', note_count: 64, sort_order: 6 },
  { id: 'cat-8', name: 'Database', icon: '🗄️', color: '#6366f1', note_count: 52, sort_order: 7 },
  { id: 'cat-9', name: 'Others', icon: '📦', color: '#6b7280', note_count: 41, sort_order: 8 },
];

const now = new Date().toISOString();
const h = (n) => new Date(Date.now() - n * 3600000).toISOString();

const DEMO_TOPICS = {
  'cat-1': [
    { id: 'top-1', category_id: 'cat-1', name: 'Arrays', icon: '⚡', note_count: 42, progress: 75, is_pinned: true, sort_order: 0, last_activity_at: now },
    { id: 'top-2', category_id: 'cat-1', name: 'Strings', icon: '🔤', note_count: 38, progress: 60, is_pinned: false, sort_order: 1, last_activity_at: h(1) },
    { id: 'top-3', category_id: 'cat-1', name: 'Linked List', icon: '🔗', note_count: 35, progress: 80, is_pinned: false, sort_order: 2, last_activity_at: h(2) },
    { id: 'top-4', category_id: 'cat-1', name: 'Stacks & Queues', icon: '📚', note_count: 28, progress: 45, is_pinned: false, sort_order: 3, last_activity_at: h(3) },
    { id: 'top-5', category_id: 'cat-1', name: 'Recursion', icon: '🔄', note_count: 31, progress: 55, is_pinned: false, sort_order: 4, last_activity_at: h(4) },
    { id: 'top-6', category_id: 'cat-1', name: 'Binary Search', icon: '🔍', note_count: 21, progress: 90, is_pinned: false, sort_order: 5, last_activity_at: h(5) },
    { id: 'top-7', category_id: 'cat-1', name: 'Sorting', icon: '📊', note_count: 26, progress: 70, is_pinned: false, sort_order: 6, last_activity_at: h(6) },
    { id: 'top-8', category_id: 'cat-1', name: 'Dynamic Programming', icon: '💡', note_count: 51, progress: 35, is_pinned: false, sort_order: 7, last_activity_at: h(7) },
    { id: 'top-9', category_id: 'cat-1', name: 'Greedy', icon: '🏆', note_count: 23, progress: 65, is_pinned: false, sort_order: 8, last_activity_at: h(8) },
    { id: 'top-10', category_id: 'cat-1', name: 'Backtracking', icon: '↩️', note_count: 19, progress: 40, is_pinned: false, sort_order: 9, last_activity_at: h(9) },
    { id: 'top-11', category_id: 'cat-1', name: 'Bit Manipulation', icon: '💻', note_count: 16, progress: 50, is_pinned: false, sort_order: 10, last_activity_at: h(10) },
    { id: 'top-12', category_id: 'cat-1', name: 'Sliding Window', icon: '🪟', note_count: 14, progress: 85, is_pinned: false, sort_order: 11, last_activity_at: h(11) },
    { id: 'top-13', category_id: 'cat-1', name: 'Two Pointers', icon: '👆', note_count: 18, progress: 75, is_pinned: false, sort_order: 12, last_activity_at: h(12) },
  ],
  'cat-2': [
    { id: 'top-20', category_id: 'cat-2', name: 'DBMS', icon: '🗄️', note_count: 45, progress: 62, is_pinned: false, sort_order: 0, last_activity_at: now },
    { id: 'top-21', category_id: 'cat-2', name: 'OS Concepts', icon: '💻', note_count: 38, progress: 48, is_pinned: false, sort_order: 1, last_activity_at: h(1) },
    { id: 'top-22', category_id: 'cat-2', name: 'Computer Networks', icon: '🌐', note_count: 32, progress: 55, is_pinned: false, sort_order: 2, last_activity_at: h(2) },
    { id: 'top-23', category_id: 'cat-2', name: 'OOP Concepts', icon: '🎯', note_count: 29, progress: 80, is_pinned: false, sort_order: 3, last_activity_at: h(3) },
  ],
  'cat-3': [
    { id: 'top-30', category_id: 'cat-3', name: 'System Design Basics', icon: '🏗️', note_count: 28, progress: 58, is_pinned: false, sort_order: 0, last_activity_at: now },
    { id: 'top-31', category_id: 'cat-3', name: 'Load Balancing', icon: '⚖️', note_count: 15, progress: 40, is_pinned: false, sort_order: 1, last_activity_at: h(1) },
    { id: 'top-32', category_id: 'cat-3', name: 'Caching', icon: '⚡', note_count: 20, progress: 65, is_pinned: false, sort_order: 2, last_activity_at: h(2) },
  ],
  'cat-4': [
    { id: 'top-40', category_id: 'cat-4', name: 'Amazon Interview', icon: '📋', note_count: 22, progress: 70, is_pinned: false, sort_order: 0, last_activity_at: now },
    { id: 'top-41', category_id: 'cat-4', name: 'Google Interview', icon: '🔵', note_count: 18, progress: 45, is_pinned: false, sort_order: 1, last_activity_at: h(2) },
  ],
  'cat-5': [
    { id: 'top-50', category_id: 'cat-5', name: 'React JS', icon: '⚛️', note_count: 35, progress: 72, is_pinned: false, sort_order: 0, last_activity_at: now },
    { id: 'top-51', category_id: 'cat-5', name: 'JavaScript', icon: '📜', note_count: 28, progress: 88, is_pinned: false, sort_order: 1, last_activity_at: h(1) },
  ],
};

const DEMO_NOTES = {
  'top-1': [
    {
      id: 'note-1', topic_id: 'top-1', category_id: 'cat-1',
      title: 'Introduction to Arrays',
      content: { type: 'doc', content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Array is a collection of items stored at contiguous memory locations.' }] },
        { type: 'bulletList', content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Fixed size' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Same data type' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Index starts from 0' }] }] },
        ]}
      ]},
      content_text: 'Array is a collection of items stored at contiguous memory locations.',
      is_pinned: false, is_starred: true, is_completed: false, progress: 100,
      review_status: 'reviewed', difficulty: 'easy', bg_color: null,
      tags: [{ id: 'tag-1', name: 'Basic', color: '#ea580c' }],
      created_at: '2024-05-20T05:00:30Z', updated_at: '2024-05-20T05:00:30Z',
    },
    {
      id: 'note-2', topic_id: 'top-1', category_id: 'cat-1',
      title: 'Array Traversal',
      content: { type: 'doc', content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Iterating through each element of the array.' }] },
        { type: 'codeBlock', attrs: { language: 'javascript' }, content: [{ type: 'text', text: 'for (let i = 0; i < arr.length; i++) {\n  console.log(arr[i]);\n}' }] },
      ]},
      content_text: 'Iterating through each element of the array.',
      is_pinned: false, is_starred: false, is_completed: false, progress: 60,
      review_status: 'in_progress', difficulty: 'easy', bg_color: null,
      tags: [{ id: 'tag-2', name: 'Traversal', color: '#3b82f6' }],
      created_at: '2024-05-20T05:45:00Z', updated_at: '2024-05-20T05:45:00Z',
    },
    {
      id: 'note-3', topic_id: 'top-1', category_id: 'cat-1',
      title: 'Largest Element in Array',
      content: { type: 'doc', content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Find the largest element in an array in optimal way.' }] },
        { type: 'codeBlock', attrs: { language: 'javascript' }, content: [{ type: 'text', text: 'let max = arr[0];\nfor(let i = 1; i < arr.length; i++) {\n  if(arr[i] > max) max = arr[i];\n}' }] },
      ]},
      content_text: 'Find the largest element in an array in optimal way.',
      is_pinned: false, is_starred: false, is_completed: false, progress: 40,
      review_status: 'in_progress', difficulty: 'easy', bg_color: null,
      tags: [{ id: 'tag-3', name: 'Important', color: '#a855f7' }],
      created_at: '2024-05-20T06:55:00Z', updated_at: '2024-05-20T06:55:00Z',
    },
    {
      id: 'note-4', topic_id: 'top-1', category_id: 'cat-1',
      title: 'Two Sum Problem',
      content: { type: 'doc', content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Find two numbers that add up to target using HashMap for O(n) time.' }] },
      ]},
      content_text: 'Find two numbers that add up to target.',
      is_pinned: false, is_starred: false, is_completed: false, progress: 0,
      review_status: 'not_started', difficulty: 'medium', bg_color: null,
      tags: [{ id: 'tag-4', name: 'Leetcode', color: '#22c55e' }],
      created_at: '2024-05-20T07:50:00Z', updated_at: '2024-05-20T07:50:00Z',
    },
  ],
};

const useAppStore = create(
  persist(
    (set, get) => ({
      isAdminMode: false,
      selectedCategory: null,
      selectedTopic: null,
      activeView: 'home',
      categories: DEMO_CATEGORIES,
      topics: DEMO_TOPICS,
      notes: DEMO_NOTES,
      searchQuery: '',
      isSearchOpen: false,
      sidebarCollapsed: false,

      toggleAdminMode: () => set(s => ({ isAdminMode: !s.isAdminMode })),
      setActiveView: (view) => set({ activeView: view, selectedCategory: null, selectedTopic: null }),
      selectCategory: (cat) => set({ selectedCategory: cat, selectedTopic: null, activeView: 'category' }),
      selectTopic: (topic) => set({ selectedTopic: topic, activeView: 'topic' }),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSearchOpen: (v) => set({ isSearchOpen: v }),

      addCategory: (cat) => set(s => ({
        categories: [...s.categories, { ...cat, id: `cat-${Date.now()}`, note_count: 0, sort_order: s.categories.length }]
      })),
      updateCategory: (id, updates) => set(s => ({
        categories: s.categories.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteCategory: (id) => set(s => ({
        categories: s.categories.filter(c => c.id !== id),
        selectedCategory: s.selectedCategory?.id === id ? null : s.selectedCategory,
        selectedTopic: s.selectedTopic?.category_id === id ? null : s.selectedTopic,
      })),

      getTopicsForCategory: (catId) => {
        const s = get();
        return [...(s.topics[catId] || [])].sort((a, b) => new Date(b.last_activity_at) - new Date(a.last_activity_at));
      },
      addTopic: (catId, topic) => set(s => ({
        topics: { ...s.topics, [catId]: [...(s.topics[catId] || []), { ...topic, id: `top-${Date.now()}`, note_count: 0, progress: 0, sort_order: (s.topics[catId] || []).length, last_activity_at: new Date().toISOString() }] }
      })),
      updateTopic: (catId, topicId, updates) => set(s => ({
        topics: { ...s.topics, [catId]: (s.topics[catId] || []).map(t => t.id === topicId ? { ...t, ...updates, last_activity_at: new Date().toISOString() } : t) },
        selectedTopic: s.selectedTopic?.id === topicId ? { ...s.selectedTopic, ...updates } : s.selectedTopic,
      })),
      deleteTopic: (catId, topicId) => set(s => {
        const { [topicId]: _, ...remainingNotes } = s.notes;
        return {
          topics: { ...s.topics, [catId]: (s.topics[catId] || []).filter(t => t.id !== topicId) },
          notes: remainingNotes,
          selectedTopic: s.selectedTopic?.id === topicId ? null : s.selectedTopic,
        };
      }),

      getNotesForTopic: (topicId) => {
        const s = get();
        return (s.notes[topicId] || []).filter(n => !n.is_deleted);
      },
      addNote: (topicId, note) => {
        const newNote = { ...note, id: `note-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: note.tags || [] };
        set(s => {
          const catId = s.selectedTopic?.category_id;
          return {
            notes: { ...s.notes, [topicId]: [...(s.notes[topicId] || []), newNote] },
            topics: catId ? { ...s.topics, [catId]: (s.topics[catId] || []).map(t => t.id === topicId ? { ...t, note_count: t.note_count + 1, last_activity_at: new Date().toISOString() } : t) } : s.topics,
          };
        });
        return newNote;
      },
      updateNote: (topicId, noteId, updates) => set(s => ({
        notes: { ...s.notes, [topicId]: (s.notes[topicId] || []).map(n => n.id === noteId ? { ...n, ...updates, updated_at: new Date().toISOString() } : n) }
      })),
      deleteNote: (topicId, noteId) => set(s => {
        const catId = s.selectedTopic?.category_id;
        return {
          notes: { ...s.notes, [topicId]: (s.notes[topicId] || []).map(n => n.id === noteId ? { ...n, is_deleted: true } : n) },
          topics: catId ? { ...s.topics, [catId]: (s.topics[catId] || []).map(t => t.id === topicId ? { ...t, note_count: Math.max(0, t.note_count - 1) } : t) } : s.topics,
        };
      }),
      duplicateNote: (topicId, noteId) => {
        const s = get();
        const original = (s.notes[topicId] || []).find(n => n.id === noteId);
        if (!original) return;
        const copy = { ...original, id: `note-${Date.now()}`, title: `${original.title} (Copy)`, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), telegram_message_id: null };
        set(st => ({ notes: { ...st.notes, [topicId]: [...(st.notes[topicId] || []), copy] } }));
      },

      getStats: () => {
        const s = get();
        const allNotes = Object.values(s.notes).flat().filter(n => !n.is_deleted);
        return {
          total: allNotes.length,
          starred: allNotes.filter(n => n.is_starred).length,
          completed: allNotes.filter(n => n.is_completed).length,
          inProgress: allNotes.filter(n => n.review_status === 'in_progress').length,
          categories: s.categories.length,
        };
      },

      importTelegramData: (parsedData) => {
        const { categories = [], topicsByCategory = {}, notesByTopic = {} } = parsedData;
        set(s => {
          const newCats = [...s.categories];
          const newTopics = { ...s.topics };
          const newNotes = { ...s.notes };
          categories.forEach(cat => { if (!newCats.find(c => c.name === cat.name)) newCats.push(cat); });
          Object.entries(topicsByCategory).forEach(([catId, topics]) => {
            newTopics[catId] = [...(newTopics[catId] || []), ...topics.filter(t => !(newTopics[catId] || []).find(e => e.telegram_topic_id === t.telegram_topic_id))];
          });
          Object.entries(notesByTopic).forEach(([topicId, notes]) => {
            const existingIds = (newNotes[topicId] || []).map(n => n.telegram_message_id).filter(Boolean);
            newNotes[topicId] = [...(newNotes[topicId] || []), ...notes.filter(n => !existingIds.includes(n.telegram_message_id))];
          });
          return { categories: newCats, topics: newTopics, notes: newNotes };
        });
      },

      resetAllData: () => set({ categories: DEMO_CATEGORIES, topics: DEMO_TOPICS, notes: DEMO_NOTES }),
      clearAllNotes: () => set({ notes: {} }),
      clearAllTopics: () => set(s => ({ topics: {}, notes: {}, selectedTopic: null })),
    }),
    { name: 'interview-notes-os-v2', partialize: (s) => ({ categories: s.categories, topics: s.topics, notes: s.notes, isAdminMode: s.isAdminMode }) }
  )
);

export default useAppStore;
