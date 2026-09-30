import React from 'react';
import { Send, RotateCcw, Sparkles, MessageSquareQuote, Loader2, ArrowRight } from 'lucide-react';

export default function RecognizedSpeech({
  text,
  onChangeText,
  onSubmit,
  onClear,
  isLoading,
  disabled,
}) {
  const handleKeyDown = (e) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text && text.trim() && !isLoading && !disabled) {
        onSubmit();
      }
    }
  };

  const samplePrompts = [
    'Explain how Convolutional Neural Networks work',
    'What is backpropagation in deep learning?',
    'How does Transformer self-attention work?',
  ];

  return (
    <div className="w-full bg-[#0e1627] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md transition-all">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <MessageSquareQuote className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Recognized Speech & Input
            </h4>
            <span className="text-[11px] text-slate-500">
              Review and edit before sending to the model
            </span>
          </div>
        </div>

        {text && (
          <button
            onClick={onClear}
            disabled={isLoading}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800/80 transition-colors"
            title="Clear text"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Editable Textarea */}
      <div className="relative">
        <textarea
          rows={3}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || disabled}
          placeholder="Your recognized voice input will appear here automatically. You can also edit it or type directly..."
          className="w-full bg-[#090e1b] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-y min-h-[88px] leading-relaxed"
        />

        {/* Character count */}
        <div className="absolute right-3 bottom-3 text-[10px] text-slate-500 font-mono pointer-events-none">
          {text.length} chars
        </div>
      </div>

      {/* Quick suggestions / Prompt chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Suggestions:
        </span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onChangeText(prompt)}
            disabled={isLoading}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-indigo-950/40 text-slate-400 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/30 transition-all text-left truncate max-w-[260px] sm:max-w-none"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Enter</kbd> to ask, or click the button.
        </span>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!text.trim() || isLoading || disabled}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
            !text.trim() || isLoading || disabled
              ? 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing & Responding...</span>
            </>
          ) : (
            <>
              <span>Ask VocaMind</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
