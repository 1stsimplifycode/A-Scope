
import React from 'react';

interface VisualizerProps {
  type?: 'tree' | 'graph' | 'dp_table' | 'array';
  data: any;
}

const Visualizer: React.FC<VisualizerProps> = ({ type, data }) => {
  if (!type) return (
    <div className="h-full flex items-center justify-center text-slate-400 italic text-sm bg-slate-50 border border-slate-200 rounded-2xl">
      Awaiting execution for structural mapping...
    </div>
  );

  return (
    <div className="h-full w-full bg-white p-8 rounded-3xl overflow-auto border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <i className="fa-solid fa-diagram-project text-indigo-600 text-sm"></i>
          </div>
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
            {type.replace('_', ' ')} Viewport
          </h4>
        </div>
        <div className="flex gap-1.5">
           <button className="text-[10px] font-bold bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">Zoom</button>
           <button className="text-[10px] font-bold bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">Recenter</button>
        </div>
      </div>

      <div className="relative min-h-[300px] flex items-center justify-center">
        {type === 'dp_table' && (
          <div className="grid grid-cols-6 gap-1 bg-slate-200 p-1 border border-slate-200 rounded-lg shadow-inner">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className={`w-14 h-14 flex items-center justify-center text-xs font-mono transition-all rounded-md shadow-sm ${i === 14 ? 'bg-indigo-600 text-white scale-110 z-10' : 'bg-white text-slate-400'}`}>
                {Math.floor(Math.random() * 100)}
              </div>
            ))}
          </div>
        )}

        {type === 'tree' && (
          <div className="flex flex-col items-center gap-12">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 border-4 border-indigo-100 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-indigo-200">10</div>
            <div className="flex gap-20 relative">
              <div className="absolute top-[-30px] left-1/2 w-40 h-px bg-slate-100 -translate-x-1/2"></div>
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-800 font-bold text-sm shadow-sm">5</div>
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-800 font-bold text-sm shadow-sm">15</div>
            </div>
          </div>
        )}

        {type === 'array' && (
          <div className="flex gap-3">
            {[2, 7, 11, 15].map((val, i) => (
              <div key={i} className={`w-16 h-24 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${i < 2 ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                <span className="text-[10px] font-bold text-slate-300 mb-3">#{i}</span>
                <span className={`text-xl font-black ${i < 2 ? 'text-indigo-600' : 'text-slate-700'}`}>{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-10 border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Memory Allocation Map</p>
          <span className="text-[10px] font-bold text-slate-500">Peak: 4.8MB</span>
        </div>
        <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden flex ring-1 ring-slate-100">
          <div className="h-full bg-indigo-500 w-[35%] shadow-sm"></div>
          <div className="h-full bg-emerald-400 w-[25%] opacity-80"></div>
          <div className="h-full bg-amber-400 w-[10%] opacity-80"></div>
        </div>
        <div className="flex gap-6 mt-4">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Heap</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Stack</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-amber-400"></div>
             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Static</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
