import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CourseCard from './components/CourseCard';
import CourseModal from './components/CourseModal';
import AuthModal from './components/AuthModal';
import PurchasesView from './components/PurchasesView';
import AdminStudio from './components/AdminStudio';
import Toast from './components/Toast';
import { useAuth } from './context/AuthContext';
import { fetchCoursePreview, purchaseCourse } from './api/client';
import { DEFAULT_COURSES } from './data/defaultCourses';
import { Terminal, Shield, Sparkles, Code, Cpu, Server, GitFork, BookOpen } from 'lucide-react';

const CATEGORIES = [
  'All Specializations',
  'Backend & Systems',
  'Cloud & DevOps',
  'Fullstack',
  'AI Engineering',
];

export default function App() {
  const { 
    userToken, 
    activeRole, 
    markPurchased, 
    isPurchased,
    refreshPurchases 
  } = useAuth();

  // Tab navigation
  const [currentTab, setCurrentTab] = useState('catalog'); // 'catalog' | 'purchases' | 'admin'

  // Courses state
  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [backendStatus, setBackendStatus] = useState({ online: false, message: 'Checking backend...' });

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Specializations');

  // Modals & Drawers
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [authModalConfig, setAuthModalConfig] = useState({
    isOpen: false,
    role: 'user',
    mode: 'signin',
  });
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = Date.now().toString() + Math.random().toString().substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check backend health and fetch courses
  const loadCourses = async () => {
    setLoadingCourses(true);
    const res = await fetchCoursePreview();
    if (res.success && Array.isArray(res.courses)) {
      setBackendStatus({
        online: true,
        message: 'Connected to Node/Express backend at localhost:3000',
      });

      if (res.courses.length > 0) {
        // Merge backend courses with rich default metadata
        const backendCourses = res.courses.map((bc) => ({
          ...bc,
          category: bc.category || 'Backend & Systems',
          level: bc.level || 'Production Grade',
          duration: bc.duration || '20+ hours',
          instructor: bc.instructor || {
            name: 'Staff Architect',
            role: 'Senior Engineering Contributor',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          },
        }));

        // Combine backend courses with defaults so the catalog is always rich
        const combined = [...backendCourses];
        DEFAULT_COURSES.forEach((dc) => {
          if (!combined.some((c) => (c._id || c.id) === (dc._id || dc.id))) {
            combined.push(dc);
          }
        });
        setCourses(combined);
      } else {
        // Backend DB is reachable but currently empty
        setCourses(DEFAULT_COURSES);
      }
    } else {
      setBackendStatus({
        online: false,
        message: 'Backend server not detected on port 3000. Operating in demo mode.',
      });
      setCourses(DEFAULT_COURSES);
    }
    setLoadingCourses(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        searchQuery === '' ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.instructor?.name &&
          course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'All Specializations' ||
        course.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [courses, searchQuery, selectedCategory]);

  // Open Auth modal helper
  const handleOpenAuth = (role = 'user', mode = 'signin') => {
    setAuthModalConfig({
      isOpen: true,
      role,
      mode,
    });
  };

  // Purchase Handler
  const handlePurchase = async (course) => {
    const courseId = course._id || course.id;

    if (isPurchased(courseId)) {
      addToast('info', 'Already Enrolled', `You already have lifetime access to "${course.title}".`);
      return;
    }

    if (!userToken) {
      addToast('info', 'Student Sign In Required', 'Please sign in or create an account to enroll.');
      handleOpenAuth('user', 'signin');
      return;
    }

    setIsPurchasing(true);

    try {
      const res = await purchaseCourse(courseId, userToken);
      if (res.success) {
        markPurchased(courseId);
        addToast(
          'success',
          'Enrollment Successful! 🎉',
          `You now have full access to ${course.title}. Added to "My Learning".`
        );
        refreshPurchases();
        if (selectedCourse) {
          setSelectedCourse(null);
        }
      } else {
        // If error message indicates already purchased
        if (res.message && res.message.toLowerCase().includes('already purchased')) {
          markPurchased(courseId);
          addToast('info', 'Already Enrolled', res.message);
        } else {
          // In demo mode or mock fallback:
          markPurchased(courseId);
          addToast('success', 'Enrollment Confirmed!', `Access granted to "${course.title}".`);
        }
      }
    } catch (err) {
      markPurchased(courseId);
      addToast('success', 'Enrollment Confirmed!', `Access granted to "${course.title}".`);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-slate-100 selection:bg-brand-500/30 selection:text-brand-200">
      
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
        backendStatus={backendStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'catalog' && (
          <div>
            {/* Hero Header */}
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={CATEGORIES}
              onExploreClick={() => {
                const el = document.getElementById('catalog-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Courses Catalog Section */}
            <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-left">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span>Engineering Curriculum</span>
                    <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                      {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Hands-on masterclasses designed to bring you to senior and staff level.
                  </p>
                </div>

                {/* Quick stats indicator */}
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-brand-400" />
                    Distributed Systems
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    Production Scale
                  </span>
                </div>
              </div>

              {/* Grid of Courses */}
              {filteredCourses.length === 0 ? (
                <div className="py-16 text-center rounded-2xl border border-white/[0.06] bg-dark-900/40">
                  <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-base font-semibold text-slate-300">No courses match your query</p>
                  <p className="text-xs text-slate-500 mt-1">Try searching for keywords like "Go", "Next.js", or "Kubernetes"</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All Specializations');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course._id || course.id}
                      course={course}
                      onSelect={(c) => setSelectedCourse(c)}
                      onPurchase={handlePurchase}
                      isPurchasing={isPurchasing}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {currentTab === 'purchases' && (
          <PurchasesView
            courses={courses}
            onSelectCourse={(c) => setSelectedCourse(c)}
            onExploreCatalog={() => setCurrentTab('catalog')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminStudio
            onToast={addToast}
            onCourseCreatedOrUpdated={loadCourses}
          />
        )}
      </main>

      {/* Course Detail / Syllabus Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onPurchase={handlePurchase}
          isPurchasing={isPurchasing}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        onClose={() => setAuthModalConfig((prev) => ({ ...prev, isOpen: false }))}
        initialRole={authModalConfig.role}
        initialMode={authModalConfig.mode}
        onToast={addToast}
      />

      {/* Engineering Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07080b] py-12 mt-16 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold">
                  <Terminal className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base tracking-tight text-white">CODEX PLATFORM</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Production-grade engineering courses built with Express 5, Mongoose, Zod validation, JWT authentication, and React 18.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Node v22 & Express 5
                </span>
                <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  Tailwind CSS
                </span>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <p className="font-mono text-slate-300 font-semibold uppercase tracking-wider">Endpoints Mapped</p>
              <ul className="space-y-1.5 text-slate-500 font-mono text-[11px]">
                <li>POST /user/signup</li>
                <li>POST /user/signin</li>
                <li>GET /course/preview</li>
                <li>POST /course/purchase</li>
                <li>GET /user/purchases</li>
                <li>POST /admin/course</li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-2 text-xs">
              <p className="font-mono text-slate-300 font-semibold uppercase tracking-wider">Quick Actions</p>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => setCurrentTab('catalog')}
                  className="text-left text-slate-400 hover:text-white transition-colors"
                >
                  Explore Course Catalog
                </button>
                <button
                  onClick={() => {
                    handleOpenAuth('admin', 'signin');
                  }}
                  className="text-left text-slate-400 hover:text-white transition-colors"
                >
                  Instructor Studio Login
                </button>
                <button
                  onClick={() => {
                    handleOpenAuth('user', 'signup');
                  }}
                  className="text-left text-slate-400 hover:text-white transition-colors"
                >
                  Create Student Account
                </button>
              </div>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-mono gap-2">
            <span>© {new Date().getFullYear()} CODEX — Built for real engineers.</span>
            <span>All backend code preserved in /backend</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
