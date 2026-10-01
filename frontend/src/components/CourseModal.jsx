import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Clock, 
  BookOpen, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Code2, 
  Award,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CourseModal({ 
  course, 
  onClose, 
  onPurchase, 
  isPurchasing 
}) {
  const { isPurchased } = useAuth();
  const [expandedModule, setExpandedModule] = useState(0);

  if (!course) return null;

  const enrolled = isPurchased(course._id || course.id);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(course.price || 0);

  const modules = course.modules || [
    { title: "Architectural Foundations & Core Principles", duration: "4.5 hrs", lessons: 6 },
    { title: "Building the Core Engine & Concurrency Primitives", duration: "7.0 hrs", lessons: 10 },
    { title: "Fault-Tolerance, Benchmarks & Stress Testing", duration: "6.5 hrs", lessons: 8 },
    { title: "Production Deployment, Helm & Observability", duration: "8.0 hrs", lessons: 12 },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative w-full max-w-4xl bg-dark-900 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-dark-950/80 text-slate-300 hover:text-white border border-white/10 hover:bg-dark-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-b from-dark-850 to-dark-900 border-b border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {course.category || 'Engineering'}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono uppercase bg-white/5 text-slate-300 border border-white/10">
              {course.level || 'Intermediate'}
            </span>
            {course.duration && (
              <span className="px-2.5 py-1 rounded-md text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {course.duration}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {course.title}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {course.description}
          </p>

          {/* Instructor & Price Row */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3">
              <img
                src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={course.instructor?.name || 'Instructor'}
                className="w-10 h-10 rounded-full object-cover border border-brand-500/30"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  {course.instructor?.name || 'Staff Engineering Lead'}
                </p>
                <p className="text-xs text-slate-400">
                  {course.instructor?.role || 'Senior Distributed Systems Architect'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase font-mono">Full Lifetime Access</p>
                <p className="text-2xl font-black text-white font-mono">{formattedPrice}</p>
              </div>

              {enrolled ? (
                <div className="px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-sm font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Enrolled & Active</span>
                </div>
              ) : (
                <button
                  onClick={() => onPurchase(course)}
                  disabled={isPurchasing}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-glow transition-all active:scale-95 disabled:opacity-50"
                >
                  {isPurchasing ? 'Processing...' : 'Enroll in Course'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-left">
          
          {/* What you will build section */}
          <div>
            <h3 className="text-sm font-mono uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-400" />
              <span>Production Capstone Projects</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-dark-850 border border-white/[0.06]">
                <p className="text-sm font-semibold text-white">Fault-Tolerant Distributed Node</p>
                <p className="text-xs text-slate-400 mt-1">
                  Implement heartbeats, log replication, snapshotting, and leader re-election under network partitions.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-dark-850 border border-white/[0.06]">
                <p className="text-sm font-semibold text-white">High-Throughput Ingestion Pipeline</p>
                <p className="text-xs text-slate-400 mt-1">
                  Benchmark and tune worker pools handling 50k requests/second with zero memory leaks.
                </p>
              </div>
            </div>
          </div>

          {/* Curriculum Accordion */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-mono uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-400" />
                <span>Verified Curriculum Syllabus</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {modules.length} Modules • {modules.reduce((acc, m) => acc + (m.lessons || 6), 0)} Lessons
              </span>
            </div>

            <div className="space-y-3">
              {modules.map((mod, idx) => {
                const isExpanded = expandedModule === idx;
                return (
                  <div 
                    key={idx}
                    className="rounded-xl border border-white/[0.06] bg-dark-850 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedModule(isExpanded ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-white/[0.05] text-slate-400 text-xs font-mono flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-200">
                          {mod.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                        <span>{mod.duration}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-white/[0.04] space-y-2 text-xs text-slate-400 font-mono">
                        <div className="flex items-center justify-between py-1">
                          <span className="text-slate-300">01. Setup, Environment & Test Harness</span>
                          <span className="text-emerald-400 font-sans font-semibold">Free Preview</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-slate-300">02. Data Structures & Memory Alignment</span>
                          <span>35 mins</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-slate-300">03. Thread Safety & Mutex Contention Profiling</span>
                          <span>45 mins</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-slate-300">04. Automated Benchmark & Fuzz Testing</span>
                          <span>50 mins</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificate & Guarantee Note */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Verified Certificate of Completion</p>
              <p className="text-xs text-slate-400">
                Receive an industry-verifiable cryptographic certificate upon passing all capstone tests.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
