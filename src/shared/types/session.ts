export type SessionMode = 'meeting' | 'coding' | 'interview' | 'general';
export type SessionStatus = 'active' | 'ended' | 'paused';

export interface Session {
  id: string;
  user_id: string;
  title: string;
  mode: SessionMode;
  status: SessionStatus;
  started_at: string;
  ended_at?: string;
  summary?: string;
  metadata: Record<string, any>;
}

export interface CreateSessionInput {
  title?: string;
  mode: SessionMode;
}

export interface UpdateSessionInput {
  title?: string;
  status?: SessionStatus;
  summary?: string;
  metadata?: Record<string, any>;
}
