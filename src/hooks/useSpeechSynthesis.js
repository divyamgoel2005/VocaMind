import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Clean markdown symbols for natural TTS speech
 */
function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, 'Code block omitted.') // remove code blocks
    .replace(/`([^`]+)`/g, '$1') // remove inline code ticks
    .replace(/[*_~#]/g, '') // remove markdown bold, italics, headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // clean markdown links
    .replace(/[-*•]\s+/g, '') // clean bullet points
    .replace(/\n+/g, ' ') // collapse multiple newlines
    .trim();
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState([]);
  const selectedVoiceRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Prefer a natural, clear English voice
      const preferred = availableVoices.find(
        (v) =>
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Daniel') ||
            v.name.includes('Zira') ||
            v.name.includes('David')) &&
          v.lang.startsWith('en')
      ) || availableVoices.find((v) => v.lang.startsWith('en'));

      selectedVoiceRef.current = preferred || availableVoices[0] || null;
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text) => {
      if (!isSupported || isMuted || !text) return;

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any currently playing audio

        const cleanSpeechText = cleanTextForSpeech(text);
        if (!cleanSpeechText) return;

        const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
        if (selectedVoiceRef.current) {
          utterance.voice = selectedVoiceRef.current;
        }

        utterance.rate = 1.05; // Slightly upbeat conversational pace
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
          console.warn('Speech synthesis error:', e);
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      }
    },
    [isSupported, isMuted]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        stop();
      }
      return next;
    });
  }, [stop]);

  return {
    isSpeaking,
    isMuted,
    isSupported,
    speak,
    stop,
    toggleMute,
    setIsMuted,
  };
}
