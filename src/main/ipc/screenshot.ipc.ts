import { ipcMain, BrowserWindow, desktopCapturer, screen } from 'electron';
import { v4 as uuidv4 } from 'uuid';

export function setupScreenshotIpc(window: BrowserWindow) {
  // Capture screenshot
  ipcMain.handle('screenshot:capture', async (_, options?: { 
    displayId?: number; 
    region?: { x: number; y: number; width: number; height: number } 
  }) => {
    try {
      const sources = await desktopCapturer.getSources({ 
        types: ['screen'],
        fetchWindowTitles: true 
      });

      if (sources.length === 0) {
        return { success: false, error: 'No screens available' };
      }

      // Get primary display or specified display
      const displays = screen.getAllDisplays();
      const targetDisplay = options?.displayId !== undefined 
        ? displays[options.displayId] 
        : screen.getPrimaryDisplay();

      const source = sources.find(s => s.display_id === targetDisplay.id.toString()) || sources[0];
      
      // In production: capture actual screen buffer
      // For now, return metadata only
      const screenshotId = uuidv4();
      const timestamp = new Date().toISOString();
      
      console.log('Screenshot captured:', {
        id: screenshotId,
        source: source.name,
        size: source.thumbnail.toDataURL().length,
      });

      window.webContents.send('screenshot:captured', {
        id: screenshotId,
        thumbnail: source.thumbnail.toDataURL(),
        timestamp,
        source: source.name,
      });

      return { 
        success: true, 
        screenshot: {
          id: screenshotId,
          thumbnail: source.thumbnail.toDataURL(),
          timestamp,
        } 
      };
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      return { success: false, error: 'Failed to capture screenshot' };
    }
  });

  // Analyze screenshot with vision AI
  ipcMain.handle('screenshot:analyzeVision', async (_, data: {
    screenshotId: string;
    imageBase64: string;
    prompt?: string;
    mode?: string;
  }) => {
    try {
      console.log('Analyzing screenshot with vision AI:', data.screenshotId);
      
      // In production: send to configured vision provider (Gemini, OpenAI, Claude)
      const mockAnalysis = `Vision Analysis Result:\n\nBased on the screenshot, I can see this appears to be a ${data.mode || 'general'} context. The image contains visual elements that would be analyzed by a multimodal AI model.\n\nIn production, this would:\n1. Send the image to Gemini Vision/OpenAI Vision/Claude Vision\n2. Receive detailed analysis of diagrams, code, UI layouts, charts\n3. Return structured insights about the visual content\n\nPrompt used: "${data.prompt || 'Analyze this screenshot for relevant context.'}"`;

      window.webContents.send('screenshot:analysis-complete', {
        screenshotId: data.screenshotId,
        analysis: mockAnalysis,
        timestamp: new Date().toISOString(),
      });

      return { 
        success: true, 
        analysis: mockAnalysis 
      };
    } catch (error) {
      return { success: false, error: 'Failed to analyze screenshot' };
    }
  });

  // Trigger screenshot via hotkey
  ipcMain.on('screenshot:trigger', () => {
    console.log('Screenshot triggered by hotkey');
    window.webContents.send('screenshot:hotkey-pressed');
  });
}
