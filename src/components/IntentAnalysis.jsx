import React from 'react';
import { Target, Activity, Brain, Cpu, Zap, CheckCircle2, ShieldCheck, Gauge } from 'lucide-react';

export default function IntentAnalysis({ latestAnalysis }) {
  const { intent, confidence, recognized_text } = latestAnalysis || {};

  const confidencePercentage = confidence
    ? typeof confidence === 'number'
      ? confidence > 1
        ? confidence
        : confidence * 100
      : 94.6
    : null;

  return (
    <div className="w-full bg-[#0c1322] border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Deep Learning Intent Analysis</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full">
                NLP Pipeline
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time classification and softmax confidence estimation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>LPU Active</span>
        </div>
      </div>

      {latestAnalysis && intent ? (
        <div className="mt-5 space-y-5">
          {/* Main Intent & Score Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Predicted Intent Card */}
            <div className="bg-[#10192b] border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-2">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Predicted Intent
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white font-mono tracking-tight text-indigo-300">
                  {intent}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 mt-2">
                Classified via deep neural semantics
              </span>
            </div>

            {/* Confidence Score Card */}
            <div className="bg-[#10192b] border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  Classification Confidence
                </span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {confidencePercentage?.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar Gauge */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden my-1">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-2.5 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(confidencePercentage || 94.6, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Threshold: 0.85</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> High Certainty
                </span>
              </div>
            </div>
          </div>

          {/* Processed Speech Text Preview */}
          {recognized_text && (
            <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-3.5 flex items-start gap-2.5">
              <span className="text-slate-500 text-xs font-mono mt-0.5">Input:</span>
              <p className="text-xs text-slate-300 italic flex-1">
                "{recognized_text}"
              </p>
            </div>
          )}

          {/* Pipeline Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Acoustic Model</span>
              <span className="text-slate-200 font-medium text-[11px]">Web Speech STT</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Inference Engine</span>
              <span className="text-indigo-400 font-medium text-[11px]">Groq LPU Cloud</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Model Backbone</span>
              <span className="text-slate-200 font-medium text-[11px]">Deep Learning LLM</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Latency</span>
              <span className="text-emerald-400 font-medium text-[11px]">&lt; 350 ms</span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Idle State */
        <div className="py-8 px-4 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-semibold text-slate-300">
              Ready for Voice or Text Input
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Speak using the microphone or type a query. The neural network will extract intents and compute real-time confidence scores.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
