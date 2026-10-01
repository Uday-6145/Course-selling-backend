import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { userSignUp, userSignIn, adminSignUp, adminSignIn } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialRole = 'user', 
  initialMode = 'signin',
  onToast 
}) {
  const { loginUser, loginAdmin } = useAuth();

  const [role, setRole] = useState(initialRole); // 'user' | 'admin'
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handlePreFill = (selectedRole) => {
    if (selectedRole === 'admin') {
      setEmail('creator@codex.internal');
      setPassword('admin_pass123');
      setFirstname('Alexander');
      setLastname('Wright');
    } else {
      setEmail('student@codex.dev');
      setPassword('secure_pass123');
      setFirstname('Devon');
      setLastname('Miller');
    }
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (role === 'user') {
        if (mode === 'signup') {
          // User Signup
          const res = await userSignUp({ email, password, firstname, lastname });
          if (!res.success) {
            setErrorMsg(typeof res.message === 'string' ? res.message : 'Signup failed. Please verify fields.');
            setLoading(false);
            return;
          }
          // After signup, attempt signin automatically
          const loginRes = await userSignIn({ email, password });
          if (loginRes.success && loginRes.token) {
            loginUser(loginRes.token, { email, firstname, lastname });
            onToast('success', 'Account Created!', `Welcome to Codex, ${firstname}!`);
            onClose();
          } else {
            setMode('signin');
            onToast('success', 'Account Created!', 'Please sign in with your new credentials.');
          }
        } else {
          // User Signin
          const res = await userSignIn({ email, password });
          if (!res.success || !res.token) {
            setErrorMsg(res.message || 'Invalid email or password');
            setLoading(false);
            return;
          }
          loginUser(res.token, { email, firstname: firstname || email.split('@')[0] });
          onToast('success', 'Welcome back!', 'Signed in as Student.');
          onClose();
        }
      } else {
        // Admin
        if (mode === 'signup') {
          const res = await adminSignUp({ email, password, firstname, lastname });
          if (!res.success) {
            setErrorMsg(typeof res.message === 'string' ? res.message : 'Admin registration failed');
            setLoading(false);
            return;
          }
          const loginRes = await adminSignIn({ email, password });
          if (loginRes.success && loginRes.token) {
            loginAdmin(loginRes.token, { email, firstname, lastname });
            onToast('success', 'Admin Account Created', `Welcome to Creator Studio, ${firstname}!`);
            onClose();
          } else {
            setMode('signin');
            onToast('success', 'Admin Registered!', 'Please sign in to access Creator Studio.');
          }
        } else {
          // Admin Signin
          const res = await adminSignIn({ email, password });
          if (!res.success || !res.token) {
            setErrorMsg(res.message || 'Invalid admin credentials');
            setLoading(false);
            return;
          }
          loginAdmin(res.token, { email, firstname: firstname || 'Creator' });
          onToast('success', 'Creator Studio Active', 'Signed in with Admin permissions.');
          onClose();
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-md bg-dark-900 border border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Role Segmented Selector */}
        <div className="flex rounded-xl bg-dark-950 p-1 border border-white/[0.08] mb-6">
          <button
            type="button"
            onClick={() => { setRole('user'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'user'
                ? 'bg-brand-500 text-white shadow-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => { setRole('admin'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'admin'
                ? 'bg-indigo-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Instructor / Admin</span>
          </button>
        </div>

        {/* Modal Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {role === 'admin' ? 'Instructor Portal' : 'Student Access'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'signin' 
              ? 'Sign in to access your course catalog & purchases' 
              : 'Create an account to enroll and start building'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">First Name (min 3)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="Arjun"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dark-950 border border-white/[0.1] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Last Name (min 3)</label>
                <input
                  type="text"
                  required
                  minLength={3}
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Verma"
                  className="w-full px-3 py-2.5 rounded-xl bg-dark-950 border border-white/[0.1] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@codex.io"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dark-950 border border-white/[0.1] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Password (min 6)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dark-950 border border-white/[0.1] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white text-xs font-semibold shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In to Account' : 'Create Codex Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Pre-fill Helper */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => handlePreFill(role)}
              className="text-[11px] font-mono text-slate-500 hover:text-brand-300 transition-colors inline-flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-brand-400" />
              <span>Fill sample {role === 'admin' ? 'admin' : 'student'} credentials</span>
            </button>
          </div>

        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] text-center">
          {mode === 'signin' ? (
            <p className="text-xs text-slate-400">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); }}
                className="text-brand-400 hover:text-brand-300 font-semibold"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(''); }}
                className="text-brand-400 hover:text-brand-300 font-semibold"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
