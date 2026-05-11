import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Upload, AlertTriangle, Trash2, RefreshCw, Database,
  FileJson, Check, X, ChevronRight, Info, Palette, Moon, Sun,
  Shield, Download, Zap
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import useThemeStore from '../store/useThemeStore';
import { PALETTES } from '../store/useThemeStore';
import { parseTelegramExport } from '../utils/telegramImport';

function ConfirmModal({ title, message, onConfirm, onCancel, danger }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-96 shadow-2xl">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${danger ? 'bg-red-500/10' : 'bg-orange-500/10'}`}>
          <AlertTriangle size={18} className={danger ? 'text-red-400' : 'text-orange-400'} />
        </div>
        <h3 className="text-sm font-bold text-gray-100 mb-2">{title}</h3>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm border border-gray-700 rounded-xl text-gray-400 hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${danger ? 'bg-red-500 text-white hover:bg-red-600' : 'accent-bg text-white hover:opacity-90'}`}>
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ImportSection() {
  const { importTelegramData } = useAppStore();
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [stats, setStats] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef();

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('loading');
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const parsed = parseTelegramExport(json);
      importTelegramData(parsed);
      setStats({
        categories: parsed.categories.length,
        topics: Object.values(parsed.topicsByCategory).flat().length,
        notes: Object.values(parsed.notesByTopic).flat().length,
      });
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to parse file');
      setStatus('error');
    }
    e.target.value = '';
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Upload size={14} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-100">Telegram Import</h3>
          <p className="text-[11px] text-gray-500">Import notes from Telegram group export (result.json)</p>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl p-6 text-center mb-4 cursor-pointer hover:border-gray-500 transition-colors"
        onClick={() => fileRef.current?.click()}>
        <FileJson size={24} className="mx-auto mb-2 text-gray-500" />
        <p className="text-sm text-gray-300 font-medium">Click to upload result.json</p>
        <p className="text-xs text-gray-600 mt-1">Exported from Telegram Desktop → Export Chat History</p>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
      </div>

      <div className="bg-gray-800/40 rounded-xl p-4 text-xs text-gray-400 space-y-1">
        <p className="font-semibold text-gray-300 mb-2">📋 Mapping Logic:</p>
        <p>• Group name → Category</p>
        <p>• Topics → Topics (via topic_created service messages)</p>
        <p>• Messages → Notes (with full formatting preserved)</p>
        <p>• Bold, italic, code, pre blocks → Rich text</p>
        <p>• Duplicate detection via telegram_message_id</p>
      </div>

      <AnimatePresence>
        {status === 'loading' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <RefreshCw size={12} className="animate-spin" />
            Parsing export file…
          </motion.div>
        )}
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Check size={14} className="text-green-400" />
              <span className="text-sm font-semibold text-green-400">Import Successful!</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[['Categories', stats?.categories], ['Topics', stats?.topics], ['Notes', stats?.notes]].map(([l, v]) => (
                <div key={l} className="text-center">
                  <p className="text-lg font-bold text-green-300">{v}</p>
                  <p className="text-[10px] text-gray-500">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-2">
              <X size={14} className="text-red-400" />
              <span className="text-xs text-red-400">{errorMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DangerZone() {
  const { resetAllData, clearAllNotes, clearAllTopics, categories, deleteCategory } = useAppStore();
  const [confirm, setConfirm] = useState(null);

  const ACTIONS = [
    {
      id: 'clear-notes',
      label: 'Delete All Notes',
      description: 'Permanently delete every note in the app. Cannot be undone.',
      action: clearAllNotes,
    },
    {
      id: 'clear-topics',
      label: 'Delete All Topics & Notes',
      description: 'Remove all topics and their notes from every category.',
      action: clearAllTopics,
    },
    {
      id: 'reset-all',
      label: 'Reset App to Demo Data',
      description: 'Reset the entire app back to factory demo data. All your data will be lost.',
      action: resetAllData,
    },
  ];

  return (
    <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
          <AlertTriangle size={14} className="text-red-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
          <p className="text-[11px] text-gray-500">Irreversible destructive actions — use with caution</p>
        </div>
      </div>
      <div className="space-y-2">
        {ACTIONS.map(action => (
          <div key={action.id} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/15 rounded-xl">
            <div>
              <p className="text-xs font-semibold text-gray-200">{action.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{action.description}</p>
            </div>
            <button onClick={() => setConfirm(action)}
              className="px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors shrink-0 ml-4">
              {action.label.split(' ').slice(0, 2).join(' ')}
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {confirm && (
          <ConfirmModal title={confirm.label} danger
            message={`${confirm.description} Are you absolutely sure?`}
            onConfirm={() => { confirm.action(); setConfirm(null); }}
            onCancel={() => setConfirm(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SettingsPage() {
  const { isDark, toggleDark, currentPalette, setPalette } = useThemeStore();
  const { isAdminMode, toggleAdminMode } = useAppStore();

  return (
    <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Settings size={18} className="accent-text" />
          <div>
            <h1 className="text-lg font-bold text-gray-100">Settings</h1>
            <p className="text-xs text-gray-500">App configuration and data management</p>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Palette size={14} className="accent-text" /> Appearance
          </h3>
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-800/50 rounded-xl">
            <div className="flex items-center gap-2">
              {isDark ? <Moon size={14} className="text-gray-400" /> : <Sun size={14} className="text-yellow-400" />}
              <span className="text-sm text-gray-300">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <button onClick={toggleDark} className={`w-10 h-5.5 rounded-full transition-all relative ${isDark ? 'accent-bg' : 'bg-gray-600'}`}
              style={{ height: '22px' }}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isDark ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Accent Palette</p>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(PALETTES).map(([name, p]) => (
                <button key={name} onClick={() => setPalette(name)}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-all border ${currentPalette === name ? 'border-[rgb(var(--accent))]/50 bg-gray-800 text-gray-100' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.hex }} />
                  <span className="truncate text-[10px]">{name}</span>
                  {currentPalette === name && <Check size={10} className="shrink-0 accent-text ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Mode */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
            <Shield size={14} className="accent-text" /> Admin Mode
          </h3>
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
            <div>
              <p className="text-sm text-gray-300">Enable Admin Mode</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Unlock note editing, creation, and deletion</p>
            </div>
            <button onClick={toggleAdminMode} className={`w-10 rounded-full transition-all relative ${isAdminMode ? 'accent-bg' : 'bg-gray-600'}`}
              style={{ height: '22px' }}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isAdminMode ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Telegram Import */}
        <ImportSection />

        {/* Supabase info */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
            <Database size={14} className="accent-text" /> Supabase Connection
          </h3>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex items-center justify-between p-2.5 bg-gray-800/50 rounded-lg">
              <span>VITE_SUPABASE_URL</span>
              <span className="text-gray-600 font-mono text-[10px]">{import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '⚠️ Not set'}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-gray-800/50 rounded-lg">
              <span>VITE_SUPABASE_ANON_KEY</span>
              <span className="text-gray-600 font-mono text-[10px]">{import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '⚠️ Not set'}</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mt-3">Add these to your .env file to enable cloud sync</p>
        </div>

        {/* Danger Zone — only in admin mode */}
        {isAdminMode && <DangerZone />}
      </div>
    </div>
  );
}
