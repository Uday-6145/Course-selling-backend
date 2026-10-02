import React, { useState, useEffect } from 'react';
import { createAdminCourse, updateAdminCourse, getAdminCourses, deleteAdminCourse } from '../api';

export default function AdminPanel({ onCourseCreated }) {
  // Form input state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Editing state: null when creating a new course, or holds the courseId being edited
  const [editingId, setEditingId] = useState(null);

  // UI state
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  // Fetch all courses created by this admin
  const loadAdminCourses = async () => {
    setLoading(true);
    const res = await getAdminCourses();
    if (res.success && res.data.courses) {
      setMyCourses(res.data.courses);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdminCourses();
  }, []);

  // Set up form to edit an existing course
  const handleStartEdit = (course) => {
    setEditingId(course._id);
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setImageUrl(course.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel edit mode and reset form
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setImageUrl('');
  };

  // Handle Form Submit: Create or Update Course
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlertMsg(null);

    let res;
    if (editingId) {
      // Update existing course (PUT /admin/course)
      res = await updateAdminCourse({
        courseId: editingId,
        title,
        description,
        price: Number(price),
        imageUrl,
      });
    } else {
      // Create new course (POST /admin/course)
      res = await createAdminCourse({
        title,
        description,
        price: Number(price),
        imageUrl,
      });
    }

    if (res.success) {
      setAlertMsg({
        type: 'success',
        text: editingId ? 'Course updated successfully!' : 'Course published successfully!',
      });
      handleCancelEdit();
      loadAdminCourses();
      if (onCourseCreated) onCourseCreated();
    } else {
      setAlertMsg({ type: 'error', text: res.error || 'Failed to save course' });
    }

    setSubmitting(false);
    setTimeout(() => setAlertMsg(null), 4000);
  };

  // Handle Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    const res = await deleteAdminCourse(courseId);
    if (res.success) {
      setAlertMsg({ type: 'success', text: 'Course deleted!' });
      if (editingId === courseId) handleCancelEdit();
      loadAdminCourses();
      if (onCourseCreated) onCourseCreated();
    } else {
      setAlertMsg({ type: 'error', text: res.error || 'Failed to delete' });
    }
    setTimeout(() => setAlertMsg(null), 4000);
  };

  return (
    <div className="space-y-8">
      
      {/* Alert Notification */}
      {alertMsg && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            alertMsg.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {alertMsg.text}
        </div>
      )}

      {/* Form: Create or Edit Course */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId ? 'Edit Course' : 'Create New Course'}
          </h2>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-6">
          {editingId
            ? 'Update the course details below and click Save Changes.'
            : 'Publish a new course to the student catalog with title, price, and thumbnail.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Course Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Complete React & Node Masterclass"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 2999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Image URL (Thumbnail)
            </label>
            <input
              type="url"
              required
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              rows="3"
              placeholder="Explain what students will learn in this course..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className={`font-semibold text-sm px-6 py-2.5 rounded-full shadow-sm text-white disabled:opacity-50 ${
                editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {submitting
                ? 'Saving...'
                : editingId
                ? 'Save Changes'
                : '+ Publish Course'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-full"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Admin's Created Courses List */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Manage Your Courses</h2>
        <p className="text-xs text-gray-500 mb-6">
          Courses you have published to the platform.
        </p>

        {loading ? (
          <p className="text-sm text-gray-500">Loading your courses...</p>
        ) : myCourses.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            You haven't created any courses yet. Use the form above to add your first course!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {myCourses.map((c) => (
              <div key={c._id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={c.imageUrl}
                    alt={c.title}
                    className="w-16 h-12 rounded object-cover bg-gray-100 border border-gray-200"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">{c.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{c.description}</p>
                    <span className="text-xs font-bold text-gray-700">₹{c.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(c)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(c._id)}
                    className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
