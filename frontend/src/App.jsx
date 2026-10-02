import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CourseCard from './components/CourseCard';
import CourseModal from './components/CourseModal';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { fetchCoursePreview, purchaseCourse } from './api';

const CATEGORIES = ['All', 'Web Development', 'Data Structures', 'Backend', 'System Design'];

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'purchases' | 'admin'
  const [authModalState, setAuthModalState] = useState(null); // 'signin' | 'signup' | null
  const [selectedCourse, setSelectedCourse] = useState(null); // Course currently open in detail modal
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Search and Category Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { activeRole, isLoggedIn, isPurchased, markPurchased } = useAuth();

  // Load courses from backend API
  const loadCourses = async () => {
    setLoading(true);
    const res = await fetchCoursePreview();
    if (res.success && res.data.courses) {
      setCourses(res.data.courses);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Handle Course Purchase
  const handleBuy = async (course) => {
    if (!isLoggedIn) {
      setAuthModalState('signin');
      return;
    }

    if (activeRole === 'admin') {
      alert('You are signed in as an Admin. Please sign in as a Student to purchase courses.');
      return;
    }

    const res = await purchaseCourse(course._id);

    if (res.success) {
      markPurchased(course._id);
      setMessage({ type: 'success', text: `Successfully enrolled in "${course.title}"!` });
    } else {
      setMessage({ type: 'error', text: res.error || 'Could not complete purchase' });
    }

    setTimeout(() => setMessage(null), 4000);
  };

  // Filter courses for "My Purchases" tab
  const purchasedCourses = courses.filter((c) => isPurchased(c._id));

  // Determine the base list based on active tab
  const baseList = activeTab === 'purchases' ? purchasedCourses : courses;

  // Filter by Search Query & Category
  const displayedCourses = baseList.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      course.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      course.description.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(mode) => setAuthModalState(mode)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">

        {/* Success or Error Notification */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm font-medium flex items-center justify-between shadow-sm ${message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
              }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="font-bold text-lg">&times;</button>
          </div>
        )}

        {/* Tab 1: Admin Panel */}
        {activeTab === 'admin' ? (
          <AdminPanel onCourseCreated={loadCourses} />
        ) : (
          <>


            {/* Search Bar & Category Filter Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">

              {/* Search Input */}
              <div className="w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search courses by keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 bg-gray-50/50"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Heading */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'purchases' ? 'My Enrolled Courses' : 'All Available Courses'}
              </h2>
              <span className="text-xs font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                {activeTab === 'purchases' ? `${purchasedCourses.length} Enrolled` : `${displayedCourses.length} Courses`}
              </span>
            </div>

            {/* Course Grid */}
            {loading ? (
              <div className="text-center py-16 text-gray-500 font-medium">
                Loading courses...
              </div>
            ) : activeTab === 'purchases' && purchasedCourses.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-2">No courses enrolled yet</h3>
                <p className="text-sm text-gray-500 mb-5">Browse the catalog to find your next course!</p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2 rounded-full"
                >
                  Browse Courses
                </button>
              </div>
            ) : displayedCourses.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-2">No courses found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchTerm
                    ? `No courses matched "${searchTerm}". Try another keyword or clear your search.`
                    : 'No courses available under this category.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="text-xs text-blue-600 font-semibold underline"
                  >
                    Clear Search & Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onBuy={handleBuy}
                    onSelect={(c) => setSelectedCourse(c)}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Course Detail & Learning Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onBuy={handleBuy}
        />
      )}

      {/* Auth Modal */}
      {authModalState && (
        <AuthModal
          initialMode={authModalState}
          onClose={() => setAuthModalState(null)}
        />
      )}
    </div>
  );
}
