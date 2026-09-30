import React from 'react';
import { Bot, RotateCcw, Volume2, VolumeX } from 'lucide-react';

export default function Navbar({
  onResetConversation,
  isMuted,
  onToggleMute,
  isSpeaking,
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E3E8F2] bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#5956D6] p-0.5 shadow-sm shadow-[#5956D6]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#F0F2FF] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#5956D6]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-[#18233B] font-sans">
                VocaMind
              </span>
              <span className="px-1.5 py-0.2 text-[10px] font-semibold uppercase tracking-wider bg-[#F0F3FA] text-[#5956D6] border border-[#E3E8F2] rounded">
                Voice AI
              </span>
            </div>
            <span className="text-[11px] text-[#64748B] font-medium hidden sm:block">
              Deep Learning Voice Assistant
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Speaker Voice Toggle Button */}
          <button
            onClick={onToggleMute}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
              isMuted
                ? 'bg-[#F0F3FA] border-[#E3E8F2] text-[#64748B] hover:text-[#18233B]'
                : 'bg-[#F0F2FF] border-[#5956D6]/35 text-[#5956D6] hover:bg-[#E3E8F2] shadow-xs'
            }`}
            title={isMuted ? 'Turn speaker voice ON' : 'Mute speaker voice'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="hidden xs:inline">Speaker Off</span>
              </>
            ) : (
              <>
                <Volume2 className={`w-3.5 h-3.5 text-[#5956D6] ${isSpeaking ? 'animate-bounce' : ''}`} />
                <span className="hidden xs:inline">Speaker Auto-Play</span>
              </>
            )}
          </button>

          {/* Reset Chat */}
          <button
            onClick={onResetConversation}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-[#E3E8F2] hover:border-slate-300 bg-white hover:bg-[#F0F3FA] text-[#64748B] hover:text-[#18233B] transition-colors text-xs flex items-center gap-1.5 shadow-xs"
            title="Start New Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
}
