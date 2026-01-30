
import React from 'react';
import { Problem, Difficulty, ProblemStatus } from '../types';

interface ProblemCardProps {
  problem: Problem;
  isSolved: boolean;
  isAttempted: boolean;
  onSolve: (problem: Problem) => void;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, isSolved, isAttempted, onSolve }) => {
  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case Difficulty.MEDIUM: return 'bg-amber-50 text-amber-600 border-amber-100';
      case Difficulty.HARD: return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const status = isSolved ? ProblemStatus.SOLVED : isAttempted ? ProblemStatus.ATTEMPTED : ProblemStatus.UNSOLVED;

  return (
    <div className={`bg-white rounded-3xl border transition-all p-6 ${isSolved ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/50'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
              status === ProblemStatus.SOLVED ? 'bg-emerald-600 text-white border-emerald-600' : 
              status === ProblemStatus.ATTEMPTED ? 'bg-amber-100 text-amber-700 border-amber-200' : 
              'bg-slate-50 text-slate-400 border-slate-100'
            }`}>
              {status}
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight">{problem.title}</h3>
        </div>
        {isSolved && (
          <div className="bg-emerald-600 text-white h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 rotate-6">
            <i className="fa-solid fa-check-double"></i>
          </div>
        )}
      </div>
      
      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-2">
        {problem.description}
      </p>

      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
        <div className="flex items-center gap-2">
           <i className="fa-solid fa-user-group text-slate-300"></i>
           <span className="text-[10px] font-bold text-slate-400 ml-1">24 Analysts Resolved</span>
        </div>
        <button 
          onClick={() => onSolve(problem)}
          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
            isSolved 
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
            : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-200'
          }`}
        >
          {isSolved ? 'Review Case' : status === ProblemStatus.ATTEMPTED ? 'Resume Investigation' : 'Initialize Analysis'}
        </button>
      </div>
    </div>
  );
};

export default ProblemCard;
