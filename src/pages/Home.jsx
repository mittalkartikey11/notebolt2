import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Star, CheckCircle, Clock, FolderOpen, Flame,
  TrendingUp, ArrowUpRight, Play, ChevronRight, Calendar,
  Activity, BookOpen, Zap
} from 'lucide-react';
import { format, subDays, isToday, isYesterday } from 'date-fns';
import useAppStore from '../store/useAppStore';
import useThemeStore from '../store/useThemeStore';

function StatCard({ icon: Icon, label, value, sub, color, accentColor }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col gap-3 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: accentColor + '22' }}>
          <Icon size={18} style={{ color: accentColor }} />
        </div>
        {sub && (
          <span className="flex items-center gap-0.5 text-[10px] text-green-400 font-medium">
            <ArrowUpRight size={10} />
            {sub}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-100">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

function CircularProgress({ percentage, size = 120, stroke = 10, color = '#ea580c' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percentage / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
    </svg>
  );
}

function ProgressBar({ value, color = 'rgb(var(--accent))' }) {
  return (
    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
      <div className="h-full rounded-full progress-bar-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

const RECENT_ACTIVITY = [
  { icon: CheckCircle, label: 'Arrays topic completed', sub: 'In DSA Sheets', time: '2m ago', color: '#22c55e' },
  { icon: FileText, label: 'New note added in Binary Search', sub: 'DSA Sheets', time: '10m ago', color: '#3b82f6' },
  { icon: TrendingUp, label: 'System Design roadmap updated', sub: 'System Design', time: '1h ago', color: '#a855f7' },
  { icon: Star, label: 'Note starred in OS Sheet', sub: 'Core CS Subjects', time: '2h ago', color: '#f59e0b' },
  { icon: FileText, label: 'Database notes imported', sub: 'Database', time: '3h ago', color: '#6366f1' },
];

const STREAK_DAYS = [
  { day: 'M', active: true }, { day: 'T', active: true }, { day: 'W', active: true },
  { day: 'T', active: true }, { day: 'F', active: true }, { day: 'S', active: false },
  { day: 'S', active: false },
];

const CONTINUE_LEARNING = [
  { title: 'Dynamic Programming', cat: 'DSA Sheets', progress: 69, color: '#ea580c' },
  { title: 'Database Normalization', cat: 'Database', progress: 40, color: '#6366f1' },
  { title: 'Low Level Design', cat: 'System Design', progress: 30, color: '#22c55e' },
];

const POPULAR_TAGS = [
  { name: 'Array', count: 128, color: '#ea580c' }, { name: 'DP', count: 98, color: '#3b82f6' },
  { name: 'BinarySearch', count: 76, color: '#a855f7' }, { name: 'SQL', count: 64, color: '#22c55e' },
  { name: 'OOPs', count: 58, color: '#f59e0b' }, { name: 'SystemDesign', count: 52, color: '#ec4899' },
  { name: 'JavaScript', count: 48, color: '#eab308' }, { name: 'DBMS', count: 42, color: '#6366f1' },
  { name: 'Graph', count: 35, color: '#8b5cf6' }, { name: 'Trees', count: 30, color: '#06b6d4' },
  { name: 'React', count: 28, color: '#61dafb' }, { name: 'Aptitude', count: 22, color: '#f97316' },
];

const CAT_PROGRESS = [
  { name: 'DSA Sheets', progress: 75, color: '#ea580c', icon: '⚡' },
  { name: 'Core CS Subjects', progress: 62, color: '#3b82f6', icon: '🎓' },
  { name: 'System Design', progress: 58, color: '#22c55e', icon: '🏗️' },
  { name: 'Interview Experience', progress: 70, color: '#a855f7', icon: '💼' },
  { name: 'Web Development', progress: 45, color: '#f59e0b', icon: '🌐' },
];

const RECENT_NOTES = [
  { title: 'Two Sum Problem', tag: '#Array', cat: 'DSA Sheets', date: '20 May, 01:20 PM', starred: true },
  { title: 'SQL Joins Explained', tag: '#SQL', cat: 'Core CS Subjects', date: '18 May, 10:15 AM', starred: true },
  { title: 'Operating System Interrupts', tag: '#OS', cat: 'Core CS Subjects', date: '19 May, 09:45 AM', starred: true },
  { title: 'React useState Hook', tag: '#React', cat: 'Web Development', date: '18 May, 08:30 PM', starred: true },
  { title: 'System Design Interview Roadmap', tag: '#Roadmap', cat: 'System Design', date: '18 May, 06:00 PM', starred: true },
];

function MiniCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-200">Calendar</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{format(today, 'MMMM yyyy')}</span>
          <button className="text-[10px] accent-text hover:underline">View Calendar</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {['MON','TUE','WED','THU','FRI','SAT','SUN'].map(d => (
          <div key={d} className="text-center text-[9px] text-gray-600 font-semibold py-0.5">{d}</div>
        ))}
        {days.map((d, i) => (
          <div key={i} className={`text-center text-[11px] py-1 rounded-md transition-colors
            ${d === today.getDate() ? 'accent-bg text-white font-bold' : d ? 'text-gray-400 hover:bg-gray-800 cursor-pointer' : ''}`}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { categories, topics, notes, getStats } = useAppStore();
  const { getAccentHex } = useThemeStore();
  const stats = getStats();
  const accentHex = getAccentHex();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const overallProgress = 68;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-950">
      <div className="max-w-[1400px] mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-100">{greeting}, Aditya! 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Let's continue your learning journey today.</p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left + Center columns */}
          <div className="col-span-8 space-y-4">
            {/* Stat cards */}
            <div className="grid grid-cols-5 gap-3">
              <StatCard icon={FileText} label="Total Notes" value={stats.total || 1248} sub="↑ 12 this week" accentColor="#ea580c" />
              <StatCard icon={Star} label="Starred Notes" value={stats.starred || 86} sub="↑ 5 this week" accentColor="#f59e0b" />
              <StatCard icon={CheckCircle} label="Completed" value={stats.completed || 389} sub="↑ 18 this week" accentColor="#22c55e" />
              <StatCard icon={Clock} label="In Progress" value={stats.inProgress || 24} sub="↑ 7 this week" accentColor="#a855f7" />
              <StatCard icon={FolderOpen} label="Categories" value={stats.categories || 10} accentColor="#3b82f6" />
            </div>

            {/* Overall progress + Category progress */}
            <div className="grid grid-cols-2 gap-4">
              {/* Overall Progress */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-200 mb-4">Overall Progress</h3>
                <div className="flex items-center gap-6">
                  <div className="relative shrink-0">
                    <CircularProgress percentage={overallProgress} size={110} stroke={9} color={accentHex} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-gray-100">{overallProgress}%</span>
                      <span className="text-[9px] text-gray-500">Overall</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    {[
                      { label: 'Completed', value: 389, pct: 68, color: '#22c55e' },
                      { label: 'In Progress', value: 176, pct: 31, color: accentHex },
                      { label: 'Not Started', value: 63, pct: 11, color: '#4b5563' },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="flex items-center gap-1.5 text-gray-400">
                            <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                            {item.label}
                          </span>
                          <span className="text-gray-300">{item.value} ({item.pct}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full mt-4 py-2 text-xs text-gray-500 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors">
                  View Detailed Progress
                </button>
              </div>

              {/* Progress by Category */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-200">Progress by Category</h3>
                  <button className="text-[10px] accent-text hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {CAT_PROGRESS.map(cat => (
                    <div key={cat.name}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{cat.icon}</span>
                        <span className="flex-1 text-xs text-gray-300 truncate">{cat.name}</span>
                        <span className="text-xs font-semibold text-gray-400">{cat.progress}%</span>
                      </div>
                      <ProgressBar value={cat.progress} color={cat.color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Continue Learning */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-200">Continue Learning</h3>
                <button className="text-[10px] accent-text hover:underline">View All In Progress →</button>
              </div>
              <div className="space-y-2">
                {CONTINUE_LEARNING.map(item => (
                  <div key={item.title} className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.color + '22' }}>
                      <BookOpen size={14} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-200 truncate">{item.title}</p>
                      <p className="text-[10px] text-gray-500">{item.cat}</p>
                      <div className="mt-1.5">
                        <ProgressBar value={item.progress} color={item.color} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-gray-400">{item.progress}%</span>
                      <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: item.color }}>
                        <Play size={10} className="text-white ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-200">Popular Tags</h3>
                <button className="text-[10px] accent-text hover:underline">View All</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map(tag => (
                  <span key={tag.name}
                    className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-medium cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ background: tag.color + '18', color: tag.color, border: `1px solid ${tag.color}33` }}>
                    #{tag.name}
                    <span className="text-[10px] opacity-70">{tag.count}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Recently Opened Notes */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-200">Recently Opened Notes</h3>
                <button className="text-[10px] accent-text hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {RECENT_NOTES.map(n => (
                  <div key={n.title} className="bg-gray-800/50 border border-gray-700/30 rounded-xl p-3 hover:border-gray-600 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-6 h-6 rounded-lg accent-bg flex items-center justify-center">
                        <FileText size={10} className="text-white" />
                      </div>
                      <Star size={11} className="text-yellow-400" fill="currentColor" />
                    </div>
                    <p className="text-[11px] font-semibold text-gray-200 leading-tight mb-1 line-clamp-2">{n.title}</p>
                    <span className="text-[9px] accent-text">{n.tag}</span>
                    <p className="text-[9px] text-gray-600 mt-1 truncate">{n.cat}</p>
                    <p className="text-[9px] text-gray-600 mt-0.5">{n.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-4 space-y-4">
            {/* Learning Streak */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={16} className="text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-200">Learning Streak</h3>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-gray-100">16</span>
                <span className="text-sm text-gray-500 font-medium">+</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Days</p>
              <div className="grid grid-cols-7 gap-1 mb-3">
                {STREAK_DAYS.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-semibold ${d.active ? 'accent-bg text-white shadow-md' : 'bg-gray-800 text-gray-600'}`}>
                      {d.active ? '●' : ''}
                    </div>
                    <span className="text-[9px] text-gray-600">{d.day}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 italic border-t border-gray-800 pt-3">
                "Consistency is what transforms average into excellence."
              </p>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-200">Recent Activity</h3>
                <button className="text-[10px] accent-text hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: a.color + '22' }}>
                      <a.icon size={11} style={{ color: a.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-gray-300 leading-tight">{a.label}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{a.sub}</p>
                    </div>
                    <span className="text-[9px] text-gray-600 shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Calendar */}
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}
