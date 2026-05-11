import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const PALETTES = {
  'Orange Ember':    { accent: '234 88 12',   hover: '194 65 12',  name: 'Orange Ember',  hex: '#ea580c' },
  'Blue Ocean':      { accent: '59 130 246',  hover: '37 99 235',  name: 'Blue Ocean',    hex: '#3b82f6' },
  'Purple Neon':     { accent: '168 85 247',  hover: '147 51 234', name: 'Purple Neon',   hex: '#a855f7' },
  'Green Matrix':    { accent: '34 197 94',   hover: '22 163 74',  name: 'Green Matrix',  hex: '#22c55e' },
  'Red Ruby':        { accent: '239 68 68',   hover: '220 38 38',  name: 'Red Ruby',      hex: '#ef4444' },
  'Cyan Tech':       { accent: '6 182 212',   hover: '8 145 178',  name: 'Cyan Tech',     hex: '#06b6d4' },
  'Yellow Focus':    { accent: '234 179 8',   hover: '202 138 4',  name: 'Yellow Focus',  hex: '#eab308' },
  'Monochrome Gray': { accent: '156 163 175', hover: '107 114 128',name: 'Monochrome Gray', hex: '#9ca3af' },
};

const applyTheme = (palette, isDark) => {
  const root = document.documentElement;
  root.style.setProperty('--accent', palette.accent);
  root.style.setProperty('--accent-hover', palette.hover);
  root.style.setProperty('--accent-subtle', palette.accent + ' / 0.12');
  root.style.setProperty('--accent-border', palette.accent + ' / 0.3');
  if (isDark) {
    document.documentElement.classList.remove('light-mode');
  } else {
    document.documentElement.classList.add('light-mode');
  }
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
        return PALETTES[s.currentPalette]?.hex || '#ea580c';
      },
    }),
    { name: 'theme-store-v2' }
  )
);

export default useThemeStore;
export { PALETTES };
