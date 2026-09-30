import React, { useState, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import VoiceInput from './components/VoiceInput';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { sendChatMessage } from './services/api';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Text-to-Speech (Speaker output) Hook
  const {
    isSpeaking,
    isMuted,
    speak,
    stop: stopSpeaking,
    toggleMute,
  } = useSpeechSynthesis();

  // Initial welcome greeting
  const initialGreeting = {
    id: 'welcome-msg',
    role: 'assistant',
    text: "Hello! I am VocaMind, your voice-enabled AI assistant. Just tap the microphone below and speak naturally — I'll detect when your sentence finishes and speak the answer back to you.",
    timestamp: 'Just now',
    intent: 'greeting',
    confidence: 0.99,
  };

  const [messages, setMessages] = useState([initialGreeting]);

  // Main message processing function
  const handleSendMessage = useCallback(
    async (textToSend, isVoice = false) => {
      const trimmed = textToSend?.trim();
      if (!trimmed || isLoading) return;

      // Stop any ongoing speech playback before new question
      stopSpeaking();

      setInputText('');
      setApiError(null);

      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Add user message to conversation
      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: trimmed,
        timestamp: formattedTime,
        isVoice,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Send to POST /api/chat
        const data = await sendChatMessage(trimmed);

        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: data.intent,
          confidence: data.confidence,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Automatically speak answer through the speaker!
        speak(data.response);
      } catch (err) {
        console.error('Error generating AI response:', err);
        setApiError(err.message || 'Could not connect to VocaMind API. Please verify backend server.');
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, speak, stopSpeaking]
  );

  // Speech Recognition Hook with automatic sentence completion callback!
  const handleSentenceComplete = useCallback(
    (finalSentence) => {
      if (finalSentence && finalSentence.trim()) {
        handleSendMessage(finalSentence, true);
      }
    },
    [handleSendMessage]
  );

  const {
    isSupported: isSpeechSupported,
    status: speechStatus,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    onSentenceComplete: handleSentenceComplete,
    autoSubmitDelay: 1300, // 1.3s of natural pause after sentence signals completion
  });

  // Reset conversation handler
  const handleReset = () => {
    stopSpeaking();
    resetTranscript();
    setInputText('');
    setApiError(null);
    setMessages([
      {
        ...initialGreeting,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#18233B] flex flex-col relative w-full overflow-x-hidden selection:bg-[#5956D6]/15 selection:text-[#5956D6]">
      {/* Subtle atmospheric glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#5956D6]/8 via-[#7775E7]/4 to-transparent blur-[120px]" />
      </div>

      {/* Top Navbar */}
      <Navbar
        onResetConversation={handleReset}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        isSpeaking={isSpeaking}
      />

      {/* Main Voice Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12 flex flex-col justify-between">
        {/* Simplified Header */}
        <section className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F0F3FA] border border-[#E3E8F2] text-[#5956D6] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5956D6]" />
            <span>Voice-First AI Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18233B] tracking-tight">
            Talk to <span className="text-[#5956D6]">VocaMind</span>
          </h1>
          <p className="text-sm text-[#64748B] mt-2 max-w-md mx-auto">
            Tap the microphone and speak naturally. It detects when your sentence finishes and speaks the answer aloud.
          </p>
        </section>

        {/* Central Chat & Voice Interface */}
        <div className="space-y-4">
          {/* Conversation Window */}
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            error={apiError}
            onClearChat={handleReset}
            onRetry={() => {
              const lastUser = [...messages].reverse().find((m) => m.role === 'user');
              if (lastUser) handleSendMessage(lastUser.text, lastUser.isVoice);
            }}
            onSpeak={(text) => speak(text)}
            isSpeaking={isSpeaking}
          />

          {/* Unified Voice Microphone Station & Input */}
          <VoiceInput
            status={speechStatus}
            isSupported={isSpeechSupported}
            errorMessage={speechError}
            interimTranscript={interimTranscript}
            transcript={transcript}
            isSpeaking={isSpeaking}
            onStopSpeaking={stopSpeaking}
            onStartListening={startListening}
            onStopListening={stopListening}
            inputText={inputText}
            onChangeInputText={setInputText}
            onSubmitText={() => handleSendMessage(inputText, false)}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}
