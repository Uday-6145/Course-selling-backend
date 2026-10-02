import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function CourseModal({ course, onClose, onBuy }) {
  const { isPurchased } = useAuth();
  const enrolled = isPurchased(course._id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Course Thumbnail Image */}
        <div className="w-full h-52 rounded-lg overflow-hidden mb-4 bg-gray-100">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Enrollment Status Pill */}
        <div className="mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${enrolled ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
            {enrolled ? '✓ You Own This Course' : 'Available for Purchase'}
          </span>
        </div>

        {/* Course Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {course.title}
        </h2>

        {/* Course Full Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
          {course.description}
        </p>

        {/* Bottom Actions Bar */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>

            <span className="text-xs text-gray-500 block">Course Price</span>
            <span className="text-2xl font-bold text-gray-900">₹{course.price}</span>
          </div>

          <div>
            {enrolled ? (
              <button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-6 py-2 rounded-full"
              >
                Close
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onBuy(course);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-7 py-2 rounded-full shadow-sm"
              >
                Enroll Now
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
