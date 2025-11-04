import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from '../lib/permissions';
import { mockAdmins } from '../lib/mockData';

interface AuthContextType {
  isAuthenticated: boolean;
  adminName: string | null;
  adminEmail: string | null;
  role: Role | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  sessionTimeout: number;
  resetSessionTimeout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [sessionTimeout, setSessionTimeout] = useState(30 * 60); // 30 minutes in seconds

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth) {
      const { adminName, adminEmail, role, expiresAt } = JSON.parse(storedAuth);
      if (Date.now() < expiresAt) {
        setIsAuthenticated(true);
        setAdminName(adminName);
        setAdminEmail(adminEmail);
        setRole(role);
      } else {
        localStorage.removeItem('adminAuth');
      }
    }
  }, []);

  // Session timeout countdown
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      setSessionTimeout((prev) => {
        if (prev <= 1) {
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find admin by email
    const admin = mockAdmins.find((a) => a.email === email);

    if (!admin) {
      return { success: false, error: 'Invalid email or password' };
    }

    // For demo purposes, accept any password
    // In production, verify bcrypt hashed password
    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    // Generate mock JWT token and refresh token
    const token = `mock-jwt-token-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${Date.now()}`;
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes

    // Store in localStorage (in production, use httpOnly cookies for tokens)
    localStorage.setItem('adminAuth', JSON.stringify({
      token,
      refreshToken,
      adminName: admin.name,
      adminEmail: admin.email,
      role: admin.role,
      expiresAt,
    }));

    setIsAuthenticated(true);
    setAdminName(admin.name);
    setAdminEmail(admin.email);
    setRole(admin.role);
    setSessionTimeout(30 * 60);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setAdminName(null);
    setAdminEmail(null);
    setRole(null);
    setSessionTimeout(30 * 60);
  };

  const resetSessionTimeout = () => {
    setSessionTimeout(30 * 60);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        adminName,
        adminEmail,
        role,
        login,
        logout,
        sessionTimeout,
        resetSessionTimeout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
