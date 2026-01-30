
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const AdminDashboard: React.FC = () => {
  const weekData = [
    { week: 'W1', submissions: 450, completions: 380 },
    { week: 'W2', submissions: 520, completions: 410 },
    { week: 'W3', submissions: 310, completions: 290 },
    { week: 'W4', submissions: 0, completions: 0 },
  ];

  const topicData = [
    { name: 'Arrays', value: 400, color: '#6366f1' },
    { name: 'Strings', value: 300, color: '#f59e0b' },
    { name: 'Linked Lists', value: 200, color: '#10b981' },
    { name: 'Stacks', value: 150, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Students</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-800">1,248</h3>
            <span className="text-xs text-green-500 font-bold mb-1"><i className="fa-solid fa-arrow-trend-up mr-1"></i>+12%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Submissions (Week 3)</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-800">8,421</h3>
            <span className="text-xs text-amber-500 font-bold mb-1"><i className="fa-solid fa-bolt mr-1"></i>Active</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Avg. Success Rate</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-800">74%</h3>
            <span className="text-xs text-slate-400 mb-1">Across all phases</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Current Active Phase</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-indigo-600">Phase 3</h3>
            <span className="text-xs text-indigo-400 mb-1 font-medium">Stacks/Queues</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-6">Submission Activity by Week</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="submissions" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="completions" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs font-semibold">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-full"></div> Submissions</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Successes</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-6">Problems Solved by Topic</h4>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 pl-4">
              {topicData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.value} submissions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-bold text-slate-800">Top Performing Students</h4>
          <button className="text-indigo-600 text-sm font-semibold hover:underline">View Full Roster</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Semester</th>
              <th className="px-6 py-4">Solved</th>
              <th className="px-6 py-4">Success Rate</th>
              <th className="px-6 py-4">Latest Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {[
              { name: 'John Doe', sem: 4, solved: 18, rate: '92%', last: '2h ago' },
              { name: 'Emily Chen', sem: 6, solved: 22, rate: '88%', last: '5m ago' },
              { name: 'Marcus Aurelius', sem: 4, solved: 15, rate: '95%', last: '1d ago' },
              { name: 'Sarah Connor', sem: 6, solved: 25, rate: '79%', last: '12m ago' },
            ].map((st, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <span className="font-semibold text-slate-700">{st.name}</span>
                </td>
                <td className="px-6 py-4 text-slate-500">{st.sem}</td>
                <td className="px-6 py-4 font-bold text-slate-700">{st.solved}</td>
                <td className="px-6 py-4 text-emerald-600 font-bold">{st.rate}</td>
                <td className="px-6 py-4 text-slate-400">{st.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
