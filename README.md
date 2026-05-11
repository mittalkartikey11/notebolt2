# Nexus Copilot

A production-grade desktop AI copilot application for meetings, coding practice, mock interviews, technical preparation, live contextual assistance, and screen-based AI analysis.

## Features

- **Live Audio Transcription**: Capture microphone and system audio with real-time speech-to-text
- **AI-Powered Assistance**: Get contextual AI answers from Gemini, OpenAI, Claude, Groq, or OpenRouter
- **Screenshot Vision Analysis**: Direct multimodal AI analysis of screenshots (no OCR)
- **RAG Document Support**: Upload personal documents for personalized AI context
- **Session Management**: Organize by meeting, coding, interview, or general modes
- **Cross-Platform**: Built with Electron.js for Windows, macOS, and Linux

## Tech Stack

### Desktop
- Electron.js + TypeScript
- React 19 + Vite
- TailwindCSS + Framer Motion
- Zustand for state management

### Backend
- Supabase (Auth, PostgreSQL, Storage, Realtime)
- pgvector for RAG embeddings

### AI Providers
- **LLM**: Gemini, OpenAI, Claude, Groq, OpenRouter
- **STT**: Deepgram, Soniox, Groq Whisper
- **Vision**: Gemini Vision, OpenAI Vision, Claude Vision

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account (free tier works)
- API keys for your chosen AI providers

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd nexus-copilot
```

2. Install dependencies
```bash
npm install
```

3. Copy environment file and configure
```bash
cp .env.example .env
# Edit .env with your Supabase URL and API keys
```

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run dist
```

## Project Structure

```
src/
├── main/              # Electron main process
│   ├── ipc/           # IPC handlers
│   ├── audio/         # Audio capture modules
│   ├── screenshot/    # Screenshot capture
│   └── security/      # Secure storage
├── preload/           # Electron preload script
├── renderer/          # React frontend
│   ├── components/    # UI components
│   ├── pages/         # Page components
│   ├── store/         # Zustand stores
│   └── hooks/         # Custom hooks
├── services/          # Service layer
│   ├── supabase/      # Supabase client
│   ├── stt/           # Speech-to-text providers
│   ├── llm/           # LLM providers
│   ├── vision/        # Vision providers
│   └── rag/           # RAG pipeline
└── shared/            # Shared types and utilities
```

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql`
3. Enable Row Level Security (RLS)
4. Copy your project URL and anon key to `.env`

### AI Provider Setup

Configure your preferred AI providers in the Settings panel:
- Gemini API Key (Google AI Studio)
- OpenAI API Key
- Anthropic API Key
- Groq API Key

## Usage

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+H | Toggle overlay visibility |
| Ctrl+Shift+S | Capture screenshot |
| Ctrl+Enter | Generate AI answer |
| Ctrl+M | Toggle microphone |
| Ctrl+Shift+A | Toggle system audio |
| Ctrl+/ | Open chat panel |

### Modes

- **Meeting Mode**: Transcribe meetings, extract action items, generate summaries
- **Coding Mode**: Analyze code screenshots, get algorithm hints, debug assistance
- **Interview Mode**: Mock interview practice with real-time feedback
- **General Mode**: General-purpose AI assistant

## Security & Privacy

- All API keys stored encrypted locally
- Supabase Row Level Security enforced
- No raw audio stored by default
- User-controlled capture with visible indicators
- Transparent data handling

## Roadmap

- [ ] Windows WASAPI loopback for system audio
- [ ] Local Whisper.cpp for offline STT
- [ ] Advanced RAG with reranking
- [ ] Team collaboration features
- [ ] Calendar integration
- [ ] Plugin system

## License

MIT License - see LICENSE file for details

## Contributing

Contributions welcome! Please read CONTRIBUTING.md first.
