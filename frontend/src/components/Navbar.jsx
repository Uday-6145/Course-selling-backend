import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAuth, activeTab, setActiveTab }) {
  const { userToken, adminToken, activeRole, logout, isLoggedIn } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky ">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo and Nav links */}
        <div className="flex items-center gap-8">
          <div
            onClick={() => setActiveTab('catalog')}
            className="cursor-pointer font-bold text-2xl text-blue-600 tracking-tight"
          >
            CourseApp
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-md ${activeTab === 'catalog'
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              All Courses
            </button>

            {userToken && (
              <button
                onClick={() => setActiveTab('purchases')}
                className={`px-3 py-1.5 rounded-md ${activeTab === 'purchases'
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                My Purchases
              </button>
            )}

            {adminToken && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-md ${activeTab === 'admin'
                    ? 'text-purple-600 bg-purple-50 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                {activeRole === 'admin' ? 'Admin' : 'Student'}
              </span>

              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-red-600 px-3 py-1.5 border border-gray-300 rounded-full font-medium hover:border-red-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('signin')}
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 px-3 py-1.5"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
