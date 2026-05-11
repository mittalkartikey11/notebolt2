import React, { useState, useRef } from 'react';
import { Check, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LANG_COLORS = {
  javascript: '#f7df1e', js: '#f7df1e', typescript: '#3178c6', ts: '#3178c6',
  python: '#3572a5', java: '#b07219', cpp: '#f34b7d', c: '#555555',
  go: '#00add8', rust: '#dea584', sql: '#e38c00', html: '#e34c26',
  css: '#563d7c', bash: '#4eaa25', shell: '#4eaa25', json: '#292929',
};

export default function CodeBlock({ code, language = 'javascript' }) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const langColor = LANG_COLORS[language?.toLowerCase()] || '#9ca3af';

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 rounded-xl overflow-hidden border border-gray-700/50 bg-[#0d1117]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900/80 border-b border-gray-700/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="text-[10px] font-mono font-semibold" style={{ color: langColor }}>
            {language?.toUpperCase() || 'CODE'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-gray-500 hover:text-gray-300 transition-colors">
            {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
          <button onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-all">
            {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      {!collapsed && (
        <div className="overflow-x-auto max-h-80">
          <SyntaxHighlighter
            language={language || 'javascript'}
            style={oneDark}
            customStyle={{ margin: 0, padding: '0.75rem 1rem', background: 'transparent', fontSize: '0.8125rem', lineHeight: '1.6' }}
            showLineNumbers={code.split('\n').length > 3}
            lineNumberStyle={{ color: '#4b5563', fontSize: '0.7rem', userSelect: 'none', paddingRight: '1rem' }}
            wrapLongLines={false}>
            {code}
          </SyntaxHighlighter>
        </div>
      )}
      {collapsed && (
        <div className="px-3 py-1.5 text-[10px] text-gray-500 italic">
          {code.split('\n').length} lines — click to expand
        </div>
      )}
    </div>
  );
}
