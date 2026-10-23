import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface RegisterData {
  fullName: string;
  age: number | string;
  address: string;
  state: string;
  district: string;
  villageCity: string;
  phoneNumber: string;
  farmAreaAcres: number | string;
  role: 'farmer' | 'owner';
  email: string;
  password: string;
  termsAccepted: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }>;
  logout: () => void;
  verifyEmail: (token?: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; resetToken?: string; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  switchDemoUser: (role: 'farmer' | 'owner') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'agrishare_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } else {
        // By default, initialize with Rohit Patil from the screenshot reference so the user immediately sees the exact home screen!
        // The user can log out, register, login, or switch as requested.
        const defaultUser: UserProfile = {
          id: 'usr_rohit_patil',
          fullName: 'Rohit Patil',
          age: 38,
          address: 'Plot 42, Shivshankar Nagar, Baramati Road',
          state: 'Maharashtra',
          district: 'Pune',
          villageCity: 'Baramati',
          phoneNumber: '+919822334455',
          farmAreaAcres: 4.5,
          role: 'farmer',
          email: 'rohit.patil@example.com',
          isEmailVerified: true,
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(defaultUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, rememberMe = true) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Network error or server unreachable. Please try again.' };
    }
  };

  const register = async (formData: RegisterData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      // Note: user is registered; depending on verification setting, user can verify or login
      return { success: true, user: data.user, token: data.verificationToken };
    } catch (err: any) {
      return { success: false, error: 'Network error during registration. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const verifyEmail = async (token?: string, email?: string) => {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Verification failed' };
      }
      if (user && user.email === data.user.email) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Verification request failed' };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: 'Failed to resend verification' };
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return { success: true, resetToken: data.resetToken };
    } catch (err: any) {
      return { success: false, error: 'Failed to request password reset' };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Password reset failed' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Network error during password reset' };
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'No user logged in' };
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...data }),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Failed to update profile' };
      }
      setUser(resData.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resData.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Network error updating profile' };
    }
  };

  const switchDemoUser = (role: 'farmer' | 'owner') => {
    if (role === 'farmer') {
      const farmerUser: UserProfile = {
        id: 'usr_rohit_patil',
        fullName: 'Rohit Patil',
        age: 38,
        address: 'Plot 42, Shivshankar Nagar, Baramati Road',
        state: 'Maharashtra',
        district: 'Pune',
        villageCity: 'Baramati',
        phoneNumber: '+919822334455',
        farmAreaAcres: 4.5,
        role: 'farmer',
        email: 'rohit.patil@example.com',
        isEmailVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(farmerUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(farmerUser));
    } else {
      const ownerUser: UserProfile = {
        id: 'usr_owner_ramesh',
        fullName: 'Rameshwar Pawar',
        age: 46,
        address: 'Near Kisan Seva Kendra, Indapur',
        state: 'Maharashtra',
        district: 'Pune',
        villageCity: 'Indapur',
        phoneNumber: '+919850123456',
        farmAreaAcres: 12.0,
        role: 'owner',
        email: 'ramesh.pawar@example.com',
        isEmailVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(ownerUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ownerUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        verifyEmail,
        resendVerification,
        requestPasswordReset,
        resetPassword,
        updateProfile,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
