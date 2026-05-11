import { ipcMain, BrowserWindow } from 'electron';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const CreateSessionSchema = z.object({
  title: z.string().optional(),
  mode: z.enum(['meeting', 'coding', 'interview', 'general']),
});

export function setupIpcHandlers(window: BrowserWindow) {
  // Create a new session
  ipcMain.handle('session:create', async (_, data: { title?: string; mode: string }) => {
    try {
      const validated = CreateSessionSchema.parse(data);
      const sessionId = uuidv4();
      
      const session = {
        id: sessionId,
        user_id: 'current-user-id', // Replace with actual auth
        title: validated.title || `${validated.mode} session ${new Date().toLocaleTimeString()}`,
        mode: validated.mode,
        status: 'active' as const,
        started_at: new Date().toISOString(),
        metadata: {},
      };

      // In production: save to Supabase
      console.log('Session created:', session);
      
      window.webContents.send('session:created', session);
      return { success: true, session };
    } catch (error) {
      console.error('Error creating session:', error);
      return { success: false, error: 'Failed to create session' };
    }
  });

  // End current session
  ipcMain.handle('session:end', async (_, sessionId: string) => {
    try {
      // In production: update Supabase
      const endedAt = new Date().toISOString();
      console.log('Session ended:', sessionId, endedAt);
      
      window.webContents.send('session:ended', { sessionId, endedAt });
      return { success: true, endedAt };
    } catch (error) {
      return { success: false, error: 'Failed to end session' };
    }
  });

  // Get active session
  ipcMain.handle('session:getActive', async () => {
    // In production: fetch from Supabase
    return { success: true, session: null }; // Return null if no active session
  });

  // Save transcript
  ipcMain.handle('transcript:save', async (_, data: any) => {
    try {
      // In production: save to Supabase
      console.log('Saving transcript:', data);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to save transcript' };
    }
  });

  // Generate AI answer
  ipcMain.handle('ai:generate', async (_, data: { 
    question: string; 
    sessionId: string; 
    context?: any 
  }) => {
    try {
      // In production: call LLM provider
      console.log('Generating AI answer for:', data.question);
      
      // Mock response for now
      const mockAnswer = `This is a mock AI response to: "${data.question}". In production, this will call your configured LLM provider (Gemini, OpenAI, Claude, etc.) with the full context including recent transcripts, RAG documents, and screenshot analysis.`;
      
      window.webContents.send('ai:response', {
        question: data.question,
        answer: mockAnswer,
        timestamp: new Date().toISOString(),
      });
      
      return { success: true, answer: mockAnswer };
    } catch (error) {
      return { success: false, error: 'Failed to generate AI answer' };
    }
  });
}
