import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { createOverlayWindow } from './window.js';
import { registerGlobalShortcuts } from './shortcuts.js';
import { setupIpcHandlers } from './ipc/session.ipc.js';
import { setupAudioIpc } from './ipc/audio.ipc.js';
import { setupScreenshotIpc } from './ipc/screenshot.ipc.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let overlayWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  overlayWindow = createOverlayWindow(isDev);
  
  if (isDev) {
    overlayWindow.loadURL('http://localhost:5173');
    overlayWindow.webContents.openDevTools();
  } else {
    overlayWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
  
  // Setup IPC handlers
  setupIpcHandlers(overlayWindow);
  setupAudioIpc(overlayWindow);
  setupScreenshotIpc(overlayWindow);
  
  // Register global shortcuts
  registerGlobalShortcuts(overlayWindow);
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle secure store operations
ipcMain.handle('secure-store:get', async (_, key: string) => {
  // In production, use electron-store with encryption
  return process.env[key] || null;
});

ipcMain.handle('secure-store:set', async (_, key: string, value: string) => {
  // In production, use encrypted storage
  console.log(`Setting secure store key: ${key}`);
  return true;
});
