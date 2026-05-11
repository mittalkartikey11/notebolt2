import { BrowserWindow, screen } from 'electron';

export function createOverlayWindow(isDev: boolean): BrowserWindow {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  const window = new BrowserWindow({
    width: 450,
    height: 700,
    x: width - 500,
    y: 100,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    movable: true,
    minimizable: true,
    maximizable: false,
    skipTaskbar: false,
    show: true,
    webPreferences: {
      preload: isDev 
        ? undefined // Vite handles preload in dev
        : undefined, // Will be set by vite-plugin-electron
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  });

  window.setAlwaysOnTop(true, 'screen-saver');
  window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  return window;
}
