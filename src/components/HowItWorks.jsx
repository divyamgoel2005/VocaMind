import React from 'react';
import { Mic, Cpu, Target, Sparkles, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Speech Capture & STT',
      subtitle: 'Web Speech API',
      description:
        'Acoustic signal captured via browser microphone with client-side speech recognition streaming real-time tokens.',
      icon: Mic,
      tag: 'Acoustic Processing',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '02',
      title: 'Semantic Tokenization',
      subtitle: 'NLP Feature Pipeline',
      description:
        'Text normalization, stop-word filtering, and vector embedding extraction to prepare input for neural processing.',
      icon: Cpu,
      tag: 'Feature Extraction',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      step: '03',
      title: 'Intent Classification',
      subtitle: 'Deep Learning Model',
      description:
        'Deep neural network classifies user utterance into domain intents with softmax probability confidence scoring.',
      icon: Target,
      tag: 'Neural Classification',
      color: 'from-purple-500 to-pink-600',
    },
    {
      step: '04',
      title: 'Groq LPU Generation',
      subtitle: 'Ultra-Fast Inference',
      description:
        'Groq Language Processing Unit generates fluent, context-aware answers with sub-second response latency.',
      icon: Sparkles,
      tag: 'LLM Response',
      color: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            System Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-3">
            How VocaMind Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            From acoustic waveform capture to deep learning intent prediction and Groq-accelerated conversational responses.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-[#0d1424]/80 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 group shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Step number badge & icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-indigo-400 transition-colors">
                      STEP {item.step}
                    </span>
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${item.color} p-0.5 shadow-md flex items-center justify-center`}
                    >
                      <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center text-white">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 block mb-1">
                    {item.tag}
                  </span>
                  <h3 className="text-base font-bold text-white mb-1 tracking-tight">
                    {item.title}
                  </h3>
                  <span className="text-xs text-indigo-300/80 font-mono block mb-3">
                    {item.subtitle}
                  </span>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center text-xs text-slate-500 group-hover:text-indigo-400 font-medium transition-colors">
                  <span>Learn pipeline details</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
