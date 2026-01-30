
import React, { useState, useEffect } from 'react';
import { Problem, Solution, TraceStep } from '../types';
import { getGeminiAnalysis } from '../services/geminiService';
import Visualizer from './Visualizer';

interface CPWorkspaceProps {
  problem: Problem;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

const CPWorkspace: React.FC<CPWorkspaceProps> = ({ problem, onClose, onSubmit }) => {
  const [solutions, setSolutions] = useState<Solution[]>([
    { id: 'sol-1', name: 'Primary Logic', code: `// Optimized Approach: Hash Map Hash mapping for O(N)\nfunction solve(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}`, language: 'javascript' },
    { id: 'sol-2', name: 'Secondary Approach', code: `// Brute Force: Iterative checking O(N^2)\nfunction solve(nums, target) {\n  for(let i=0; i<nums.length; i++) {\n    for(let j=i+1; j<nums.length; j++) {\n       if(nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n}`, language: 'javascript' }
  ]);
  const [activeSolutionId, setActiveSolutionId] = useState('sol-1');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [activePanel, setActivePanel] = useState<'trace' | 'visualize' | 'analysis'>('trace');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const activeSolution = solutions.find(s => s.id === activeSolutionId)!;

  const updateCode = (code: string) => {
    setSolutions(solutions.map(s => s.id === activeSolutionId ? { ...s, code } : s));
  };

  const addSolution = () => {
    const id = `sol-${solutions.length + 1}`;
    setSolutions([...solutions, { id, name: `Fork ${solutions.length}`, code: activeSolution.code, language: 'javascript' }]);
    setActiveSolutionId(id);
  };

  const handleAIAction = async (type: 'hint' | 'failure') => {
    setLoadingAI(true);
    const res = await getGeminiAnalysis(type, {
      problemTitle: problem.title,
      problemDescription: problem.description,
      userCode: activeSolution.code,
      error: type === 'failure' ? "Runtime Performance Alert: Complexity threshold exceeded on large datasets" : undefined
    });
    setAiResponse(res);
    setLoadingAI(false);
    setActivePanel('analysis');
  };

  return (
    <div className={`fixed inset-0 z-50 bg-white flex flex-col ${isFocusMode ? 'p-0' : 'p-3 md:p-6'}`}>
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border border-slate-200 bg-white rounded-t-3xl shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
               <i className="fa-solid fa-microscope text-white text-lg"></i>
             </div>
             <div>
               <h2 className="text-sm font-black text-slate-800 tracking-tight">{problem.title}</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Analysis Mode</p>
             </div>
          </div>
          <div className="h-8 w-px bg-slate-100"></div>
          <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
            {solutions.map(sol => (
              <button 
                key={sol.id}
                onClick={() => setActiveSolutionId(sol.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSolutionId === sol.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {sol.name}
              </button>
            ))}
            <button onClick={addSolution} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><i className="fa-solid fa-plus-circle"></i></button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`p-3 rounded-xl text-slate-400 hover:text-slate-800 transition-all ${isFocusMode ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'hover:bg-slate-50'}`}
            title="Focus Lens"
          >
            <i className="fa-solid fa-maximize"></i>
          </button>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"><i className="fa-solid fa-xmark"></i></button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden bg-white rounded-b-3xl border-x border-b border-slate-200 shadow-xl shadow-slate-200/50">
        
        {/* Left Panel: Problem Context */}
        {!isFocusMode && (
          <div className="w-[480px] border-r border-slate-100 flex flex-col bg-slate-50/50 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-file-invoice text-indigo-400"></i>
                  Problem Specifications
                </h4>
                <div className="prose prose-slate prose-sm max-w-none">
                  <p className="text-slate-600 leading-relaxed font-medium">{problem.description}</p>
                </div>
              </section>

              <div className="h-[380px] animate-pulse-indigo">
                 <Visualizer type={problem.visualizationType || 'array'} data={null} />
              </div>
              
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Efficiency Comparative</h4>
                 <div className="space-y-6">
                    <div>
                       <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                          <span className="text-slate-800">Approach A (Optimal)</span>
                          <span className="text-indigo-600">O(N)</span>
                       </div>
                       <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                          <div className="h-full bg-indigo-500 w-[20%] shadow-[0_0_10px_rgba(99,102,241,0.3)]"></div>
                       </div>
                    </div>
                    <div>
                       <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                          <span className="text-slate-800">Approach B (Baseline)</span>
                          <span className="text-slate-400">O(N²)</span>
                       </div>
                       <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                          <div className="h-full bg-slate-200 w-[90%]"></div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Center: Logic Studio */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="h-12 bg-white border-b border-slate-100 flex items-center justify-between px-6">
            <div className="flex gap-6">
              <button className="text-[11px] font-black text-indigo-600 border-b-2 border-indigo-600 h-12 flex items-center tracking-widest">LOGIC.JS</button>
              <button className="text-[11px] font-bold text-slate-400 h-12 flex items-center hover:text-slate-600 tracking-widest">TEST_BENCH.JSON</button>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleAIAction('hint')}
                className="text-[10px] bg-white text-indigo-600 border border-indigo-100 px-4 py-1.5 rounded-xl font-black hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                AI REASONER
              </button>
              <button 
                onClick={() => onSubmit(activeSolution.code)}
                className="text-[10px] bg-slate-900 text-white px-6 py-2 rounded-xl font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
              >
                <i className="fa-solid fa-bolt-lightning"></i>
                RUN ANALYSIS
              </button>
            </div>
          </div>

          <div className="flex-1 relative flex overflow-hidden">
             {/* Line Numbers */}
             <div className="w-14 bg-slate-50/50 border-r border-slate-100 flex flex-col items-center py-6 text-[11px] text-slate-300 font-mono select-none">
                {Array.from({ length: 40 }).map((_, i) => <div key={i} className="h-7 flex items-center">{String(i + 1).padStart(2, '0')}</div>)}
             </div>
             
             <textarea
                value={activeSolution.code}
                onChange={(e) => updateCode(e.target.value)}
                className="flex-1 bg-white text-slate-700 p-6 font-mono text-sm outline-none resize-none leading-7 placeholder-slate-200 font-medium"
                spellCheck={false}
             />

             {/* Functional Panels Toggle */}
             <div className="w-12 bg-white border-l border-slate-100 flex flex-col items-center py-8 gap-8">
                <button onClick={() => setActivePanel('trace')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${activePanel === 'trace' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-300 hover:text-slate-600'}`} title="Tracing Output"><i className="fa-solid fa-shoe-prints text-sm"></i></button>
                <button onClick={() => setActivePanel('visualize')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${activePanel === 'visualize' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-300 hover:text-slate-600'}`} title="Memory Allocation"><i className="fa-solid fa-microchip text-sm"></i></button>
                <button onClick={() => setActivePanel('analysis')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${activePanel === 'analysis' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-300 hover:text-slate-600'}`} title="System Reasoning"><i className="fa-solid fa-brain text-sm"></i></button>
             </div>
          </div>
          
          {/* Console / Monitoring Area */}
          <div className="h-60 border-t border-slate-200 bg-slate-50/80 flex">
             <div className="w-72 border-r border-slate-200 p-6 overflow-y-auto custom-scrollbar">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Execution Timeline</h4>
                <div className="space-y-2.5">
                   {[1, 2, 3, 4, 5].map(step => (
                      <div key={step} className={`p-3 rounded-xl border text-[11px] font-mono cursor-pointer transition-all ${step === 2 ? 'bg-white border-indigo-200 text-indigo-700 shadow-sm' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600'}`}>
                         <span className="font-black opacity-50 mr-2">T+{step}ms</span>
                         Line {step + 2} <br/>
                         <div className="text-[10px] mt-1 opacity-60">scope: map[2] = 0</div>
                      </div>
                   ))}
                </div>
             </div>
             <div className="flex-1 p-8 overflow-y-auto bg-white/40">
                {activePanel === 'analysis' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                      <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Internal Reasoning Log</h4>
                    </div>
                    {loadingAI ? (
                       <div className="flex items-center gap-4 text-slate-400 py-6">
                          <i className="fa-solid fa-circle-notch animate-spin text-xl text-indigo-500"></i>
                          <div className="text-xs font-bold italic tracking-tight">Synthesizing algorithmic patterns and state transitions...</div>
                       </div>
                    ) : aiResponse ? (
                      <div className="text-sm text-slate-600 prose prose-slate max-w-none leading-relaxed font-medium">
                        {aiResponse}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 opacity-30">
                        <i className="fa-solid fa-brain text-4xl mb-4"></i>
                        <p className="text-xs font-bold uppercase tracking-widest">Awaiting Analysis Directive</p>
                      </div>
                    )}
                  </div>
                )}
                
                {activePanel === 'trace' && (
                   <div className="space-y-4 font-mono text-xs">
                      <div className="flex items-center gap-3 text-emerald-600 font-black">
                        <i className="fa-solid fa-circle-check"></i>
                        <span>BASELINE_VALIDATION_PASSED: [2,7,11,15] -> 9</span>
                      </div>
                      <div className="pl-6 border-l-2 border-slate-100 space-y-3">
                        <div className="text-indigo-600 font-bold tracking-tight">↳ INVOKING: solve(target: 9)</div>
                        <div className="text-slate-400 grid grid-cols-[100px_1fr] gap-4">
                           <span className="font-bold">SNAPSHOT_0:</span>
                           <span>[i=0, complement=7, cache_miss, store(2:0)]</span>
                        </div>
                        <div className="text-slate-400 grid grid-cols-[100px_1fr] gap-4">
                           <span className="font-bold">SNAPSHOT_1:</span>
                           <span>[i=1, complement=2, cache_hit(0), terminate_return(0,1)]</span>
                        </div>
                      </div>
                      <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                         <div className="flex gap-8">
                            <div>
                               <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Latency</div>
                               <div className="text-xs font-black text-slate-800">0.084ms</div>
                            </div>
                            <div>
                               <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Throughput</div>
                               <div className="text-xs font-black text-slate-800">1.2M op/s</div>
                            </div>
                         </div>
                         <i className="fa-solid fa-wave-square text-indigo-100 text-2xl"></i>
                      </div>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPWorkspace;
