import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserPurchases } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(() => localStorage.getItem('codex_user_token') || null);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('codex_admin_token') || null);
  const [userProfile, setUserProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('codex_user_profile')) || null;
    } catch {
      return null;
    }
  });
  const [adminProfile, setAdminProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('codex_admin_profile')) || null;
    } catch {
      return null;
    }
  });
  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('codex_active_role') || 'student';
  });

  const [purchasedCourseIds, setPurchasedCourseIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('codex_purchased_ids')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('codex_active_role', activeRole);
  }, [activeRole]);

  // Sync purchases from backend when userToken changes
  const refreshPurchases = async () => {
    if (!userToken) return;
    const res = await getUserPurchases(userToken);
    if (res.success && res.courses) {
      const ids = res.courses.map((c) => c._id || c.id);
      setPurchasedCourseIds((prev) => {
        const combined = Array.from(new Set([...prev, ...ids]));
        localStorage.setItem('codex_purchased_ids', JSON.stringify(combined));
        return combined;
      });
    }
  };

  useEffect(() => {
    if (userToken) {
      refreshPurchases();
    }
  }, [userToken]);

  const loginUser = (token, profile) => {
    setUserToken(token);
    setUserProfile(profile);
    localStorage.setItem('codex_user_token', token);
    localStorage.setItem('codex_user_profile', JSON.stringify(profile));
  };

  const logoutUser = () => {
    setUserToken(null);
    setUserProfile(null);
    localStorage.removeItem('codex_user_token');
    localStorage.removeItem('codex_user_profile');
    localStorage.removeItem('codex_purchased_ids');
    setPurchasedCourseIds([]);
  };

  const loginAdmin = (token, profile) => {
    setAdminToken(token);
    setAdminProfile(profile);
    localStorage.setItem('codex_admin_token', token);
    localStorage.setItem('codex_admin_profile', JSON.stringify(profile));
    setActiveRole('admin');
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminProfile(null);
    localStorage.removeItem('codex_admin_token');
    localStorage.removeItem('codex_admin_profile');
    if (activeRole === 'admin') {
      setActiveRole('student');
    }
  };

  const markPurchased = (courseId) => {
    setPurchasedCourseIds((prev) => {
      const next = Array.from(new Set([...prev, courseId]));
      localStorage.setItem('codex_purchased_ids', JSON.stringify(next));
      return next;
    });
  };

  const isPurchased = (courseId) => {
    return purchasedCourseIds.includes(courseId);
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        adminToken,
        userProfile,
        adminProfile,
        activeRole,
        setActiveRole,
        loginUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
        purchasedCourseIds,
        markPurchased,
        isPurchased,
        refreshPurchases,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
