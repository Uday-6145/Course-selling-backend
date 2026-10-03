// 1. Backend server address
// In production (e.g. Vercel), it uses your live backend URL (VITE_API_URL)
// In local development, it defaults to localhost or your local IP
const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  `http://${window.location.hostname || 'localhost'}:3000`;

// 2. Helper function to send requests to the backend
async function request(endpoint, options = {}) {
  // Check if this is an admin request or a student request
  let token = localStorage.getItem('userToken');
  if (endpoint.startsWith('/admin')) {
    token = localStorage.getItem('adminToken');
  }

  // Setup headers
  const headers = {
    'Content-Type': 'application/json',
  };

  // Attach token if the user is logged in
  if (token) {
    headers.token = token;
  }

  try {
    // Send request using fetch
    const response = await fetch(BACKEND_URL + endpoint, {
      method: options.method || 'GET',
      headers: headers,
      body: options.body,
    });

    // Read the response from the server
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text; // Plain text like "Signup successful!"
    }

    // Check for HTTP errors (like 400 or 403)
    if (!response.ok) {
      const errorMsg = typeof data === 'object' ? data.message || 'Request failed' : data;
      return { success: false, error: errorMsg };
    }

    // Check if backend returned a Zod validation error
    if (data && data.error) {
      return { success: false, error: data.message || 'Validation error' };
    }

    // Success!
    return { success: true, data: data };
  } catch (err) {
    return { success: false, error: 'Could not connect to backend server' };
  }
}

/* ==========================================================================
   Public Course Endpoints
   ========================================================================== */

// Fetch all available courses for preview
export async function fetchCoursePreview() {
  return await request('/course/preview');
}

/* ==========================================================================
   Student (User) Endpoints
   ========================================================================== */

// Student Signup
export async function userSignUp({ email, password, firstname, lastname }) {
  return await request('/user/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, firstname, lastname }),
  });
}

// Student Signin
export async function userSignIn({ email, password }) {
  const result = await request('/user/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Save the token if login was successful
  if (result.success && result.data && result.data.token) {
    localStorage.setItem('userToken', result.data.token);
  }

  return result;
}

// Student Signout
export function userSignOut() {
  localStorage.removeItem('userToken');
}

// Purchase a course
export async function purchaseCourse(courseId) {
  return await request('/course/purchase', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  });
}

// Get student's purchased courses
export async function getUserPurchases() {
  return await request('/user/purchases');
}

/* ==========================================================================
   Admin Endpoints
   ========================================================================== */

// Admin Signup
export async function adminSignUp({ email, password, firstname, lastname }) {
  return await request('/admin/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, firstname, lastname }),
  });
}

// Admin Signin
export async function adminSignIn({ email, password }) {
  const result = await request('/admin/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Save the admin token if login was successful
  if (result.success && result.data && result.data.token) {
    localStorage.setItem('adminToken', result.data.token);
  }

  return result;
}

// Admin Signout
export function adminSignOut() {
  localStorage.removeItem('adminToken');
}

// Get all courses created by this admin
export async function getAdminCourses() {
  return await request('/admin/course/bulk');
}

// Create a new course
export async function createAdminCourse({ title, description, imageUrl, price }) {
  return await request('/admin/course', {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      imageUrl,
      price: Number(price),
    }),
  });
}

// Update an existing course
export async function updateAdminCourse({ courseId, title, description, imageUrl, price }) {
  return await request('/admin/course', {
    method: 'PUT',
    body: JSON.stringify({
      courseId,
      title,
      description,
      imageUrl,
      price: Number(price),
    }),
  });
}

// Delete a course
export async function deleteAdminCourse(courseId) {
  return await request('/admin/course', {
    method: 'DELETE',
    body: JSON.stringify({ courseId }),
  });
}
