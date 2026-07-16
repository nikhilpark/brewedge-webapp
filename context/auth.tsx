'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setAuthToken } from '@/lib/apiClient';

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

  // Check for existing session on mount using refresh token cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const userData = await apiClient('/auth/me');
        setUser(userData);
      } catch (error) {
        // Session expired or not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Store token in memory
      if (response.accessToken) {
        setAuthToken(response.accessToken);
      }
      
      setUser(response.user);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });
      
      // Store token in memory
      if (response.accessToken) {
        setAuthToken(response.accessToken);
      }
      
      setUser(response.user);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthToken(null);
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
