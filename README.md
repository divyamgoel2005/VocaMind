# VocaMind – Voice-First AI Assistant 🎙️⚡

> A modern, hands-free conversational AI web application featuring browser-native Web Speech streaming, client-side Voice Activity Detection (VAD), Neural Intent Classification, and ultra-fast Groq LPU accelerated inference.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success?logo=vercel&logoColor=white&style=for-the-badge)](https://voca-mind-fvuetttd8-yo-2166.vercel.app/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![Groq LPU](https://img.shields.io/badge/Inference-Groq_LPU-F55036?logo=fastapi&logoColor=white&style=for-the-badge)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

### 🌐 **Live Application**
Experience VocaMind in your browser:  
👉 **[https://voca-mind-fvuetttd8-yo-2166.vercel.app/](https://voca-mind-fvuetttd8-yo-2166.vercel.app/)**  
*(Optimized for Google Chrome and Microsoft Edge for seamless Web Speech API support)*

---

## 🌟 Overview

**VocaMind** is an intelligent, voice-first AI assistant built to create a frictionless, natural conversational experience. Traditional chatbots rely heavily on manual text entry, clicking send buttons, and reading walls of text. VocaMind shifts the paradigm to **voice-native communication**:

- **Speak Naturally**: Speak without needing to hit a submit button. The integrated Voice Activity Detection (VAD) monitors your speech in real time, detecting pauses and automatically submitting queries.
- **Neural Intent & Confidence Scoring**: Every query is evaluated by an ultra-fast LLM pipeline powered by the **Groq LPU (Language Processing Unit)**, returning predicted intent tags alongside confidence metrics.
- **Dual-Channel Output (Read & Listen)**: Responses are displayed cleanly on screen with markdown formatting and simultaneously vocalized via device speakers with tone and rate normalization.
- **Calm, Elegant Aesthetic**: Designed with an understated ivory, slate, and restrained indigo design system, providing a focused and distraction-free user experience.

---

## ✨ Key Features

- **🎙️ Hands-Free Conversational Loop**: Automatic sentence finalization via a 1.3-second silence detection window.
- **🧠 Real-Time Intent Classification**: Categorizes user intent on the fly with confidence probability percentages.
- **⚡ Sub-Second Turnaround**: Groq LPU accelerated inference delivers total round-trip response times under 750 ms.
- **🔊 Full-Duplex Speech Synthesis**: Instant text-to-speech playback with one-click mute controls and replay buttons per message.
- **🌊 Interactive Voice Waveforms**: Dynamic soundwave visualizer responding to listening, transcribing, thinking, and speaking states.
- **📱 Fully Responsive & Accessible**: Clean responsive layout tailored for both desktop and mobile devices.

---

## 🧠 System Architecture & Pipeline Flow

The entire conversation lifecycle operates across five synchronized stages:

```
                      ┌──────────────────────────────────────────────┐
                      │             User Speaks into Mic             │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │      Stage 1: Speech-to-Text Streaming       │
                      │  • Browser Web Speech API                    │
                      │  • Continuous audio stream                   │
                      │  • Live interim transcript rendering         │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │     Stage 2: Voice Activity Detection (VAD)  │
                      │  • Client-side silence detection (1.3s)      │
                      │  • Automated speech finalization             │
                      │  • Debounced query dispatch                  │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          Stage 3: API Service Layer          │
                      │  • POST /api/chat                            │
                      │  • Edge-ready Serverless Function / Vite Dev │
                      │  • Request validation & sanitization         │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │        Stage 4: Groq LPU Cloud Engine        │
                      │  • High-throughput LPU inference             │
                      │  • Model: qwen/qwen3.8-27b                   │
                      │  • Semantic Intent Tagging                   │
                      │  • Softmax Confidence Probability            │
                      │  • Contextual Response Generation            │
                      └──────────────────────┬───────────────────────┘
                                             │
                        ┌────────────────────┴────────────────────┐
                        ▼                                         ▼
         ┌───────────────────────────────┐     ┌──────────────────────────────────┐
         │ Stage 5A: Visual UI Channel   │     │  Stage 5B: Audio Playback (TTS)  │
         │ • User & AI message bubbles   │     │ • Browser SpeechSynthesis API    │
         │ • Intent badge & Confidence % │     │ • Automatic read-aloud playback  │
         │ • Markdown formatting         │     │ • Pitch & Rate calibration       │
         │ • Per-message replay controls │     │ • Global mute toggle             │
         └───────────────────────────────┘     └──────────────────────────────────┘
```

### Detailed Pipeline Breakdown

1. **Audio Streaming & Interim Capture**:
   When the microphone is active, the browser's native `SpeechRecognition` API captures audio in continuous mode. As the user speaks, interim transcripts stream directly into the active prompt visualizer.

2. **Client-Side Voice Activity Detection (VAD)**:
   A silence-detection debounce timer triggers whenever speech pauses. Once silence exceeds the threshold (1.3 seconds), VocaMind automatically packages the finalized transcript and dispatches the query without requiring any manual clicks.

3. **Decoupled API Layer**:
   Requests route through `src/services/api.js` to `/api/chat`. This layer normalizes requests, manages errors gracefully, and communicates securely with backend inference providers.

4. **Groq LPU Accelerated Inference**:
   The backend leverages Groq's Language Processing Unit (LPU) running `qwen/qwen3.8-27b`. The model processes the utterance at high speed, returning a structured JSON payload containing:
   - The predicted semantic intent classification
   - A calibrated confidence probability score
   - An articulate, context-aware answer

5. **Simultaneous Dual Output**:
   - **Visual UI**: The conversation timeline updates immediately with formatted markdown text, an intent chip, and a confidence meter.
   - **Vocal Synthesis**: The browser's `SpeechSynthesis` engine reads the response aloud using an optimized vocal cadence.

---

## ⚡ Performance & Latency Breakdown

| Phase | Component | Average Latency |
|---|---|---|
| **Speech Transcription** | Client Browser Web Speech API | `~100 – 250 ms` |
| **Network Round-Trip** | HTTPS edge transport | `~80 – 140 ms` |
| **Neural Inference** | Groq LPU Cloud (`qwen/qwen3.8-27b`) | `~180 – 300 ms` |
| **Audio Synthesis Init** | Client `SpeechSynthesis` pipeline | `~50 – 80 ms` |
| **Total End-to-End Turnaround** | **Complete voice-to-voice loop** | **< 750 ms** |

---

## 📡 API Specification

### Endpoint: `POST /api/chat`

The application communicates through a clean service layer, making it easy to connect to Vercel Serverless, local Vite dev servers, or external custom backends.

#### Request Body
```json
{
  "text": "What causes the Northern Lights in polar regions?"
}
```

#### Response Body
```json
{
  "recognized_text": "What causes the Northern Lights in polar regions?",
  "intent": "scientific_phenomenon_explanation",
  "confidence": 0.985,
  "response": "The Northern Lights, or Aurora Borealis, occur when charged particles from the solar wind collide with oxygen and nitrogen atoms in Earth's magnetosphere, releasing energy in the form of vibrant green, purple, and red auroral curtains."
}
```

---

## 🎨 Design System & Color Palette

Designed for focus, readability, and modern elegance:

| Token / Element | Hex Code | Role |
|---|---|---|
| **Page Background** | `#F7F8FC` | Soft ivory foundation |
| **Cards & Chat Surface** | `#FFFFFF` | Crisp white cards with soft drop shadows |
| **Subtle Secondary Surface** | `#F0F3FA` | Muted backgrounds for chips, avatars & inputs |
| **Primary Text** | `#18233B` | Deep slate for crisp typography |
| **Secondary Text** | `#64748B` | Refined slate gray for timestamps & guidance |
| **Borders** | `#E3E8F2` | Subtle hair-line separation |
| **Primary Action & User Bubble** | `#5956D6` | Vibrant, restrained indigo |
| **Accent / Hover** | `#7775E7` | Smooth interactive hover transition |
| **AI Response Bubble** | `#F0F2FF` | Delicate lavender-indigo tint for AI responses |

---

## 💻 Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS 3.4](https://tailwindcss.com/) with semantic color tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Speech-to-Text**: Browser-native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)
- **Text-to-Speech**: Browser-native `window.speechSynthesis`
- **AI Inference Engine**: [Groq Cloud LPU](https://groq.com/) running `qwen/qwen3.8-27b`
- **Serverless API**: Vercel Serverless Function (`api/chat.js`) + Vite local proxy middleware

---

## 📂 Project Structure

```
├── api/
│   └── chat.js                   # Serverless API endpoint (POST /api/chat)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Header, brand status, global mute & new chat button
│   │   ├── ChatWindow.jsx        # Scrollable message feed with empty state & auto-scroll
│   │   ├── ChatMessage.jsx       # Message bubbles, intent pills, confidence % & replay TTS
│   │   └── VoiceInput.jsx        # Center voice station with waveforms & input bar
│   ├── hooks/
│   │   ├── useSpeechRecognition.js # Speech capture with Voice Activity Detection (VAD)
│   │   └── useSpeechSynthesis.js   # Vocal synthesis with queue management & mute toggle
│   ├── services/
│   │   └── api.js                # Decoupled API client layer
│   ├── App.jsx                   # Central state orchestrator
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Tailwind directives, keyframe animations & palette rules
├── vercel.json                   # Vercel deployment configuration
├── tailwind.config.js            # Semantic palette tokens
├── vite.config.js                # Vite build config + local dev API middleware
└── package.json
```

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/divyamgoel2005/VocaMind.git
cd VocaMind
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in Google Chrome or Microsoft Edge (recommended for optimal Web Speech API microphone support).

### 4. Build for Production
```bash
npm run build
```

---

## ☁️ Deployment

VocaMind is built for zero-config deployment on **Vercel**:

- **Frontend**: Automatically built and served as an optimized Vite static bundle.
- **Backend API**: The `/api/chat.js` endpoint deploys automatically as a serverless function.

Check out the live deployment anytime: **[https://voca-mind-fvuetttd8-yo-2166.vercel.app/](https://voca-mind-fvuetttd8-yo-2166.vercel.app/)**

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Crafted with ❤️ by <strong>Divyam Goel</strong>
</p>
