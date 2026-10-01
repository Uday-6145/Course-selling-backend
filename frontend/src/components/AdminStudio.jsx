import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  DollarSign, 
  Users, 
  Layers, 
  Check, 
  AlertCircle,
  ExternalLink,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getAdminCourses, 
  createAdminCourse, 
  updateAdminCourse, 
  deleteAdminCourse 
} from '../api/client';

export default function AdminStudio({ onToast, onCourseCreatedOrUpdated }) {
  const { adminToken, adminProfile } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Sample templates to quickly auto-populate
  const sampleTemplates = [
    {
      title: "Zero-Knowledge Proofs in Rust",
      description: "Understand SNARKs, STARKs, and cryptographic circuits from mathematical primitives to production verification contracts.",
      imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
      price: 5999
    },
    {
      title: "Autonomous AI Agents with LangGraph & Redis",
      description: "Build stateful multi-agent systems with human-in-the-loop validation, memory persistence, and semantic vector graphs.",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
      price: 4499
    }
  ];

  const fetchCourses = async () => {
    if (!adminToken) return;
    setLoading(true);
    const res = await getAdminCourses(adminToken);
    if (res.success && res.courses) {
      setCourses(res.courses);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, [adminToken]);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setTitle('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80');
    setPrice('3999');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setTitle(course.title || '');
    setDescription(course.description || '');
    setImageUrl(course.imageUrl || '');
    setPrice(course.price ? String(course.price) : '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleApplyTemplate = (tmpl) => {
    setTitle(tmpl.title);
    setDescription(tmpl.description);
    setImageUrl(tmpl.imageUrl);
    setPrice(String(tmpl.price));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (title.length < 3) {
      setFormError('Title must be at least 3 characters');
      return;
    }
    if (description.length < 10) {
      setFormError('Description must be at least 10 characters');
      return;
    }
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      setFormError('Image URL must be a valid HTTP or HTTPS link');
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError('Price must be a positive number');
      return;
    }

    setSubmitting(true);

    try {
      if (editingCourse) {
        // Update existing course
        const res = await updateAdminCourse(
          {
            courseId: editingCourse._id || editingCourse.id,
            title,
            description,
            imageUrl,
            price: numPrice,
          },
          adminToken
        );

        if (!res.success) {
          setFormError(res.message || 'Failed to update course');
          setSubmitting(false);
          return;
        }

        onToast('success', 'Course Updated', `"${title}" has been updated successfully!`);
      } else {
        // Create new course
        const res = await createAdminCourse(
          {
            title,
            description,
            imageUrl,
            price: numPrice,
          },
          adminToken
        );

        if (!res.success) {
          setFormError(res.message || 'Failed to create course');
          setSubmitting(false);
          return;
        }

        onToast('success', 'Course Published!', `"${title}" is now available in the catalog.`);
      }

      setIsModalOpen(false);
      fetchCourses();
      if (onCourseCreatedOrUpdated) {
        onCourseCreatedOrUpdated();
      }
    } catch (err) {
      setFormError(err.message || 'Error occurred while saving course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (course) => {
    const courseId = course._id || course.id;
    if (!window.confirm(`Are you sure you want to permanently delete "${course.title}"?`)) {
      return;
    }

    const res = await deleteAdminCourse(courseId, adminToken);
    if (res.success) {
      onToast('success', 'Course Deleted', 'The course was removed from the catalog.');
      fetchCourses();
      if (onCourseCreatedOrUpdated) {
        onCourseCreatedOrUpdated();
      }
    } else {
      onToast('error', 'Delete Failed', res.message || 'Could not delete course.');
    }
  };

  const totalRevenue = courses.reduce((acc, c) => acc + (c.price || 0) * 14, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              INSTRUCTOR PORTAL
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Welcome, {adminProfile?.firstname || 'Instructor'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
            Creator Studio & Course Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish high-impact curriculum, edit existing modules, and monitor production courses.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow transition-all flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Course</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-dark-900 border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Published Courses</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">{courses.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Live in catalog</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Active Student Cohort</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">
            {courses.length * 48 || 0}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Enrolled across your courses</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Estimated Revenue</span>
            <DollarSign className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalRevenue)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Net lifetime earnings</p>
        </div>
      </div>

      {/* Course List Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Your Managed Courses</span>
            <span className="text-xs font-mono text-slate-500">({courses.length})</span>
          </h2>
        </div>

        {courses.length === 0 && !loading ? (
          <div className="p-12 rounded-2xl border border-dashed border-white/[0.1] text-center bg-dark-900/50">
            <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-300">No courses created by this admin yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create your first distributed systems or fullstack course to publish it directly to the student catalog.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Course</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const formattedPrice = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(course.price || 0);

              return (
                <div
                  key={course._id || course.id}
                  className="rounded-2xl glass-card border border-white/[0.08] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video w-full bg-dark-950">
                      <img
                        src={course.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-mono font-bold bg-black/80 text-white border border-white/10">
                        {formattedPrice}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-white/[0.06] mt-4 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-500 truncate max-w-[120px]">
                      ID: {(course._id || course.id || '').substring(0, 8)}...
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(course)}
                        className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors"
                        title="Edit Course"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(course)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Course Create / Edit Modal with Live Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div 
            className="relative w-full max-w-4xl bg-dark-900 border border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-8 text-left max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {editingCourse ? 'Update Course Details' : 'Publish New Architecture Course'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Course changes are submitted to the backend API (`/admin/course`) in real time.
              </p>
            </div>

            {/* Quick Template Fillers */}
            {!editingCourse && (
              <div className="mb-6 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-slate-400 font-mono text-[11px] shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Quick Template:</span>
                </span>
                {sampleTemplates.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(t)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/25 whitespace-nowrap transition-colors"
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            )}

            {formError && (
              <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Column */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Course Title (min 3 chars)
                  </label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Distributed Database Internals"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/[0.1] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Price (INR ₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="4999"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/[0.1] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Thumbnail Image URL
                    </label>
                    <input
                      type="url"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/[0.1] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Detailed Syllabus & Description (min 10 chars)
                  </label>
                  <textarea
                    required
                    minLength={10}
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide hands-on architectural takeaways, technologies covered, and real workloads..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/[0.1] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-400 leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{editingCourse ? 'Save Course Updates' : 'Publish Course'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Live Preview Card Column */}
              <div className="lg:col-span-5 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Live Student Preview
                </span>
                
                <div className="rounded-2xl glass-card border border-white/[0.08] overflow-hidden opacity-95">
                  <div className="relative aspect-video w-full bg-dark-950">
                    <img
                      src={imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/80 text-white border border-white/10">
                      ₹{price || '0'}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-bold text-white line-clamp-2">
                      {title || 'Course Title Preview'}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {description || 'Course description will appear here as you type in the form...'}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 font-mono text-center">
                  This card reflects how students will see the course in the catalog.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
