// Centralized API client for communicating with the backend Express server
// In development, Vite automatically proxies relative paths ('/course', '/user', '/admin') to http://localhost:3000

async function request(endpoint, options = {}) {
  // Determine if this is an admin endpoint or a student/user endpoint
  const isAdminRoute = endpoint.startsWith('/admin');

  // Pick the appropriate token from localStorage
  const token = isAdminRoute
    ? localStorage.getItem('adminToken')
    : localStorage.getItem('userToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { token } : {}), // Backend middleware checks req.headers.token
    ...options.headers,
  };

  try {
    const res = await fetch(endpoint, { ...options, headers });

    // Read response text first because some backend endpoints return plain text (res.send)
    // while others return JSON (res.json)
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    // Check for HTTP errors or backend validation errors (e.g. zod safeParse errors)
    if (!res.ok || (data && data.error)) {
      const errorMessage = typeof data === 'string'
        ? data
        : data?.message || data?.error || `Request failed with status ${res.status}`;

      return {
        success: false,
        error: errorMessage,
        details: data?.error,
      };
    }

    return {
      success: true,
      data: typeof data === 'object' ? data : { message: text },
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Network error: could not connect to server',
    };
  }
}

/* ==========================================================================
   Public & Course Endpoints
   ========================================================================== */

// Fetch all available courses for preview (no auth required)
export function fetchCoursePreview() {
  return request('/course/preview');
}

/* ==========================================================================
   User Authentication & Purchases
   ========================================================================== */

// User Signup
export function userSignUp({ email, password, firstname, lastname }) {
  return request('/user/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, firstname, lastname }),
  });
}

// User Signin: sends credentials and automatically stores userToken on success
export async function userSignIn({ email, password }) {
  const result = await request('/user/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (result.success && result.data?.token) {
    localStorage.setItem('userToken', result.data.token);
  }

  return result;
}

// User Signout
export function userSignOut() {
  localStorage.removeItem('userToken');
}

// Purchase a Course (Requires user token)
export function purchaseCourse(courseId) {
  return request('/course/purchase', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  });
}

// Get User's Purchased Courses (Requires user token)
export function getUserPurchases() {
  return request('/user/purchases');
}

/* ==========================================================================
   Admin Endpoints
   ========================================================================== */

// Admin Signup
export function adminSignUp({ email, password, firstname, lastname }) {
  return request('/admin/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, firstname, lastname }),
  });
}

// Admin Signin: sends credentials and automatically stores adminToken on success
export async function adminSignIn({ email, password }) {
  const result = await request('/admin/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (result.success && result.data?.token) {
    localStorage.setItem('adminToken', result.data.token);
  }

  return result;
}

// Admin Signout
export function adminSignOut() {
  localStorage.removeItem('adminToken');
}

// Fetch Admin's Created Courses (Requires admin token)
export function getAdminCourses() {
  return request('/admin/course/bulk');
}

// Create New Course (Requires admin token)
export function createAdminCourse({ title, description, imageUrl, price }) {
  return request('/admin/course', {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      imageUrl,
      price: Number(price),
    }),
  });
}

// Update Existing Course (Requires admin token)
export function updateAdminCourse({ courseId, title, description, imageUrl, price }) {
  return request('/admin/course', {
    method: 'PUT',
    body: JSON.stringify({
      courseId,
      title,
      description,
      imageUrl,
      price: price !== undefined ? Number(price) : undefined,
    }),
  });
}

// Delete Course (Requires admin token)
export function deleteAdminCourse(courseId) {
  return request('/admin/course', {
    method: 'DELETE',
    body: JSON.stringify({ courseId }),
  });
}
