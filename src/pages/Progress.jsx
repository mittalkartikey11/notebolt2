import React from 'react';
import { BarChart2, TrendingUp, CheckCircle, Clock, Target } from 'lucide-react';
import useAppStore from '../store/useAppStore';

function ProgressBar({ value, color = '#ea580c', label, sub }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-gray-500">{sub} · <span style={{ color }}>{value}%</span></span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full progress-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

const CAT_STATS = [
  { name: 'DSA Sheets', icon: '⚡', color: '#ea580c', progress: 75, total: 389, done: 292, topics: 13 },
  { name: 'Core CS Subjects', icon: '🎓', color: '#3b82f6', progress: 62, total: 284, done: 176, topics: 4 },
  { name: 'System Design', icon: '🏗️', color: '#22c55e', progress: 58, total: 156, done: 90, topics: 3 },
  { name: 'Interview Experience', icon: '💼', color: '#a855f7', progress: 70, total: 112, done: 78, topics: 2 },
  { name: 'Web Development', icon: '🌐', color: '#f59e0b', progress: 45, total: 98, done: 44, topics: 2 },
  { name: 'Aptitude', icon: '🧮', color: '#ec4899', progress: 30, total: 76, done: 23, topics: 1 },
  { name: 'DevOps', icon: '⚙️', color: '#8b5cf6', progress: 55, total: 64, done: 35, topics: 2 },
  { name: 'Database', icon: '🗄️', color: '#6366f1', progress: 40, total: 52, done: 21, topics: 2 },
  { name: 'Others', icon: '📦', color: '#6b7280', progress: 20, total: 41, done: 8, topics: 1 },
];

const WEEKLY_DATA = [
  { day: 'Mon', notes: 12 }, { day: 'Tue', notes: 19 }, { day: 'Wed', notes: 8 },
  { day: 'Thu', notes: 24 }, { day: 'Fri', notes: 16 }, { day: 'Sat', notes: 5 }, { day: 'Sun', notes: 3 },
];
const maxNotes = Math.max(...WEEKLY_DATA.map(d => d.notes));

export default function Progress() {
  const { getStats } = useAppStore();
  const stats = getStats();

  return (
    <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={18} className="accent-text" />
          <div>
            <h1 className="text-lg font-bold text-gray-100">Progress Tracker</h1>
            <p className="text-xs text-gray-500">Your learning analytics and completion status</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Overall Progress', value: '68%', icon: Target, color: '#ea580c' },
            { label: 'Topics Completed', value: '23/56', icon: CheckCircle, color: '#22c55e' },
            { label: 'Notes Reviewed', value: `${stats.completed || 389}`, icon: TrendingUp, color: '#3b82f6' },
            { label: 'Active Streak', value: '16 days', icon: Clock, color: '#f59e0b' },
          ].map(card => (
            <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: card.color + '22' }}>
                  <card.icon size={15} style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-100">{card.value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Category progress */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-200 mb-4">Progress by Category</h3>
            {CAT_STATS.map(cat => (
              <ProgressBar key={cat.name} label={`${cat.icon} ${cat.name}`} value={cat.progress} color={cat.color}
                sub={`${cat.done}/${cat.total} notes`} />
            ))}
          </div>

          {/* Weekly chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-200 mb-4">Weekly Learning Activity</h3>
            <div className="flex items-end justify-between gap-2 h-40 mb-3">
              {WEEKLY_DATA.map(d => (
                <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] text-gray-500">{d.notes}</span>
                  <div className="w-full rounded-t-lg transition-all accent-bg opacity-80 hover:opacity-100"
                    style={{ height: `${(d.notes / maxNotes) * 100}%`, minHeight: 4 }} />
                  <span className="text-[10px] text-gray-500">{d.day}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 border-t border-gray-800 pt-3">
              87 notes added this week · <span className="accent-text">+23% from last week</span>
            </p>

            {/* Difficulty breakdown */}
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-gray-300 mb-3">Difficulty Breakdown</h4>
              {[
                { label: 'Easy', pct: 45, color: '#22c55e' },
                { label: 'Medium', pct: 38, color: '#f59e0b' },
                { label: 'Hard', pct: 17, color: '#ef4444' },
              ].map(d => (
                <div key={d.label} className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] text-gray-400 w-14">{d.label}</span>
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: d.color }} />
                  </div>
                  <span className="text-[10px] text-gray-500 w-8 text-right">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
