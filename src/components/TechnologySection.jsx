import React from 'react';
import { Layers, Zap, Cpu, Sparkles, Terminal, Code2 } from 'lucide-react';

export default function TechnologySection() {
  const technologies = [
    {
      name: 'React 18 & Vite',
      category: 'Frontend Framework',
      description:
        'Fast reactive UI with modern hooks, optimized component tree, and instant hot-module replacement.',
      icon: Code2,
      badge: 'Client Core',
      border: 'hover:border-cyan-500/40',
    },
    {
      name: 'Web Speech API',
      category: 'Acoustic Processing',
      description:
        'Browser-native speech recognition handling audio capture, acoustic modeling, and streaming transcription.',
      icon: Layers,
      badge: 'Speech-to-Text',
      border: 'hover:border-indigo-500/40',
    },
    {
      name: 'Deep Learning & NLP',
      category: 'Intent Classifier',
      description:
        'Neural semantic classification model that categorizes inputs and calculates calibrated confidence scores.',
      icon: Cpu,
      badge: 'Neural Network',
      border: 'hover:border-purple-500/40',
    },
    {
      name: 'Groq LPU Inference',
      category: 'Language Generation',
      description:
        'High-speed deterministic inference using Groq LPUs for rapid, accurate conversational dialogue generation.',
      icon: Zap,
      badge: 'Sub-Second LLM',
      border: 'hover:border-amber-500/40',
    },
    {
      name: 'Clean API Service Layer',
      category: 'Backend Contract',
      description:
        'Standardized POST /api/chat service with environment variable (VITE_API_URL) decoupling and error isolation.',
      icon: Terminal,
      badge: 'API Contract',
      border: 'hover:border-emerald-500/40',
    },
    {
      name: 'Modern CSS & Tailwind',
      category: 'Design System',
      description:
        'Figma pixel-aligned dark aesthetics, glowing accents, sound wave micro-animations, and glassmorphism.',
      icon: Sparkles,
      badge: 'Visual Design',
      border: 'hover:border-pink-500/40',
    },
  ];

  return (
    <section id="technology" className="py-16 sm:py-20 border-t border-slate-800/80 bg-[#060a14]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Architecture & Stack
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-3">
            Deep Learning Project Technology
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Constructed for high performance, modularity, and seamless deployment on local servers or Vercel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={idx}
                className={`bg-[#0d1424]/90 border border-slate-800/90 rounded-2xl p-6 transition-all duration-300 ${tech.border} shadow-lg flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                      {tech.badge}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wide block">
                    {tech.category}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight mt-0.5 mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tech.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Lab Spec</span>
                  <span className="text-slate-400">Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
