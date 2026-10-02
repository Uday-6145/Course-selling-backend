import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userSignIn, userSignUp, adminSignIn, adminSignUp } from '../api';

export default function AuthModal({ initialMode = 'signin', onClose }) {
  const { loginUser, loginAdmin } = useAuth();

  // Role: 'student' or 'admin'
  const [role, setRole] = useState('student');
  // Mode: 'signin' or 'signup'
  const [mode, setMode] = useState(initialMode);

  // Form input state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  // UI state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Simple length validations matching backend
        if (firstname.trim().length < 3 || lastname.trim().length < 3) {
          setError('First and last name must be at least 3 characters.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        const signupFn = role === 'admin' ? adminSignUp : userSignUp;
        const res = await signupFn({ email, password, firstname, lastname });

        if (!res.success) {
          setError(res.error || 'Signup failed');
          setLoading(false);
          return;
        }

        // Auto sign-in after signup
        const signinFn = role === 'admin' ? adminSignIn : userSignIn;
        const loginRes = await signinFn({ email, password });

        if (loginRes.success && loginRes.data?.token) {
          if (role === 'admin') {
            loginAdmin(loginRes.data.token);
          } else {
            loginUser(loginRes.data.token);
          }
          onClose();
        } else {
          setMode('signin');
          setError('Account created! Please sign in with your password.');
        }
      } else {
        // Sign In
        const signinFn = role === 'admin' ? adminSignIn : userSignIn;
        const res = await signinFn({ email, password });

        if (!res.success || !res.data?.token) {
          setError(res.error || 'Invalid email or password');
          setLoading(false);
          return;
        }

        if (role === 'admin') {
          loginAdmin(res.data.token);
        } else {
          loginUser(res.data.token);
        }
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          &times;
        </button>

        {/* Role Selection Tabs */}
        <div className="flex border-b border-gray-200 mb-5">
          <button
            type="button"
            onClick={() => { setRole('student'); setError(null); }}
            className={`flex-1 py-2 text-sm font-semibold text-center border-b-2 ${
              role === 'student'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => { setRole('admin'); setError(null); }}
            className={`flex-1 py-2 text-sm font-semibold text-center border-b-2 ${
              role === 'admin'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Admin / Creator
          </button>
        </div>

        {/* Heading */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'signin' ? 'Sign In to CourseApp' : 'Create an Account'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {role === 'admin' ? 'Manage and create courses' : 'Access your purchased courses'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-2.5 rounded-md text-xs mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharma"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-md font-semibold text-sm text-white mt-2 ${
              role === 'admin'
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Register'}
          </button>
        </form>

        {/* Switch between Signin and Signup */}
        <div className="mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-600">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); }}
                className="text-blue-600 font-semibold hover:underline"
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
