import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Monitor, MonitorOff, Settings, X, Minus, MessageSquare, Camera, Sparkles } from 'lucide-react';
import OverlayShell from './components/overlay/OverlayShell';

function App() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'ai' | 'chat'>('transcript');
  const [micEnabled, setMicEnabled] = useState(false);
  const [systemAudioEnabled, setSystemAudioEnabled] = useState(false);
  const [transcripts, setTranscripts] = useState<Array<{ id: string; text: string; source: string; isFinal: boolean }>>([]);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);

  // Setup Electron event listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.onSessionCreated((session) => {
        console.log('Session created:', session);
        setSessionActive(true);
      });

      window.electronAPI.onScreenshotCaptured((data) => {
        console.log('Screenshot captured:', data);
      });

      window.electronAPI.onAIResponse((data) => {
        console.log('AI Response:', data);
        setAiResponse(data.answer);
      });

      window.electronAPI.onMicStarted(() => setMicEnabled(true));
      window.electronAPI.onMicStopped(() => setMicEnabled(false));
      window.electronAPI.onSystemAudioStarted(() => setSystemAudioEnabled(true));
      window.electronAPI.onSystemAudioStopped(() => setSystemAudioEnabled(false));
    }

    return () => {
      if (typeof window !== 'undefined' && window.electronAPI) {
        window.electronAPI.removeAllListeners('session:created');
        window.electronAPI.removeAllListeners('screenshot:captured');
        window.electronAPI.removeAllListeners('ai:response');
      }
    };
  }, []);

  const handleStartSession = async (mode: 'meeting' | 'coding' | 'interview') => {
    if (window.electronAPI) {
      await window.electronAPI.createSession({ mode });
    }
  };

  const handleToggleMic = async () => {
    if (window.electronAPI) {
      if (micEnabled) {
        await window.electronAPI.stopMic();
      } else {
        await window.electronAPI.startMic();
      }
    }
  };

  const handleToggleSystemAudio = async () => {
    if (window.electronAPI) {
      if (systemAudioEnabled) {
        await window.electronAPI.stopSystemAudio();
      } else {
        await window.electronAPI.startSystemAudio();
      }
    }
  };

  const handleCaptureScreenshot = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.captureScreenshot();
      if (result.success) {
        // Analyze with vision AI
        await window.electronAPI.analyzeScreenshot({
          screenshotId: result.screenshot.id,
          imageBase64: result.screenshot.thumbnail,
          prompt: 'Analyze this screenshot for coding or meeting context.',
          mode: 'general',
        });
      }
    }
  };

  const handleGenerateAI = async () => {
    if (window.electronAPI && sessionActive) {
      await window.electronAPI.generateAIAnswer({
        question: 'What are the key points discussed so far?',
        sessionId: 'current-session-id',
      });
    }
  };

  // Mock transcript for demo
  useEffect(() => {
    const interval = setInterval(() => {
      if (micEnabled) {
        const mockTranscripts = [
          "Hey, can you help me understand this algorithm?",
          "I'm thinking of using a hash map here.",
          "What's the time complexity of this approach?",
        ];
        const randomText = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
        setTranscripts(prev => [...prev.slice(-20), {
          id: Date.now().toString(),
          text: randomText,
          source: 'mic',
          isFinal: true,
        }]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [micEnabled]);

  return (
    <div className="h-screen w-screen flex flex-col glass rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-slate-900/50" data-drag-region>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-white">Nexus Copilot</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleMic}
            className={`p-1.5 rounded-lg transition-colors ${
              micEnabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400 hover:text-white'
            }`}
            title={micEnabled ? 'Microphone On' : 'Microphone Off'}
          >
            {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleToggleSystemAudio}
            className={`p-1.5 rounded-lg transition-colors ${
              systemAudioEnabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400 hover:text-white'
            }`}
            title={systemAudioEnabled ? 'System Audio On' : 'System Audio Off'}
          >
            {systemAudioEnabled ? <Monitor className="w-4 h-4" /> : <MonitorOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleCaptureScreenshot}
            className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
            title="Capture Screenshot (Ctrl+Shift+S)"
          >
            <Camera className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleGenerateAI}
            className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors"
            title="Generate AI Answer (Ctrl+Enter)"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          
          <div className="w-px h-4 bg-slate-700 mx-1" />
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <button className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          
          <button className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 hover:text-red-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Tab Bar */}
            <div className="flex border-b border-white/10 bg-slate-900/30">
              <button
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === 'transcript'
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Transcript
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === 'ai'
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                AI Assistant
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === 'chat'
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Chat
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-3">
              {activeTab === 'transcript' && (
                <div className="space-y-2">
                  {!sessionActive ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400 text-sm mb-4">No active session</p>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleStartSession('meeting')}
                          className="px-3 py-1.5 text-xs bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        >
                          Start Meeting
                        </button>
                        <button
                          onClick={() => handleStartSession('coding')}
                          className="px-3 py-1.5 text-xs bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                        >
                          Start Coding
                        </button>
                        <button
                          onClick={() => handleStartSession('interview')}
                          className="px-3 py-1.5 text-xs bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                        >
                          Start Interview
                        </button>
                      </div>
                    </div>
                  ) : (
                    transcripts.map((t) => (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-2 rounded-lg text-sm ${
                          t.source === 'mic' ? 'bg-slate-800/50' : 'bg-slate-700/30'
                        }`}
                      >
                        <span className="text-xs text-slate-500 mr-2">
                          {t.source === 'mic' ? '🎤' : '🖥️'}
                        </span>
                        <span className="text-slate-200">{t.text}</span>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-3">
                  {aiResponse ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">AI Assistant</span>
                      </div>
                      <p className="text-sm text-slate-200 whitespace-pre-wrap">{aiResponse}</p>
                    </motion.div>
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">
                        Press Ctrl+Enter to generate an AI answer from the current context
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="space-y-3">
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">
                      Chat panel coming soon - ask follow-up questions and get contextual answers
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <div className="px-3 py-1.5 border-t border-white/10 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{sessionActive ? 'Session Active' : 'No Session'}</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
