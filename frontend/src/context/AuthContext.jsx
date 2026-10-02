import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserPurchases } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Lazy state initialization: runs localStorage.getItem only ONCE on mount,
  // not on every single re-render of the component
  const [userToken, setUserToken] = useState(() => localStorage.getItem('userToken'));
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));

  // Active role determines whether the user is browsing as a student or as an admin
  const [activeRole, setActiveRole] = useState(() => {
    if (localStorage.getItem('adminToken')) return 'admin';
    if (localStorage.getItem('userToken')) return 'user';
    return null;
  });

  // Array of course IDs purchased by the student
  const [purchasedCourseIds, setPurchasedCourseIds] = useState([]);

  // Function to refresh purchased courses from backend
  const refreshPurchases = async () => {
    if (!userToken) {
      setPurchasedCourseIds([]);
      return;
    }
    const res = await getUserPurchases();
    if (res.success && res.data) {
      const idsFromCourses = (res.data.courses || []).map((c) => c._id);
      const idsFromPurchases = (res.data.purchases || []).map((p) => p.courseId);
      const allIds = Array.from(new Set([...idsFromCourses, ...idsFromPurchases]));
      setPurchasedCourseIds(allIds);
    }
  };

  // Fetch purchases whenever userToken changes (login/logout)
  useEffect(() => {
    refreshPurchases();
  }, [userToken]);

  // Login as Student
  const loginUser = (token) => {
    localStorage.setItem('userToken', token);
    setUserToken(token);
    setActiveRole('user');
  };

  // Login as Admin / Creator
  const loginAdmin = (token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    setActiveRole('admin');
  };

  // Logout clears all stored tokens and resets state
  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    setUserToken(null);
    setAdminToken(null);
    setActiveRole(null);
    setPurchasedCourseIds([]);
  };

  // Helper function: check if a course is already purchased
  const isPurchased = (courseId) => purchasedCourseIds.includes(courseId);

  // Optimistically add course ID to purchased list immediately after successful checkout
  const markPurchased = (courseId) => {
    setPurchasedCourseIds((prev) => [...prev, courseId]);
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        adminToken,
        activeRole,
        setActiveRole,
        isLoggedIn: Boolean(userToken || adminToken),
        purchasedCourseIds,
        isPurchased,
        markPurchased,
        refreshPurchases,
        loginUser,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume AuthContext in any component
export function useAuth() {
  return useContext(AuthContext);
}
