import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for Web Speech API with Automatic Sentence Finish Detection (VAD)
 * 
 * When user speaks:
 * 1. Streams real-time speech tokens.
 * 2. Detects sentence completion when user pauses (silence threshold ~1.4s).
 * 3. Automatically triggers onSentenceComplete callback.
 */
export function useSpeechRecognition({ onSentenceComplete, autoSubmitDelay = 1400 } = {}) {
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR'
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const accumulatedTextRef = useRef('');
  const onSentenceCompleteRef = useRef(onSentenceComplete);

  // Keep callback ref updated
  useEffect(() => {
    onSentenceCompleteRef.current = onSentenceComplete;
  }, [onSentenceComplete]);

  // Clean silence timer
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Trigger automatic sentence submission
  const triggerAutoFinish = useCallback(() => {
    clearSilenceTimer();
    const finalSentence = accumulatedTextRef.current.trim();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore stop errors
      }
    }

    if (finalSentence) {
      setStatus('PROCESSING');
      if (onSentenceCompleteRef.current) {
        onSentenceCompleteRef.current(finalSentence);
      }
      accumulatedTextRef.current = '';
      setTranscript('');
      setInterimTranscript('');
      setTimeout(() => {
        setStatus('IDLE');
      }, 300);
    } else {
      setStatus('IDLE');
    }
  }, [clearSilenceTimer]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Stay active across minor pauses until sentence is done
      recognition.interimResults = true; // Stream tokens for real-time responsiveness
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setStatus('LISTENING');
        setError(null);
        accumulatedTextRef.current = '';
      };

      recognition.onresult = (event) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            currentFinal += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (currentFinal) {
          accumulatedTextRef.current = accumulatedTextRef.current
            ? `${accumulatedTextRef.current} ${currentFinal.trim()}`
            : currentFinal.trim();
          setTranscript(accumulatedTextRef.current);
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        } else {
          setInterimTranscript('');
        }

        // Reset silence timer on every new sound / word received
        clearSilenceTimer();

        const combinedCurrent = (
          (accumulatedTextRef.current ? accumulatedTextRef.current + ' ' : '') + currentInterim
        ).trim();

        // If the user has spoken something, wait for autoSubmitDelay of silence to detect sentence end
        if (combinedCurrent.length > 1) {
          silenceTimerRef.current = setTimeout(() => {
            // User finished speaking their sentence!
            if (currentInterim) {
              accumulatedTextRef.current = combinedCurrent;
            }
            triggerAutoFinish();
          }, autoSubmitDelay);
        }
      };

      recognition.onerror = (event) => {
        clearSilenceTimer();
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'no-speech') {
          // If silence without any words, revert to idle
          if (!accumulatedTextRef.current.trim()) {
            setStatus('IDLE');
            return;
          }
        } else if (event.error === 'not-allowed') {
          setError('Microphone access was denied. Please allow microphone permissions.');
          setStatus('ERROR');
        } else if (event.error !== 'aborted') {
          setError(`Microphone notice: ${event.error}`);
          setStatus('ERROR');
        }
      };

      recognition.onend = () => {
        clearSilenceTimer();
        // If there was speech that didn't trigger autoFinish yet, trigger it now
        if (accumulatedTextRef.current.trim()) {
          triggerAutoFinish();
        } else {
          setStatus((prev) => (prev === 'LISTENING' ? 'IDLE' : prev));
          setInterimTranscript('');
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Speech recognition initialization error:', err);
      setIsSupported(false);
      setError('Failed to initialize speech recognition.');
    }

    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup abort
        }
      }
    };
  }, [autoSubmitDelay, clearSilenceTimer, triggerAutoFinish]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      if (!isSupported) {
        setError('Speech recognition is not supported in this browser.');
        setStatus('ERROR');
      }
      return;
    }

    try {
      clearSilenceTimer();
      accumulatedTextRef.current = '';
      setTranscript('');
      setInterimTranscript('');
      setError(null);
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Recognition start warning:', err);
      if (err.name !== 'InvalidStateError') {
        setError('Could not access microphone: ' + err.message);
        setStatus('ERROR');
      }
    }
  }, [clearSilenceTimer, isSupported]);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (accumulatedTextRef.current.trim()) {
      triggerAutoFinish();
    } else if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setStatus('IDLE');
      } catch {
        setStatus('IDLE');
      }
    }
  }, [clearSilenceTimer, triggerAutoFinish]);

  const resetTranscript = useCallback(() => {
    clearSilenceTimer();
    accumulatedTextRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    setStatus('IDLE');
  }, [clearSilenceTimer]);

  return {
    isSupported,
    status,
    setStatus,
    transcript,
    setTranscript,
    interimTranscript,
    error,
    setError,
    startListening,
    stopListening,
    resetTranscript,
  };
}
