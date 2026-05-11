import { ipcMain, BrowserWindow, desktopCapturer } from 'electron';

interface AudioState {
  micEnabled: boolean;
  systemAudioEnabled: boolean;
  micDeviceId?: string;
}

const audioState: AudioState = {
  micEnabled: false,
  systemAudioEnabled: false,
};

export function setupAudioIpc(window: BrowserWindow) {
  // Get available audio devices
  ipcMain.handle('audio:getDevices', async () => {
    try {
      const sources = await desktopCapturer.getSources({ 
        types: ['screen'],
        fetchWindowTitles: true 
      });
      
      // In production: use node-microphone or similar to get actual audio devices
      const mockDevices = [
        { deviceId: 'default', label: 'Default Microphone' },
        { deviceId: 'comm', label: 'Communication Microphone' },
      ];
      
      return { success: true, devices: mockDevices };
    } catch (error) {
      return { success: false, error: 'Failed to get audio devices' };
    }
  });

  // Start microphone capture
  ipcMain.handle('audio:startMic', async (_, deviceId?: string) => {
    try {
      audioState.micEnabled = true;
      audioState.micDeviceId = deviceId;
      
      console.log('Microphone capture started:', deviceId || 'default');
      window.webContents.send('audio:mic-started', { deviceId });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to start microphone' };
    }
  });

  // Stop microphone capture
  ipcMain.handle('audio:stopMic', async () => {
    try {
      audioState.micEnabled = false;
      
      console.log('Microphone capture stopped');
      window.webContents.send('audio:mic-stopped');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to stop microphone' };
    }
  });

  // Start system audio capture (Windows WASAPI loopback)
  ipcMain.handle('audio:startSystem', async () => {
    try {
      audioState.systemAudioEnabled = true;
      
      console.log('System audio capture started');
      window.webContents.send('audio:system-started');
      
      // In production: spawn WASAPI loopback process
      // This would capture audio from all applications
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to start system audio' };
    }
  });

  // Stop system audio capture
  ipcMain.handle('audio:stopSystem', async () => {
    try {
      audioState.systemAudioEnabled = false;
      
      console.log('System audio capture stopped');
      window.webContents.send('audio:system-stopped');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to stop system audio' };
    }
  });

  // Toggle microphone
  ipcMain.on('audio:toggle-mic', () => {
    if (audioState.micEnabled) {
      ipcMain.emit('audio:stopMic');
    } else {
      ipcMain.invoke('audio:startMic');
    }
  });

  // Toggle system audio
  ipcMain.on('audio:toggle-system', () => {
    if (audioState.systemAudioEnabled) {
      ipcMain.emit('audio:stopSystem');
    } else {
      ipcMain.invoke('audio:startSystem');
    }
  });

  // Get audio state
  ipcMain.handle('audio:getState', async () => {
    return { success: true, state: audioState };
  });
}
