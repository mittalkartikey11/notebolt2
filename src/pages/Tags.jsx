import React from 'react';
import { Tag } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const ALL_TAGS = [
  { id: 't1', name: 'Array', color: '#ea580c', count: 128 },
  { id: 't2', name: 'DP', color: '#3b82f6', count: 98 },
  { id: 't3', name: 'BinarySearch', color: '#a855f7', count: 76 },
  { id: 't4', name: 'SQL', color: '#22c55e', count: 64 },
  { id: 't5', name: 'OOPs', color: '#f59e0b', count: 58 },
  { id: 't6', name: 'SystemDesign', color: '#ec4899', count: 52 },
  { id: 't7', name: 'JavaScript', color: '#eab308', count: 48 },
  { id: 't8', name: 'DBMS', color: '#6366f1', count: 42 },
  { id: 't9', name: 'Graph', color: '#8b5cf6', count: 35 },
  { id: 't10', name: 'Trees', color: '#06b6d4', count: 30 },
  { id: 't11', name: 'React', color: '#61dafb', count: 28 },
  { id: 't12', name: 'Aptitude', color: '#f97316', count: 22 },
  { id: 't13', name: 'Leetcode', color: '#22c55e', count: 120 },
  { id: 't14', name: 'Important', color: '#ef4444', count: 45 },
  { id: 't15', name: 'Basic', color: '#ea580c', count: 80 },
  { id: 't16', name: 'Traversal', color: '#3b82f6', count: 32 },
];

export default function Tags() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Tag size={18} className="accent-text" />
          <div>
            <h1 className="text-lg font-bold text-gray-100">Tags</h1>
            <p className="text-xs text-gray-500">{ALL_TAGS.length} tags</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {ALL_TAGS.sort((a, b) => b.count - a.count).map(tag => (
            <div key={tag.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: tag.color + '22' }}>
                  <Tag size={14} style={{ color: tag.color }} />
                </div>
                <span className="text-xs font-semibold text-gray-200 truncate">#{tag.name}</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full" style={{ width: `${Math.min((tag.count / 128) * 100, 100)}%`, background: tag.color }} />
              </div>
              <p className="text-[10px] text-gray-500">{tag.count} notes</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
