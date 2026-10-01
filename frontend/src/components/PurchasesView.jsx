import React from 'react';
import { 
  PlayCircle, 
  BookOpen, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  FolderGit2, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PurchasesView({ 
  courses, 
  onSelectCourse, 
  onExploreCatalog 
}) {
  const { purchasedCourseIds } = useAuth();

  const enrolledCourses = courses.filter((c) => 
    purchasedCourseIds.includes(c._id || c.id)
  );

  if (enrolledCourses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-brand-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">No Enrolled Courses Yet</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
          You haven't enrolled in any engineering courses. Choose a specialization from our catalog to start building.
        </p>
        <button
          onClick={onExploreCatalog}
          className="mt-6 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-glow transition-all inline-flex items-center gap-2"
        >
          <span>Explore Architecture Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Active Learning
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pick up right where you left off. All code sandboxes, capstones, and architectural diagrams are ready.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit">
          <CheckCircle className="w-4 h-4" />
          <span>{enrolledCourses.length} Enrolled {enrolledCourses.length === 1 ? 'Course' : 'Courses'}</span>
        </div>
      </div>

      {/* Enrolled Courses Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course, idx) => {
          // Mock progress for realistic feel
          const progressPercent = 25 + ((idx * 27) % 65);

          return (
            <div
              key={course._id || course.id}
              className="rounded-2xl glass-card border border-white/[0.08] overflow-hidden flex flex-col justify-between transition-all hover:border-brand-500/40"
            >
              <div>
                {/* Course Image Header */}
                <div className="relative aspect-video w-full bg-dark-950">
                  <img
                    src={course.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
                  
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[11px] font-mono bg-brand-500/90 text-white font-semibold">
                    {course.category || 'Production'}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                    {course.title}
                  </h3>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>Curriculum Progress</span>
                      <span className="text-brand-300 font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-dark-950 border border-white/[0.05] overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick links to course resources */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button 
                      onClick={() => alert(`Opening GitHub starter template for ${course.title}`)}
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-[11px] font-mono text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-brand-400" />
                      <span>Code Repo</span>
                    </button>
                    <button 
                      onClick={() => alert(`Connecting to Private Discord cohort channel for ${course.title}`)}
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-[11px] font-mono text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Cohort Chat</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Resume Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectCourse(course)}
                  className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-glow transition-all flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume Next Lesson</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
