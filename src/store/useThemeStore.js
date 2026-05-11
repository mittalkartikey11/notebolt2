import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const PALETTES = {
  'Orange Ember':    { accent: '249 115 22',  hover: '234 88 12',  name: 'Orange Ember',  hex: '#F97316' },
  'Blue Ocean':      { accent: '59 130 246',  hover: '37 99 235',  name: 'Blue Ocean',    hex: '#3B82F6' },
  'Purple Neon':     { accent: '139 92 246',  hover: '126 34 206', name: 'Purple Neon',   hex: '#8B5CF6' },
  'Green Matrix':    { accent: '34 197 94',   hover: '22 163 74',  name: 'Green Matrix',  hex: '#22C55E' },
  'Red Ruby':        { accent: '239 68 68',   hover: '220 38 38',  name: 'Red Ruby',      hex: '#EF4444' },
  'Cyan Tech':       { accent: '6 182 212',   hover: '8 145 178',  name: 'Cyan Tech',     hex: '#06B6D4' },
  'Yellow Focus':    { accent: '234 179 8',   hover: '202 138 4',  name: 'Yellow Focus',  hex: '#EAB308' },
  'Monochrome Gray': { accent: '156 163 175', hover: '107 114 128',name: 'Monochrome Gray', hex: '#9CA3AF' },
};

const applyTheme = (palette, isDark) => {
  const root = document.documentElement;
  
  // Set data-theme attribute for CSS variable switching
  if (isDark) {
    root.setAttribute('data-theme', 'dark');
    root.classList.remove('light-mode');
  } else {
    root.setAttribute('data-theme', 'light');
    root.classList.add('light-mode');
  }
  
  // Set accent color CSS variables
  root.style.setProperty('--accent-rgb', palette.accent);
  root.style.setProperty('--accent-hover-rgb', palette.hover);
};

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: true,
      currentPalette: 'Orange Ember',
      palettes: PALETTES,

      toggleDark: () => {
        const s = get();
        const newDark = !s.isDark;
        applyTheme(PALETTES[s.currentPalette], newDark);
        set({ isDark: newDark });
      },

      setPalette: (name) => {
        const s = get();
        if (PALETTES[name]) {
          applyTheme(PALETTES[name], s.isDark);
          set({ currentPalette: name });
        }
      },

      init: () => {
        const s = get();
        applyTheme(PALETTES[s.currentPalette], s.isDark);
      },

      getAccentHex: () => {
        const s = get();
        return PALETTES[s.currentPalette]?.hex || '#F97316';
      },
      
      getAccentRgb: () => {
        const s = get();
        return PALETTES[s.currentPalette]?.accent || '249 115 22';
      },
    }),
    { name: 'theme-store-v3' }
  )
);

export default useThemeStore;
export { PALETTES };
