import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Session management
  createSession: (data: { title?: string; mode: string }) => 
    ipcRenderer.invoke('session:create', data),
  endSession: (sessionId: string) => 
    ipcRenderer.invoke('session:end', sessionId),
  getActiveSession: () => 
    ipcRenderer.invoke('session:getActive'),
  
  // Transcript management
  saveTranscript: (data: any) => 
    ipcRenderer.invoke('transcript:save', data),
  
  // AI answer generation
  generateAIAnswer: (data: { question: string; sessionId: string; context?: any }) => 
    ipcRenderer.invoke('ai:generate', data),
  
  // Audio controls
  getAudioDevices: () => 
    ipcRenderer.invoke('audio:getDevices'),
  startMic: (deviceId?: string) => 
    ipcRenderer.invoke('audio:startMic', deviceId),
  stopMic: () => 
    ipcRenderer.invoke('audio:stopMic'),
  startSystemAudio: () => 
    ipcRenderer.invoke('audio:startSystem'),
  stopSystemAudio: () => 
    ipcRenderer.invoke('audio:stopSystem'),
  getAudioState: () => 
    ipcRenderer.invoke('audio:getState'),
  
  // Screenshot controls
  captureScreenshot: (options?: { displayId?: number; region?: any }) => 
    ipcRenderer.invoke('screenshot:capture', options),
  analyzeScreenshot: (data: { screenshotId: string; imageBase64: string; prompt?: string; mode?: string }) => 
    ipcRenderer.invoke('screenshot:analyzeVision', data),
  
  // Secure store
  getSecureStore: (key: string) => 
    ipcRenderer.invoke('secure-store:get', key),
  setSecureStore: (key: string, value: string) => 
    ipcRenderer.invoke('secure-store:set', key, value),
  
  // Event listeners
  onSessionCreated: (callback: (session: any) => void) => {
    ipcRenderer.on('session:created', (_, session) => callback(session));
  },
  onSessionEnded: (callback: (data: any) => void) => {
    ipcRenderer.on('session:ended', (_, data) => callback(data));
  },
  onTranscriptUpdate: (callback: (data: any) => void) => {
    ipcRenderer.on('transcript:update', (_, data) => callback(data));
  },
  onAIResponse: (callback: (data: any) => void) => {
    ipcRenderer.on('ai:response', (_, data) => callback(data));
  },
  onScreenshotCaptured: (callback: (data: any) => void) => {
    ipcRenderer.on('screenshot:captured', (_, data) => callback(data));
  },
  onScreenshotAnalysisComplete: (callback: (data: any) => void) => {
    ipcRenderer.on('screenshot:analysis-complete', (_, data) => callback(data));
  },
  onMicStarted: (callback: (data: any) => void) => {
    ipcRenderer.on('audio:mic-started', (_, data) => callback(data));
  },
  onMicStopped: (callback: () => void) => {
    ipcRenderer.on('audio:mic-stopped', () => callback());
  },
  onSystemAudioStarted: (callback: () => void) => {
    ipcRenderer.on('audio:system-started', () => callback());
  },
  onSystemAudioStopped: (callback: () => void) => {
    ipcRenderer.on('audio:system-stopped', () => callback());
  },
  onScreenshotHotkeyPressed: (callback: () => void) => {
    ipcRenderer.on('screenshot:hotkey-pressed', () => callback());
  },
  
  // Remove listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});

// Type declarations for the exposed API
declare global {
  interface Window {
    electronAPI: {
      createSession: (data: { title?: string; mode: string }) => Promise<any>;
      endSession: (sessionId: string) => Promise<any>;
      getActiveSession: () => Promise<any>;
      saveTranscript: (data: any) => Promise<any>;
      generateAIAnswer: (data: { question: string; sessionId: string; context?: any }) => Promise<any>;
      getAudioDevices: () => Promise<any>;
      startMic: (deviceId?: string) => Promise<any>;
      stopMic: () => Promise<any>;
      startSystemAudio: () => Promise<any>;
      stopSystemAudio: () => Promise<any>;
      getAudioState: () => Promise<any>;
      captureScreenshot: (options?: { displayId?: number; region?: any }) => Promise<any>;
      analyzeScreenshot: (data: { screenshotId: string; imageBase64: string; prompt?: string; mode?: string }) => Promise<any>;
      getSecureStore: (key: string) => Promise<any>;
      setSecureStore: (key: string, value: string) => Promise<any>;
      onSessionCreated: (callback: (session: any) => void) => void;
      onSessionEnded: (callback: (data: any) => void) => void;
      onTranscriptUpdate: (callback: (data: any) => void) => void;
      onAIResponse: (callback: (data: any) => void) => void;
      onScreenshotCaptured: (callback: (data: any) => void) => void;
      onScreenshotAnalysisComplete: (callback: (data: any) => void) => void;
      onMicStarted: (callback: (data: any) => void) => void;
      onMicStopped: (callback: () => void) => void;
      onSystemAudioStarted: (callback: () => void) => void;
      onSystemAudioStopped: (callback: () => void) => void;
      onScreenshotHotkeyPressed: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}
