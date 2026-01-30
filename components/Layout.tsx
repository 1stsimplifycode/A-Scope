
import React from 'react';
import { User, Role } from '../types';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, children, activeTab, setActiveTab, onLogout }) => {
  const isStudent = user.role === Role.STUDENT;

  const navItems = isStudent 
    ? [
        { id: 'dashboard', label: 'Home', icon: 'fa-house' },
        { id: 'problems', label: 'Challenges', icon: 'fa-microscope' },
        { id: 'projects', label: 'Project Lab', icon: 'fa-flask-vial' },
        { id: 'events', label: 'Field Events', icon: 'fa-calendar-check' },
        { id: 'rewards', label: 'Rewards Hub', icon: 'fa-trophy' },
        { id: 'profile', label: 'Analyst Profile', icon: 'fa-id-card' }
      ]
    : [
        { id: 'admin-dashboard', label: 'Analytics Hub', icon: 'fa-chart-pie' },
        { id: 'manage-problems', label: 'Content Studio', icon: 'fa-layer-group' },
        { id: 'student-roster', label: 'Performance Map', icon: 'fa-users-gear' }
      ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-100">
              <i className="fa-solid fa-magnifying-glass-chart text-white text-lg"></i>
            </div>
            <h1 className="font-black text-xl text-slate-800 tracking-tight leading-none">
              A<span className="text-indigo-600">-</span>Scope
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-sm`}></i>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white ring-1 ring-slate-200 shadow-sm flex items-center justify-center text-indigo-600">
              <i className="fa-solid fa-user-ninja"></i>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[11px] font-bold text-slate-800 truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <i className="fa-solid fa-fire text-orange-500 text-[10px]"></i>
                 <span className="text-[10px] font-black text-slate-400 tracking-tighter">{user.streak} DAY STREAK</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full mt-4 flex items-center gap-3 px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
          >
            <i className="fa-solid fa-power-off"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="md:hidden flex items-center gap-2">
             <i className="fa-solid fa-magnifying-glass-chart text-indigo-600 text-2xl"></i>
             <span className="font-black text-slate-800 text-lg">A-Scope</span>
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden md:block">
            {navItems.find(i => i.id === activeTab)?.label || 'System Overview'}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
               <i className="fa-solid fa-coins text-indigo-600 text-xs"></i>
               <span className="text-xs font-black text-indigo-700">{user.points}</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <i className="fa-solid fa-bell"></i>
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto p-6 md:p-10">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
