import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Award, LogOut, User, 
  ShieldCheck, FolderPlus, PlusCircle, HelpCircle, Users 
} from 'lucide-react';

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/20">
            S
          </div>
          <span className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            SkillAssess
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {user?.role || 'candidate'}
          </span>
          <div className="flex items-center space-x-2 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-xl">
            <User className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-slate-200">{user?.name || 'User'}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-700/50 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Role-Based Sidebar */}
        <aside className="w-64 border-r border-slate-800/80 bg-slate-900/40 p-4 space-y-1 hidden md:block">
          
          {/* Candidate Links */}
          {(!user?.role || user?.role === 'candidate') && (
            <>
              <SidebarLink to="/dashboard" active={isActive('/dashboard')} icon={<LayoutDashboard />} label="Dashboard" />
            </>
          )}

          {/* Recruiter Links */}
          {user?.role === 'recruiter' && (
            <>
              <SidebarLink to="/dashboard" active={isActive('/dashboard')} icon={<LayoutDashboard />} label="Dashboard" />
              <SidebarLink to="/recruiter/create" active={isActive('/recruiter/create')} icon={<PlusCircle />} label="Create Assessment" />
              <SidebarLink to="/recruiter/questions" active={isActive('/recruiter/questions')} icon={<HelpCircle />} label="Question Bank" />
            </>
          )}

          {/* Admin Links */}
          {user?.role === 'admin' && (
            <>
              <SidebarLink to="/admin/dashboard" active={isActive('/admin/dashboard')} icon={<ShieldCheck />} label="Admin Control" />
              <SidebarLink to="/admin/categories" active={isActive('/admin/categories')} icon={<FolderPlus />} label="Manage Categories" />
            </>
          )}

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 bg-slate-950/60 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium text-sm ${
        active 
          ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
      }`}
    >
      {React.cloneElement(icon, { className: 'w-4 h-4 text-indigo-400' })}
      <span>{label}</span>
    </Link>
  );
}