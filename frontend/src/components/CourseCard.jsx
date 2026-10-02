import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function CourseCard({ course, onBuy, onSelect }) {
  const { isPurchased } = useAuth();
  const enrolled = isPurchased(course._id);

  return (
    <div 
      onClick={() => onSelect && onSelect(course)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer"
    >
      
      {/* Course Image */}
      <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 font-bold text-lg">
            Course Preview
          </div>
        )}
      </div>

      {/* Course Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-2">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Card Footer: Price & Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block">Price</span>
            <span className="text-xl font-bold text-gray-900">
              ₹{course.price || 499}
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {enrolled ? (
              <button
                onClick={() => onSelect && onSelect(course)}
                className="inline-flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold text-xs rounded-full transition-colors"
              >
                ✓ View Course
              </button>
            ) : (
              <button
                onClick={() => onBuy(course)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-full transition-colors shadow-sm"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
