// Generated Supabase Database Types
// Run `npx supabase gen types typescript --project-id YOUR_PROJECT_ID` to update

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          plan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          plan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          plan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          mode: string;
          status: string;
          started_at: string;
          ended_at: string | null;
          summary: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          mode: string;
          status?: string;
          started_at?: string;
          ended_at?: string | null;
          summary?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string | null;
          mode?: string;
          status?: string;
          started_at?: string;
          ended_at?: string | null;
          summary?: string | null;
          metadata?: Json;
        };
      };
      transcripts: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          source: string;
          speaker_label: string | null;
          text: string;
          is_final: boolean;
          provider: string | null;
          confidence: number | null;
          timestamp_start: number | null;
          timestamp_end: number | null;
          created_at: string;
        };
      };
      ai_answers: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          question: string | null;
          answer: string;
          mode: string | null;
          provider: string | null;
          model: string | null;
          prompt_tokens: number | null;
          completion_tokens: number | null;
          latency_ms: number | null;
          context_used: Json | null;
          created_at: string;
        };
      };
      screenshots: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          storage_path: string;
          image_width: number | null;
          image_height: number | null;
          image_size_bytes: number | null;
          vision_provider: string | null;
          vision_model: string | null;
          prompt: string | null;
          analysis_result: string | null;
          metadata: Json | null;
          created_at: string;
        };
      };
      uploaded_documents: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_type: string | null;
          storage_path: string;
          file_size: number | null;
          status: string;
          metadata: Json | null;
          created_at: string;
        };
      };
      document_chunks: {
        Row: {
          id: string;
          user_id: string;
          document_id: string;
          chunk_index: number;
          content: string;
          token_count: number | null;
          embedding: string | null; // vector type
          metadata: Json | null;
          created_at: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          default_llm_provider: string | null;
          default_llm_model: string | null;
          default_stt_provider: string | null;
          default_vision_provider: string | null;
          mic_enabled: boolean;
          system_audio_enabled: boolean;
          include_mic_in_context: boolean;
          include_system_audio_in_context: boolean;
          theme: string | null;
          hotkeys: Json | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
    Views: {};
    Functions: {
      match_documents: {
        Args: {
          query_embedding: string;
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          content: string;
          similarity: number;
        }[];
      };
    };
    Enums: {};
  };
}
