import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Terminal, 
  BookOpen, 
  Layers, 
  Sparkles, 
  User, 
  ShieldCheck, 
  LogOut, 
  GraduationCap 
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  onOpenAuth, 
  backendStatus 
}) {
  const { 
    userToken, 
    adminToken, 
    userProfile, 
    adminProfile, 
    activeRole, 
    setActiveRole, 
    logoutUser, 
    logoutAdmin,
    purchasedCourseIds 
  } = useAuth();

  const isUserLoggedIn = Boolean(userToken);
  const isAdminLoggedIn = Boolean(adminToken);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090a0f]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setCurrentTab('catalog')} 
              className="flex items-center gap-3 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-700 flex items-center justify-center text-white shadow-glow transition-transform group-hover:scale-105">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-brand-400 transition-colors">
                    CODEX
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    v1.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono tracking-wider">
                  SYSTEMS & ARCHITECTURE
                </p>
              </div>
            </button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-4 border-l border-white/[0.08] pl-6">
              <button
                onClick={() => setCurrentTab('catalog')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentTab === 'catalog'
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <BookOpen className="w-4 h-4 text-brand-400" />
                <span>Catalog</span>
              </button>

              <button
                onClick={() => {
                  if (!isUserLoggedIn) {
                    onOpenAuth('user', 'signin');
                  } else {
                    setCurrentTab('purchases');
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                  currentTab === 'purchases'
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>My Learning</span>
                {purchasedCourseIds.length > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {purchasedCourseIds.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  if (!isAdminLoggedIn) {
                    onOpenAuth('admin', 'signin');
                  } else {
                    setActiveRole('admin');
                    setCurrentTab('admin');
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentTab === 'admin'
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Creator Studio</span>
                {isAdminLoggedIn && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                )}
              </button>
            </nav>
          </div>

          {/* Right Section: Status Indicator & User Actions */}
          <div className="flex items-center gap-3">
            {/* Backend Connectivity Status Pill */}
            <div 
              title={backendStatus.message}
              className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono border ${
                backendStatus.online 
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-950/30 text-amber-300 border-amber-500/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${backendStatus.online ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              <span>{backendStatus.online ? 'API Live' : 'Demo Mode'}</span>
            </div>

            {/* User Profile / Auth State */}
            {isUserLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs uppercase">
                    {userProfile?.firstname ? userProfile.firstname.charAt(0) : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-200 leading-tight">
                      {userProfile?.firstname ? `${userProfile.firstname} ${userProfile?.lastname || ''}` : 'Student'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">Student Account</p>
                  </div>
                </div>
                <button
                  onClick={logoutUser}
                  title="Sign out of student account"
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isAdminLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-xs uppercase">
                    {adminProfile?.firstname ? adminProfile.firstname.charAt(0) : 'A'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-indigo-200 leading-tight">
                      {adminProfile?.firstname ? `${adminProfile.firstname} ${adminProfile?.lastname || ''}` : 'Creator'}
                    </p>
                    <p className="text-[10px] text-indigo-400 font-mono">Admin Role</p>
                  </div>
                </div>
                <button
                  onClick={logoutAdmin}
                  title="Sign out of admin account"
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('user', 'signin')}
                  className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('user', 'signup')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-500 hover:bg-brand-600 text-white shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Join Codex
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
