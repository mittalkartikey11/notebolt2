export type TranscriptSource = 'mic' | 'system' | 'manual' | 'screenshot_vision';

export interface Transcript {
  id: string;
  user_id: string;
  session_id: string;
  source: TranscriptSource;
  speaker_label?: string;
  text: string;
  is_final: boolean;
  provider?: string;
  confidence?: number;
  timestamp_start?: number;
  timestamp_end?: number;
  created_at: string;
}

export interface CreateTranscriptInput {
  session_id: string;
  source: TranscriptSource;
  text: string;
  speaker_label?: string;
  is_final?: boolean;
  provider?: string;
  confidence?: number;
  timestamp_start?: number;
  timestamp_end?: number;
}

export interface TranscriptEvent {
  text: string;
  isFinal: boolean;
  source: TranscriptSource;
  confidence?: number;
  timestamp: number;
}
