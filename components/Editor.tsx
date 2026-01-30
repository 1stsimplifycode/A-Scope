
import React, { useState } from 'react';
import { Problem } from '../types';
import { getGeminiAnalysis } from '../services/geminiService';

interface EditorProps {
  problem: Problem;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

const Editor: React.FC<EditorProps> = ({ problem, onClose, onSubmit }) => {
  const [code, setCode] = useState(`// Welcome to the DSA Portal Editor\n// Write your solution for ${problem.title} here...\n\nfunction solution() {\n  \n}`);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  const handleAiHint = async () => {
    setLoadingHint(true);
    setAiHint(null);
    // Fixed: calling getGeminiAnalysis with 'hint' type instead of non-existent getGeminiHint.
    const hint = await getGeminiAnalysis('hint', {
      problemTitle: problem.title,
      problemDescription: problem.description,
      userCode: code
    });
    setAiHint(hint);
    setLoadingHint(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Left: Problem Details */}
        <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 truncate">{problem.title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{problem.description}</p>
            </div>
            
            {problem.examples.map((ex, idx) => (
              <div key={idx} className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                <h4 className="text-xs font-bold text-indigo-700 uppercase mb-2">Example {idx + 1}</h4>
                <div className="space-y-2 text-xs">
                  <p><span className="font-semibold">Input:</span> <code className="bg-white px-1 rounded border">{ex.input}</code></p>
                  <p><span className="font-semibold">Output:</span> <code className="bg-white px-1 rounded border">{ex.output}</code></p>
                  {ex.explanation && <p className="text-slate-500 italic mt-1">{ex.explanation}</p>}
                </div>
              </div>
            ))}

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Constraints</h4>
              <ul className="list-disc list-inside text-xs text-slate-500 space-y-1">
                {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Code Area */}
        <div className="flex-1 flex flex-col bg-slate-900">
          <div className="h-14 bg-slate-800 flex items-center justify-between px-6 border-b border-slate-700">
             <div className="flex items-center gap-4 text-slate-400 text-sm">
                <span className="font-medium text-indigo-400">JavaScript</span>
                <span className="opacity-50">|</span>
                <button onClick={handleAiHint} className="flex items-center gap-2 hover:text-white transition-colors" disabled={loadingHint}>
                  <i className={`fa-solid fa-wand-magic-sparkles ${loadingHint ? 'animate-pulse' : ''}`}></i>
                  {loadingHint ? 'Thinking...' : 'AI Mentor Hint'}
                </button>
             </div>
             <button 
                onClick={() => onSubmit(code)}
                className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-play"></i>
                Submit Code
             </button>
          </div>

          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-slate-900 text-indigo-100 font-mono p-6 outline-none resize-none leading-relaxed text-sm"
              spellCheck={false}
            />
            
            {/* AI Hint Popup */}
            {aiHint && (
              <div className="absolute bottom-6 left-6 right-6 bg-indigo-900/90 backdrop-blur border border-indigo-500/30 rounded-2xl p-6 text-white shadow-2xl animate-in slide-in-from-bottom-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-indigo-300">
                    <i className="fa-solid fa-robot"></i>
                    AI Mentor Suggestion
                  </div>
                  <button onClick={() => setAiHint(null)} className="text-indigo-400 hover:text-white">
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
                <div className="text-sm leading-relaxed prose prose-invert max-w-none">
                   {aiHint}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;