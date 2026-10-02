import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div>
          <span className="font-bold text-sm text-blue-600 tracking-tight mr-2">CourseApp</span>
          <span>&copy; {new Date().getFullYear()} CourseApp. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#courses" className="hover:text-blue-600 transition-colors">Courses</a>
          <a href="#about" className="hover:text-blue-600 transition-colors">About Us</a>
          <a href="#privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
