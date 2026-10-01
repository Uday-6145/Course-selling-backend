// Frontend API client connected directly to the Node/Express backend via Vite proxy

const BASE_URL = '';

export async function fetchCoursePreview() {
  try {
    const res = await fetch(`${BASE_URL}/course/preview`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    return { success: true, courses: data.courses || [] };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function userSignUp({ email, password, firstname, lastname }) {
  try {
    const res = await fetch(`${BASE_URL}/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstname, lastname }),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
    if (!res.ok || (data && data.error)) {
      return {
        success: false,
        message: data?.message || data || 'Signup failed',
        details: data?.error,
      };
    }
    return { success: true, message: data?.message || text || 'Signup successful' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function userSignIn({ email, password }) {
  try {
    const res = await fetch(`${BASE_URL}/user/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.token) {
      return { success: false, message: data.message || 'Invalid credentials' };
    }
    return { success: true, token: data.token };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function purchaseCourse(courseId, token) {
  try {
    const res = await fetch(`${BASE_URL}/course/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({ courseId }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Purchase failed' };
    }
    return { success: true, message: data.message || 'Purchased successfully' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function getUserPurchases(token) {
  try {
    const res = await fetch(`${BASE_URL}/user/purchases`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Failed to fetch purchases', courses: [] };
    }
    return { success: true, courses: data.courses || [], purchases: data.purchases || [] };
  } catch (err) {
    return { success: false, message: err.message, courses: [] };
  }
}

/* Admin Endpoints */

export async function adminSignUp({ email, password, firstname, lastname }) {
  try {
    const res = await fetch(`${BASE_URL}/admin/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstname, lastname }),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
    if (!res.ok || (data && data.error)) {
      return {
        success: false,
        message: data?.message || data || 'Admin signup failed',
        details: data?.error,
      };
    }
    return { success: true, message: data?.message || text || 'Admin signup successful' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function adminSignIn({ email, password }) {
  try {
    const res = await fetch(`${BASE_URL}/admin/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.token) {
      return { success: false, message: data.message || 'Invalid admin credentials' };
    }
    return { success: true, token: data.token };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function getAdminCourses(token) {
  try {
    const res = await fetch(`${BASE_URL}/admin/course/bulk`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Failed to fetch admin courses', courses: [] };
    }
    return { success: true, courses: data.courses || [] };
  } catch (err) {
    return { success: false, message: err.message, courses: [] };
  }
}

export async function createAdminCourse({ title, description, imageUrl, price }, token) {
  try {
    const res = await fetch(`${BASE_URL}/admin/course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price: Number(price),
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      return { success: false, message: data.message || 'Failed to create course', details: data.error };
    }
    return { success: true, message: data.message || 'Course created successfully', courseId: data.courseId };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function updateAdminCourse({ courseId, title, description, imageUrl, price }, token) {
  try {
    const res = await fetch(`${BASE_URL}/admin/course`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        courseId,
        title,
        description,
        imageUrl,
        price: price !== undefined ? Number(price) : undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      return { success: false, message: data.message || 'Failed to update course', details: data.error };
    }
    return { success: true, message: data.message || 'Course updated successfully' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function deleteAdminCourse(courseId, token) {
  try {
    const res = await fetch(`${BASE_URL}/admin/course`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({ courseId }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      return { success: false, message: data.message || 'Failed to delete course', details: data.error };
    }
    return { success: true, message: data.message || 'Course deleted successfully' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
