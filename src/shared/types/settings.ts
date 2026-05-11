export interface UserSettings {
  id: string;
  user_id: string;
  default_llm_provider: string;
  default_llm_model: string;
  default_stt_provider: string;
  default_vision_provider: string;
  mic_enabled: boolean;
  system_audio_enabled: boolean;
  include_mic_in_context: boolean;
  include_system_audio_in_context: boolean;
  theme: string;
  hotkeys: HotkeyConfig;
  created_at: string;
  updated_at: string;
}

export interface HotkeyConfig {
  toggle_overlay: string;
  capture_screen: string;
  ask_ai: string;
  toggle_mic: string;
  toggle_system_audio: string;
  open_chat: string;
}

export interface ProviderConfig {
  id: string;
  user_id: string;
  provider_name: string;
  encrypted_api_key?: string;
  config: Record<string, any>;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_HOTKEYS: HotkeyConfig = {
  toggle_overlay: 'CommandOrControl+H',
  capture_screen: 'CommandOrControl+Shift+S',
  ask_ai: 'CommandOrControl+Enter',
  toggle_mic: 'CommandOrControl+M',
  toggle_system_audio: 'CommandOrControl+Shift+A',
  open_chat: 'CommandOrControl+/',
};

export const DEFAULT_SETTINGS: Partial<UserSettings> = {
  default_llm_provider: 'gemini',
  default_llm_model: 'gemini-1.5-flash',
  default_stt_provider: 'deepgram',
  default_vision_provider: 'gemini',
  mic_enabled: true,
  system_audio_enabled: false,
  include_mic_in_context: true,
  include_system_audio_in_context: false,
  theme: 'dark',
  hotkeys: DEFAULT_HOTKEYS,
};
