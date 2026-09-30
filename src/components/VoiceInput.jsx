import React from 'react';
import { Mic, MicOff, Square, Loader2, Volume2, Send, Sparkles, AlertCircle } from 'lucide-react';

export default function VoiceInput({
  status, // 'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR'
  isSupported,
  errorMessage,
  interimTranscript,
  transcript,
  isSpeaking,
  onStopSpeaking,
  onStartListening,
  onStopListening,
  inputText = '',
  onChangeInputText,
  onSubmitText,
  isLoading,
}) {
  const isListening = status === 'LISTENING';
  const isProcessing = status === 'PROCESSING' || isLoading;
  const isError = status === 'ERROR';

  const handleMicClick = () => {
    if (isSpeaking) {
      onStopSpeaking?.();
      return;
    }
    if (isListening) {
      onStopListening();
    } else if (isProcessing) {
      // currently processing
    } else {
      onStartListening();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !isProcessing) {
        onSubmitText();
      }
    }
  };

  const currentHeardText = interimTranscript || transcript;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Live speech preview pill when user is speaking */}
      {isListening && currentHeardText && (
        <div className="flex items-center justify-center animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F2FF] border border-[#5956D6]/30 text-[#18233B] text-xs sm:text-sm shadow-md max-w-lg">
            <span className="w-2 h-2 rounded-full bg-[#5956D6] animate-ping flex-shrink-0" />
            <span className="text-[#64748B] font-medium">Hearing:</span>
            <span className="text-[#18233B] font-semibold italic truncate">
              "{currentHeardText}"
            </span>
          </div>
        </div>
      )}

      {/* Assistant Speaking Status Indicator */}
      {isSpeaking && (
        <div className="flex items-center justify-center animate-fadeIn">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#F0F2FF] border border-[#5956D6]/30 text-[#18233B] text-xs sm:text-sm shadow-md">
            <Volume2 className="w-4 h-4 text-[#5956D6] animate-bounce" />
            <span>VocaMind is speaking aloud...</span>
            <button
              onClick={onStopSpeaking}
              className="ml-1 px-2.5 py-0.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 text-xs font-medium transition-colors"
            >
              Stop Voice
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {isError && errorMessage && (
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs max-w-md shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Center Voice Microphone Station */}
      <div className="bg-white border border-[#E3E8F2] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/50 transition-all">
        <div className="flex flex-col items-center justify-center">
          {/* Waveform and Mic row */}
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Left Sound Wave Bars */}
            <div className="flex items-center gap-1 h-10">
              <div className={`wave-bar ${isListening || isSpeaking ? 'wave-bar-active' : 'h-2'}`} />
              <div className={`wave-bar ${isListening || isSpeaking ? 'wave-bar-active' : 'h-3.5'}`} />
              <div className={`wave-bar ${isListening || isSpeaking ? 'wave-bar-active' : 'h-2'}`} />
            </div>

            {/* Circular Voice Button */}
            <div className="relative flex items-center justify-center">
              {/* Ripple Rings when active */}
              {isListening && (
                <>
                  <div className="absolute w-24 h-24 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
                  <div className="absolute w-28 h-28 rounded-full bg-[#5956D6]/20 animate-pulse pointer-events-none" />
                </>
              )}

              <button
                type="button"
                onClick={handleMicClick}
                disabled={!isSupported && !isError}
                aria-label={
                  isListening
                    ? 'Stop listening'
                    : isProcessing
                    ? 'Processing audio'
                    : 'Start talking'
                }
                className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-none cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-rose-500/35 scale-105 mic-listening-pulse'
                    : isSpeaking
                    ? 'bg-[#5956D6] text-white shadow-[#5956D6]/35 animate-pulse'
                    : isProcessing
                    ? 'bg-amber-500 text-white shadow-amber-500/30'
                    : isError
                    ? 'bg-slate-200 text-rose-600 border border-rose-300 hover:bg-slate-300'
                    : 'bg-[#5956D6] hover:bg-[#7775E7] text-white shadow-lg shadow-[#5956D6]/30 hover:scale-105 active:scale-95'
                }`}
              >
                {isListening ? (
                  <Square className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white animate-pulse" />
                ) : isProcessing ? (
                  <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-white" />
                ) : isSpeaking ? (
                  <Volume2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                ) : isError ? (
                  <MicOff className="w-7 h-7 sm:w-8 sm:h-8" />
                ) : (
                  <Mic className="w-7 h-7 sm:w-8 sm:h-8" />
                )}
              </button>
            </div>

            {/* Right Sound Wave Bars */}
            <div className="flex items-center gap-1 h-10">
              <div className={`wave-bar ${isListening || isSpeaking ? 'wave-bar-active' : 'h-2'}`} />
              <div className={`wave-bar ${isListening || isSpeaking ? 'wave-bar-active' : 'h-3.5'}`} />
              <div className={`wave-bar ${isListening || isSpeaking ? 'wave-bar-active' : 'h-2'}`} />
            </div>
          </div>

          {/* Status Label & Guidance */}
          <div className="mt-3.5 text-center">
            <span
              className={`text-sm font-semibold tracking-wide block ${
                isListening
                  ? 'text-rose-600 animate-pulse'
                  : isSpeaking
                  ? 'text-[#5956D6]'
                  : isProcessing
                  ? 'text-amber-600'
                  : isError
                  ? 'text-rose-600'
                  : 'text-[#18233B]'
              }`}
            >
              {isListening
                ? 'Listening... Speak naturally'
                : isSpeaking
                ? 'Speaking answer through speaker'
                : isProcessing
                ? 'Processing & generating answer...'
                : isError
                ? 'Microphone issue (Click to retry)'
                : 'Tap to Talk'}
            </span>
            <span className="text-[11px] sm:text-xs text-[#64748B] mt-1 block">
              {isListening
                ? 'VocaMind automatically detects sentence completion.'
                : isSpeaking
                ? 'Tap the button anytime to pause voice playback.'
                : 'Automatic end-of-sentence detection and speaker voice response.'}
            </span>
          </div>

          {/* Compact Text Input Bar */}
          <div className="w-full mt-4 pt-3.5 border-t border-[#E3E8F2]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => onChangeInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                placeholder={
                  isListening
                    ? 'Listening to your speech...'
                    : 'Or type your question and press Enter...'
                }
                className="w-full bg-[#F0F3FA] border border-[#E3E8F2] rounded-xl px-4 py-2.5 pr-12 text-sm text-[#18233B] placeholder-[#64748B] focus:outline-none focus:border-[#5956D6] focus:bg-white focus:ring-1 focus:ring-[#5956D6]/30 transition-all"
              />
              <button
                type="button"
                onClick={onSubmitText}
                disabled={!(inputText || '').trim() || isProcessing}
                className={`absolute right-1.5 p-1.5 rounded-lg transition-all ${
                  (inputText || '').trim() && !isProcessing
                    ? 'bg-[#5956D6] hover:bg-[#7775E7] text-white shadow-sm shadow-[#5956D6]/30'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Send message"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="text-[10px] text-[#64748B] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#5956D6]" />
                Try:
              </span>
              {[
                'Explain how neural networks learn',
                'What is backpropagation?',
                'How do transformers work?',
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChangeInputText(prompt)}
                  disabled={isProcessing}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F0F3FA] hover:bg-[#F0F2FF] text-[#64748B] hover:text-[#5956D6] border border-[#E3E8F2] hover:border-[#5956D6]/30 transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
