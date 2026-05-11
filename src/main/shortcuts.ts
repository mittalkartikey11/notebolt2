import { globalShortcut, BrowserWindow } from 'electron';

export function registerGlobalShortcuts(window: BrowserWindow) {
  // Toggle overlay visibility
  globalShortcut.register('CommandOrControl+H', () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      window.show();
      window.focus();
    }
  });

  // Capture screenshot
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    window.webContents.send('screenshot:trigger');
  });

  // Generate AI answer
  globalShortcut.register('CommandOrControl+Enter', () => {
    window.webContents.send('ai:generate');
  });

  // Toggle microphone
  globalShortcut.register('CommandOrControl+M', () => {
    window.webContents.send('audio:toggle-mic');
  });

  // Toggle system audio
  globalShortcut.register('CommandOrControl+Shift+A', () => {
    window.webContents.send('audio:toggle-system');
  });

  // Open chat panel
  globalShortcut.register('CommandOrControl+/', () => {
    window.webContents.send('chat:open');
  });
}

export function unregisterAllShortcuts() {
  globalShortcut.unregisterAll();
}
