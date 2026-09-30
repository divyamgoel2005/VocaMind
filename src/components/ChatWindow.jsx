import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { MessageSquare, RotateCcw, Loader2, AlertTriangle } from 'lucide-react';

export default function ChatWindow({
  messages,
  isLoading,
  error,
  onClearChat,
  onRetry,
  onSpeak,
  isSpeaking,
}) {
  const containerRef = useRef(null);

  // Auto-scroll inside the chat container whenever messages update or loading state changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-[#E3E8F2] rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-[#E3E8F2] bg-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F0F3FA] border border-[#E3E8F2] text-[#5956D6] flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#18233B] tracking-tight">
              Conversation
            </h2>
          </div>
        </div>

        {/* Clear chat button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClearChat}
            className="p-1 sm:px-2.5 sm:py-1 rounded-lg text-[#64748B] hover:text-[#18233B] hover:bg-[#F0F3FA] border border-[#E3E8F2] text-xs transition-colors flex items-center gap-1 shadow-xs"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={containerRef}
        className="p-4 sm:p-6 min-h-[340px] max-h-[460px] overflow-y-auto space-y-3.5 bg-white"
      >
        {/* Date divider chip */}
        <div className="flex items-center justify-center my-1">
          <div className="px-3 py-0.5 rounded-full bg-[#F0F3FA] border border-[#E3E8F2] text-[10px] font-medium text-[#64748B]">
            Today's Session
          </div>
        </div>

        {/* Message List */}
        {messages.map((msg, index) => (
          <ChatMessage
            key={msg.id || index}
            message={msg}
            onSpeak={onSpeak}
            isSpeakingThis={isSpeaking && index === messages.length - 1 && msg.role === 'assistant'}
          />
        ))}

        {/* Assistant Loading State */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 my-3 w-full justify-start animate-fadeIn">
            <div className="flex-shrink-0 mt-1">
              <div className="w-9 h-9 rounded-xl bg-[#F0F3FA] border border-[#E3E8F2] flex items-center justify-center text-[#5956D6]">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>

            <div className="flex flex-col items-start max-w-[85%]">
              <div className="flex items-center gap-2 mb-1 text-xs text-[#64748B] font-medium">
                <span className="text-[#18233B]">VocaMind</span>
                <span>•</span>
                <span className="text-[#5956D6] animate-pulse text-[11px]">Thinking...</span>
              </div>

              <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-[#F0F2FF] border border-[#E3E8F2] text-[#18233B] text-sm shadow-xs flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5956D6] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-[#5956D6] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-[#5956D6] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-xs text-[#64748B]">
                  Analyzing speech & generating response...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification Banner */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 my-2 shadow-xs">
            <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <span className="font-semibold text-rose-800 text-xs block">
                Backend Connection Notice
              </span>
              <p className="text-rose-700 leading-relaxed text-[11px]">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 transition-colors font-medium text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  Retry
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
