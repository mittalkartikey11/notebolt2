// STT Provider Types
export type STTProviderName = 'deepgram' | 'soniox' | 'groq-whisper' | 'local-whisper';

export interface STTProviderConfig {
  provider: STTProviderName;
  apiKey?: string;
  model?: string;
  language?: string;
  sampleRate?: number;
}

export interface STTProvider {
  connect(config: STTProviderConfig): Promise<void>;
  sendAudioChunk(chunk: Buffer): void;
  onPartialTranscript(callback: (text: string) => void): void;
  onFinalTranscript(callback: (text: string) => void): void;
  disconnect(): Promise<void>;
}

// LLM Provider Types
export type LLMProviderName = 'gemini' | 'openai' | 'claude' | 'groq' | 'openrouter';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface LLMResponse {
  text: string;
  usage?: LLMUsage;
  model?: string;
  latency_ms?: number;
}

export interface LLMProviderConfig {
  provider: LLMProviderName;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMProvider {
  generateResponse(messages: LLMMessage[], options: LLMProviderConfig): Promise<LLMResponse>;
  streamResponse(
    messages: LLMMessage[], 
    options: LLMProviderConfig, 
    onToken: (token: string) => void
  ): Promise<void>;
  validateApiKey(apiKey: string): Promise<boolean>;
}

// Vision Provider Types
export type VisionProviderName = 'gemini' | 'openai' | 'claude' | 'openrouter';

export interface VisionInput {
  imageBuffer?: Buffer;
  imageBase64?: string;
  imageUrl?: string;
  prompt: string;
  sessionContext?: string;
  ragContext?: string;
  mode?: string;
}

export interface VisionAnalysisResult {
  text: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface VisionProviderConfig {
  provider: VisionProviderName;
  apiKey?: string;
  model?: string;
}

export interface VisionProvider {
  analyzeImage(input: VisionInput, config: VisionProviderConfig): Promise<VisionAnalysisResult>;
}
