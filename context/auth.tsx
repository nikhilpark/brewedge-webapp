'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setAuthToken, setRefreshToken, getRefreshToken } from '@/lib/apiClient';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log("Auth provider 27")
  // Check for existing session on mount using refresh token cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const userData = await apiClient('/auth/me');
  
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    restoreSession();
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    setIsLoading(true);
  
    try {
      const response = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
  
    try {
      const response = await apiClient('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
  
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    try {
      await apiClient('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({}),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
