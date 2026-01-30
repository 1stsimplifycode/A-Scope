
import React, { useState, useEffect } from 'react';
import { User, Problem, Role } from './types';
import { CURRENT_USER, ADMIN_USER, MOCK_PROBLEMS, PHASES, MOCK_EVENTS } from './constants';
import Layout from './components/Layout';
import ProblemCard from './components/ProblemCard';
import CPWorkspace from './components/CPWorkspace';
import AdminDashboard from './views/AdminDashboard';
import { getGeminiAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [attemptedIds, setAttemptedIds] = useState<string[]>([]);
  const [aiResume, setAiResume] = useState<string | null>(null);
  const [loadingResume, setLoadingResume] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('dsa_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setActiveTab(parsed.role === Role.ADMIN ? 'admin-dashboard' : 'dashboard');
      setSolvedIds(parsed.solvedProblemIds || []);
      setAttemptedIds(parsed.attemptedProblemIds || []);
    }
  }, []);

  const handleLogin = (role: Role) => {
    const u = role === Role.ADMIN ? ADMIN_USER : CURRENT_USER;
    setUser(u);
    localStorage.setItem('dsa_user', JSON.stringify(u));
    setActiveTab(role === Role.ADMIN ? 'admin-dashboard' : 'dashboard');
    setSolvedIds(u.solvedProblemIds);
    setAttemptedIds(u.attemptedProblemIds);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dsa_user');
  };

  const handleGenerateResume = async () => {
    if (!user) return;
    setLoadingResume(true);
    const resolvedProblems = MOCK_PROBLEMS.filter(p => solvedIds.includes(p.id));
    const topics = Array.from(new Set(resolvedProblems.map(p => p.topic)));
    const res = await getGeminiAnalysis('resume', {
      name: user.name,
      topics,
      skills: user.skills
    });
    setAiResume(res);
    setLoadingResume(false);
  };

  const handleSubmitCode = (code: string) => {
    if (selectedProblem) {
      if (!solvedIds.includes(selectedProblem.id)) {
        const newSolved = [...solvedIds, selectedProblem.id];
        setSolvedIds(newSolved);
        if (user) {
          const updatedUser = { ...user, solvedProblemIds: newSolved, points: user.points + 100 };
          setUser(updatedUser);
          localStorage.setItem('dsa_user', JSON.stringify(updatedUser));
        }
      }
      setSelectedProblem(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-12 md:p-16 rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200 max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
          <div className="bg-slate-900 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-200 rotate-3">
            <i className="fa-solid fa-magnifying-glass-chart text-white text-4xl"></i>
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tighter">
            A<span className="text-indigo-600 font-black">-</span>Scope
          </h1>
          <p className="text-slate-400 mb-12 text-sm font-bold uppercase tracking-widest">Algorithmic Reasoning Studio</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleLogin(Role.STUDENT)}
              className="group w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] flex items-center justify-center gap-4"
            >
              <span>Initialize Workspace</span>
              <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
            </button>
            <button 
              onClick={() => handleLogin(Role.ADMIN)}
              className="w-full bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-800 font-bold py-5 rounded-2xl transition-all border border-slate-100 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-shield-halved"></i>
              Administrative Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {activeTab === 'dashboard' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
          <div className="bg-white border border-slate-200 rounded-[3rem] p-12 relative overflow-hidden group shadow-xl shadow-slate-200/50">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-colors"></div>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="max-w-xl">
                <div className="flex items-center gap-4 mb-6">
                   <div className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-100">Level {Math.floor(user.points / 500)} Analyst</div>
                   <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Investigator ID: #A-{user.id.toUpperCase()}</div>
                </div>
                <h2 className="text-5xl font-black text-slate-800 mb-6 tracking-tight leading-[0.9]">
                  System Ready,<br/>
                  <span className="text-indigo-600">{user.name.split(' ')[0]}.</span>
                </h2>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setActiveTab('problems')} className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-2xl shadow-slate-200">
                    Active Cases
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-12 bg-slate-50/80 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner">
                 <div className="text-center">
                    <div className="text-5xl font-black text-slate-900 tracking-tighter">{user.streak}</div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-3">Daily Streak</div>
                 </div>
                 <div className="h-20 w-px bg-slate-200"></div>
                 <div className="text-center">
                    <div className="text-5xl font-black text-indigo-600 tracking-tighter">{solvedIds.length}</div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-3">Resolved</div>
                 </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">System Roadmaps</h3>
               <div className="space-y-6">
                  {PHASES.map((phase) => (
                    <div key={phase.week} className={`bg-white border border-slate-100 rounded-[2.5rem] p-8 flex items-center gap-8 transition-all group ${phase.isLocked ? 'opacity-40 border-slate-50' : 'hover:border-indigo-200 hover:shadow-2xl hover:shadow-slate-200'}`}>
                      <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center font-black text-2xl shrink-0 transition-transform group-hover:rotate-6 ${phase.isLocked ? 'bg-slate-50 text-slate-300' : 'bg-indigo-50 text-indigo-600 shadow-inner'}`}>
                        {String(phase.week).padStart(2, '0')}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-black text-slate-800 tracking-tight">{phase.topic}</h4>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-lg mt-1">{phase.description}</p>
                      </div>
                      {!phase.isLocked && (
                        <button onClick={() => setActiveTab('problems')} className="bg-slate-50 text-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      )}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'problems' && (
        <div className="animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Diagnostic Cases</h3>
              <p className="text-slate-500 text-lg font-medium">Resolution states tracked across the diagnostic grid.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {MOCK_PROBLEMS.map(p => (
              <ProblemCard 
                key={p.id} 
                problem={p} 
                isSolved={solvedIds.includes(p.id)} 
                isAttempted={attemptedIds.includes(p.id)}
                onSolve={setSelectedProblem} 
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="animate-in fade-in duration-500 space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/40">
                 <h4 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <i className="fa-solid fa-check-to-slot text-indigo-600"></i>
                    Case Resolvers
                 </h4>
                 <div className="space-y-4">
                    {[
                      { name: 'Sarah Chen', resolved: 142, streak: 45 },
                      { name: 'Marcus Aurelius', resolved: 128, streak: 12 },
                      { name: 'Emily White', resolved: 95, streak: 30 },
                      { name: 'You', resolved: solvedIds.length, streak: user.streak, isMe: true }
                    ].sort((a,b) => b.resolved - a.resolved).map((rank, i) => (
                       <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${rank.isMe ? 'bg-indigo-600 text-white' : 'bg-slate-50 border border-slate-100'}`}>
                          <div className="flex items-center gap-4">
                             <span className="font-black opacity-40">#{i+1}</span>
                             <span className="font-bold">{rank.name}</span>
                          </div>
                          <span className="font-black">{rank.resolved}</span>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/40">
                 <h4 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <i className="fa-solid fa-fire-flame-curved text-orange-500"></i>
                    Persistence Board
                 </h4>
                 <div className="space-y-4">
                    {[
                      { name: 'Sarah Chen', resolved: 142, streak: 45 },
                      { name: 'Marcus Aurelius', resolved: 128, streak: 12 },
                      { name: 'Emily White', resolved: 95, streak: 30 },
                      { name: 'You', resolved: solvedIds.length, streak: user.streak, isMe: true }
                    ].sort((a,b) => b.streak - a.streak).map((rank, i) => (
                       <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${rank.isMe ? 'bg-orange-600 text-white' : 'bg-slate-50 border border-slate-100'}`}>
                          <div className="flex items-center gap-4">
                             <span className="font-black opacity-40">#{i+1}</span>
                             <span className="font-bold">{rank.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <i className="fa-solid fa-fire text-xs"></i>
                             <span className="font-black">{rank.streak} DAYS</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="animate-in fade-in duration-500 grid grid-cols-1 md:grid-cols-3 gap-8">
           {MOCK_EVENTS.map(event => (
              <div key={event.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50 hover:translate-y-[-4px] transition-all group">
                 <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">{event.type}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-slate-300 group-hover:text-indigo-600"></i>
                 </div>
                 <h4 className="text-2xl font-black text-slate-800 mb-2 leading-tight">{event.title}</h4>
                 <p className="text-sm font-bold text-slate-400 mb-6">{event.organizer}</p>
                 <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                       <i className="fa-solid fa-calendar text-indigo-400"></i>
                       {event.date}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                       <i className="fa-solid fa-gift text-emerald-400"></i>
                       {event.prize} Pool
                    </div>
                 </div>
                 <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl group-hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200">
                    Deploy Profile
                 </button>
              </div>
           ))}
        </div>
      )}

      {activeTab === 'projects' && (
         <div className="animate-in fade-in duration-500 space-y-12">
            <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-xl shadow-slate-200/40">
               <h3 className="text-3xl font-black text-slate-800 mb-8">Structural Review Lab</h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Project Identity</label>
                        <input type="text" placeholder="e.g. Distributed Ledger Explorer" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100" />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Diagnostic Description</label>
                        <textarea placeholder="Describe functionality and algorithmic core..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100 h-32"></textarea>
                     </div>
                     <button className="bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Submit for Review</button>
                  </div>
                  <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col items-center justify-center text-center">
                     <i className="fa-solid fa-flask-vial text-5xl text-indigo-200 mb-6"></i>
                     <h4 className="text-xl font-black text-slate-800 mb-2">Awaiting Specimens</h4>
                     <p className="text-sm text-slate-400 font-medium max-w-xs">Submit your project details to receive a deep structural score and AI-driven diagnostic feedback.</p>
                  </div>
               </div>
            </div>
         </div>
      )}

      {activeTab === 'profile' && (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-12">
           <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-10">
                 <div className="relative">
                    <div className="w-32 h-32 rounded-3xl border-4 border-slate-50 ring-2 ring-indigo-100 shadow-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-4xl">
                      <i className="fa-solid fa-user-gear"></i>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl text-xs font-black shadow-lg">Verified</div>
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl font-black text-slate-800 mb-2">{user.name}</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">Technical Investigator • Semester {user.semester}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                       {user.skills.map(s => (
                          <span key={s} className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">{s}</span>
                       ))}
                    </div>
                 </div>
                 <button 
                  onClick={handleGenerateResume}
                  disabled={loadingResume}
                  className="bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50"
                 >
                   {loadingResume ? 'Analyzing Pattern...' : 'Generate AI Resume'}
                 </button>
              </div>
           </div>

           {aiResume && (
              <div className="bg-indigo-900 text-white rounded-[3rem] p-12 shadow-2xl shadow-indigo-200 animate-in slide-in-from-top-6">
                 <div className="flex items-center gap-4 mb-8">
                    <i className="fa-solid fa-id-badge text-3xl text-indigo-300"></i>
                    <h3 className="text-2xl font-black tracking-tight">AI Generated Analyst Profile</h3>
                 </div>
                 <div className="prose prose-invert prose-slate max-w-none whitespace-pre-wrap font-medium leading-relaxed">
                    {aiResume}
                 </div>
              </div>
           )}
        </div>
      )}

      {activeTab === 'admin-dashboard' && <AdminDashboard />}

      {selectedProblem && (
        <CPWorkspace 
          problem={selectedProblem} 
          onClose={() => setSelectedProblem(null)} 
          onSubmit={handleSubmitCode}
        />
      )}
    </Layout>
  );
};

export default App;
