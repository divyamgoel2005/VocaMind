import React, { useState } from 'react';
import { Bot, User, Check, Copy, Volume2, VolumeX } from 'lucide-react';

export default function ChatMessage({ message, onSpeak, isSpeakingThis }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`flex gap-3 sm:gap-4 my-3 w-full transition-all duration-300 animate-fadeIn ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-9 h-9 rounded-xl bg-[#F0F3FA] border border-[#E3E8F2] flex items-center justify-center text-[#5956D6] shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
        </div>
      )}

      {/* Message Content Container */}
      <div
        className={`flex flex-col ${
          isUser ? 'items-end max-w-[85%] sm:max-w-[78%]' : 'items-start max-w-[92%] sm:max-w-[85%]'
        }`}
      >
        {/* Header: Name & Timestamp */}
        <div
          className={`flex items-center gap-2 mb-1.5 text-xs text-[#64748B] font-medium ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <span className={isUser ? 'text-[#5956D6] font-semibold' : 'text-[#18233B] font-semibold'}>
            {isUser ? (message.isVoice ? 'You (Voice)' : 'You') : 'VocaMind'}
          </span>
          <span className="text-[#E3E8F2]">•</span>
          <span className="text-[#64748B] text-[11px]">
            {message.timestamp || 'Just now'}
          </span>
        </div>

        {/* Message Bubble */}
        <div
          className={`relative px-4.5 py-3.5 sm:px-5 sm:py-4 rounded-2xl text-sm leading-relaxed transition-all ${
            isUser
              ? 'bg-[#5956D6] text-white rounded-tr-xs shadow-md shadow-[#5956D6]/20'
              : 'bg-[#F0F2FF] border border-[#E3E8F2] text-[#18233B] rounded-tl-xs shadow-xs'
          }`}
        >
          <p className="whitespace-pre-wrap select-text break-words leading-relaxed text-[14.5px]">
            {message.text}
          </p>

          {/* AI Message Footer: Voice Speaker & Copy Buttons */}
          {!isUser && (
            <div className="mt-3 pt-2.5 border-t border-[#E3E8F2] flex items-center gap-1.5 text-xs text-[#64748B]">
              <button
                onClick={() => onSpeak?.(message.text)}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium ${
                  isSpeakingThis
                    ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                    : 'hover:bg-white text-[#64748B] hover:text-[#18233B]'
                }`}
                title={isSpeakingThis ? 'Stop speaking' : 'Read aloud through speaker'}
              >
                {isSpeakingThis ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#5956D6]" />
                    <span>Speak</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="px-2 py-1 rounded-lg hover:bg-white text-[#64748B] hover:text-[#18233B] transition-colors flex items-center gap-1 text-xs"
                title="Copy text"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-9 h-9 rounded-xl bg-[#F0F3FA] border border-[#E3E8F2] flex items-center justify-center text-[#5956D6] shadow-xs">
            <User className="w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
}
