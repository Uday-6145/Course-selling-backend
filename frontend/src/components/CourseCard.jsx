import React from 'react';
import { 
  Clock, 
  BookOpen, 
  Star, 
  Check, 
  ArrowRight, 
  Sparkles,
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CourseCard({ 
  course, 
  onSelect, 
  onPurchase, 
  isPurchasing 
}) {
  const { isPurchased } = useAuth();
  const enrolled = isPurchased(course._id || course.id);

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(course.price || 0);

  return (
    <div className="group relative flex flex-col rounded-2xl glass-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card overflow-hidden">
      
      {/* Course Thumbnail Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-dark-900 border-b border-white/[0.06]">
        <img
          src={course.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
          }}
        />
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent opacity-80" />

        {/* Category & Level Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {course.category && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-dark-950/80 backdrop-blur-md text-brand-300 border border-brand-500/20 shadow-sm">
              {course.category}
            </span>
          )}
          {course.level && (
            <span className="px-2 py-1 rounded-md text-[10px] font-mono uppercase bg-white/10 backdrop-blur-md text-slate-300 border border-white/10">
              {course.level}
            </span>
          )}
        </div>

        {/* Enrolled Status Pill */}
        {enrolled && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-lg">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Enrolled</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2.5">
          {/* Metadata Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              <span>{course.duration || '24+ hours'}</span>
            </div>
            {course.rating && (
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-200">{course.rating}</span>
                <span className="text-slate-500">({course.reviewsCount || 120})</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(course)}
            className="text-base font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Instructor & Price Row */}
        <div className="pt-3 border-t border-white/[0.06] space-y-3">
          
          <div className="flex items-center justify-between">
            {/* Instructor */}
            <div className="flex items-center gap-2">
              <img
                src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={course.instructor?.name || 'Instructor'}
                className="w-6 h-6 rounded-full object-cover border border-white/10"
              />
              <span className="text-xs text-slate-300 font-medium truncate max-w-[130px]">
                {course.instructor?.name || 'Staff Architect'}
              </span>
            </div>

            {/* Price */}
            <div className="text-right">
              <span className="text-lg font-extrabold text-white font-mono tracking-tight">
                {formattedPrice}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onSelect(course)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Syllabus</span>
              <BookOpen className="w-3.5 h-3.5" />
            </button>

            {enrolled ? (
              <button
                onClick={() => onSelect(course)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Course</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onPurchase(course)}
                disabled={isPurchasing}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 active:scale-[0.98] shadow-glow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isPurchasing ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enroll</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
