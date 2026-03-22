'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/lib/types';
import { loginUser, registerUser, getCurrentUser } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser({ ...userData, token });
        } catch {
          // Token is invalid, clear it
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const userData = await loginUser(email, password);
    localStorage.setItem('token', userData.token);
    setUser(userData);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const userData = await registerUser(name, email, password);
    localStorage.setItem('token', userData.token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
