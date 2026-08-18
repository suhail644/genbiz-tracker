import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  ArrowUpCircle, 
  ShieldCheck, 
  User, 
  KeyRound, 
  LogOut, 
  PlusCircle, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Save, 
  UserPlus, 
  Layers,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', role: 'Tester' });
  const [tickets, setTickets] = useState([]);

  const loadTickets = async () => {
    if (!currentUser) return;
    const url = currentUser.role === 'Tester' 
      ? `${API_BASE}/tickets?submitted_by=${currentUser.username}`
      : `${API_BASE}/tickets`;
    const res = await fetch(url);
    const data = await res.json();
    setTickets(data);
  };

  useEffect(() => { loadTickets(); }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    });
    const data = await res.json();
    if (res.ok) setCurrentUser(data.user);
    else alert(data.error);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 text-white w-full max-w-md p-8 rounded-2xl shadow-2xl border border-slate-700">
          <div className="mb-6 text-center">
            <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-xl mx-auto flex items-center justify-center mb-3">
              <Layers size={26} />
            </div>
            <h2 className="text-2xl font-bold">Genbiz 25.0 Hub</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to access your tracking workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Access Role</label>
              <div className="relative">
                <select 
                  value={loginForm.role} 
                  onChange={(e) => setLoginForm({ ...loginForm, role: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 pl-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Tester">Tester</option>
                  <option value="Developer">Developer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Enter username" 
                  value={loginForm.username} 
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative flex items-center">
                <KeyRound size={16} className="absolute left-3 text-slate-500" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={loginForm.password} 
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition duration-150 shadow-md shadow-indigo-600/20 mt-2 flex items-center justify-center gap-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight leading-tight">Genbiz 25.0 Tracker</h1>
            <span className="text-xs text-slate-400">Software Verification Portal</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs text-slate-400">Active User</p>
            <p className="text-sm font-medium flex items-center gap-1.5 justify-end">
              {currentUser.username} 
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-normal flex items-center gap-1">
                <ShieldCheck size={12} /> {currentUser.role}
              </span>
            </p>
          </div>
          <button 
            onClick={() => setCurrentUser(null)} 
            className="bg-slate-800 hover:bg-rose-900/40 hover:text-rose-300 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 hover:border-rose-700/50 transition flex items-center gap-1.5"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {currentUser.role === 'Tester' && <TesterPanel user={currentUser} tickets={tickets} onRefresh={loadTickets} />}
        {currentUser.role === 'Developer' && <DeveloperPanel tickets={tickets} onRefresh={loadTickets} />}
        {currentUser.role === 'Admin' && <AdminPanel tickets={tickets} />}
      </main>
    </div>
  );
}

// ----------------- BADGE COMPONENTS WITH ICONS -----------------
const PriorityBadge = ({ priority }) => {
  const configs = {
    High: { color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: <AlertTriangle size={12} /> },
    Medium: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: <AlertCircle size={12} /> },
    Low: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle2 size={12} /> }
  };
  const current = configs[priority] || configs.Low;

  return (
    <span className={`inline-flex items-center gap-1 border text-xs px-2 py-0.5 rounded-full font-medium ${current.color}`}>
      {current.icon}
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const configs = {
    Open: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: <AlertCircle size={12} /> },
    'In Progress': { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: <Clock size={12} /> },
    Resolved: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle2 size={12} /> },
    Closed: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: <ShieldCheck size={12} /> }
  };
  const current = configs[status] || configs.Open;

  return (
    <span className={`inline-flex items-center gap-1.5 border text-xs px-2.5 py-0.5 rounded-full font-medium ${current.color}`}>
      {current.icon}
      {status}
    </span>
  );
};

// ----------------- TESTER VIEW -----------------
function TesterPanel({ user, tickets, onRefresh }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Bug',
    details: '',
    priority: 'Medium'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, submitted_by: user.username })
    });
    setForm({ ...form, details: '' });
    onRefresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Submission Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm lg:col-span-1 h-fit">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <PlusCircle size={18} className="text-indigo-400" /> New Bug or Updation
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
            <div className="relative flex items-center">
              <Calendar size={15} className="absolute left-3 text-slate-500" />
              <input 
                type="date" 
                value={form.date} 
                onChange={e => setForm({...form, date: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
              <select 
                value={form.type} 
                onChange={e => setForm({...form, type: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Bug">Bug</option>
                <option value="Updation">Updation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Priority</label>
              <select 
                value={form.priority} 
                onChange={e => setForm({...form, priority: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Details & Description</label>
            <textarea 
              placeholder="Provide reproduction steps or update requirements..." 
              rows={4} 
              value={form.details} 
              onChange={e => setForm({...form, details: e.target.value})} 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-sm transition flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} /> Submit Ticket
          </button>
        </form>
      </div>

      {/* Ticket List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-2 overflow-hidden shadow-sm">
        <h3 className="text-base font-semibold text-white mb-4">My Submitted Tickets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Details</th>
                <th className="p-3">Status</th>
                <th className="p-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-400">#{t.id}</td>
                  <td className="p-3 font-medium text-white">
                    <span className="inline-flex items-center gap-1.5">
                      {t.type === 'Bug' ? <Bug size={14} className="text-rose-400" /> : <ArrowUpCircle size={14} className="text-sky-400" />}
                      {t.type}
                    </span>
                  </td>
                  <td className="p-3"><PriorityBadge priority={t.priority} /></td>
                  <td className="p-3 max-w-xs truncate">{t.details}</td>
                  <td className="p-3"><StatusBadge status={t.status} /></td>
                  <td className="p-3 text-slate-400 italic">{t.remarks || '—'}</td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr><td colSpan="6" className="p-4 text-center text-slate-500">No tickets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------- DEVELOPER VIEW -----------------
function DeveloperPanel({ tickets, onRefresh }) {
  const [updates, setUpdates] = useState({});

  const handleUpdate = async (id) => {
    const data = updates[id] || {};
    await fetch(`${API_BASE}/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    alert('Ticket updated successfully');
    onRefresh();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Developer Workstation</h3>
          <p className="text-xs text-slate-400">Review reported tickets and push progress updates</p>
        </div>
        <button 
          onClick={onRefresh} 
          className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 flex items-center gap-1.5 transition"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Tester</th>
              <th className="p-3">Details</th>
              <th className="p-3">Status</th>
              <th className="p-3">Developer Remark</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {tickets.map(t => (
              <tr key={t.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono text-slate-400">#{t.id}</td>
                <td className="p-3 font-medium text-white">
                  <span className="inline-flex items-center gap-1.5">
                    {t.type === 'Bug' ? <Bug size={14} className="text-rose-400" /> : <ArrowUpCircle size={14} className="text-sky-400" />}
                    {t.type}
                  </span>
                </td>
                <td className="p-3"><PriorityBadge priority={t.priority} /></td>
                <td className="p-3 text-slate-400">{t.submitted_by}</td>
                <td className="p-3 max-w-xs">{t.details}</td>
                <td className="p-3">
                  <select 
                    defaultValue={t.status} 
                    onChange={e => setUpdates({ ...updates, [t.id]: { ...updates[t.id], status: e.target.value } })}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td className="p-3">
                  <input 
                    type="text" 
                    defaultValue={t.remarks} 
                    placeholder="Add resolution note..." 
                    onChange={e => setUpdates({ ...updates, [t.id]: { ...updates[t.id], remarks: e.target.value } })}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white w-full focus:outline-none focus:border-indigo-500" 
                  />
                </td>
                <td className="p-3 text-right">
                  <button 
                    onClick={() => handleUpdate(t.id)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-md transition inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Save size={13} /> Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------- ADMIN VIEW -----------------
function AdminPanel({ tickets }) {
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'Tester' });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    if (res.ok) {
      alert('User created successfully');
      setNewUser({ username: '', password: '', role: 'Tester' });
    } else {
      alert('Failed to create user');
    }
  };

  return (
    <div className="space-y-6">
      {/* User Creation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <UserPlus size={18} className="text-indigo-400" /> Create System User
        </h3>
        <p className="text-xs text-slate-400 mb-4">Provision accounts for quality testers and developers.</p>
        <form onSubmit={handleCreateUser} className="flex flex-wrap gap-3 items-center">
          <div className="relative flex items-center">
            <User size={15} className="absolute left-3 text-slate-500" />
            <input 
              placeholder="Username" 
              value={newUser.username} 
              onChange={e => setNewUser({...newUser, username: e.target.value})} 
              className="bg-slate-950 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500" 
              required 
            />
          </div>
          <div className="relative flex items-center">
            <KeyRound size={15} className="absolute left-3 text-slate-500" />
            <input 
              type="password" 
              placeholder="Password" 
              value={newUser.password} 
              onChange={e => setNewUser({...newUser, password: e.target.value})} 
              className="bg-slate-950 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500" 
              required 
            />
          </div>
          <select 
            value={newUser.role} 
            onChange={e => setNewUser({...newUser, role: e.target.value})}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value="Tester">Tester</option>
            <option value="Developer">Developer</option>
          </select>
          <button 
            type="submit" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5"
          >
            <UserPlus size={15} /> Add User
          </button>
        </form>
      </div>

      {/* Global Status Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-white mb-4">Global Audit & System Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Reporter</th>
                <th className="p-3">Status</th>
                <th className="p-3">Details</th>
                <th className="p-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-400">#{t.id}</td>
                  <td className="p-3 text-slate-400">{t.date}</td>
                  <td className="p-3 font-medium text-white">
                    <span className="inline-flex items-center gap-1.5">
                      {t.type === 'Bug' ? <Bug size={14} className="text-rose-400" /> : <ArrowUpCircle size={14} className="text-sky-400" />}
                      {t.type}
                    </span>
                  </td>
                  <td className="p-3"><PriorityBadge priority={t.priority} /></td>
                  <td className="p-3 text-slate-300">{t.submitted_by}</td>
                  <td className="p-3"><StatusBadge status={t.status} /></td>
                  <td className="p-3 max-w-xs truncate">{t.details}</td>
                  <td className="p-3 text-slate-400 italic">{t.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}