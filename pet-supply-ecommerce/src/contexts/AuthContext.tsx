import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Mock login - replace with actual API call
      if (email === 'admin@petstore.com' && password === 'admin123') {
        const adminUser: User = {
          id: '1',
          email: 'admin@petstore.com',
          name: 'Admin User',
          role: 'admin',
          addresses: [],
          preferences: {
            petTypes: ['all'],
            favoriteCategories: ['food'],
            newsletter: true,
            notifications: {
              email: true,
              sms: false,
              push: true
            }
          },
          createdAt: '2024-01-01',
          lastLogin: new Date().toISOString()
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        toast.success('Welcome back, Admin!');
      } else if (email === 'user@petstore.com' && password === 'user123') {
        const regularUser: User = {
          id: '2',
          email: 'user@petstore.com',
          name: 'John Doe',
          role: 'user',
          addresses: [],
          preferences: {
            petTypes: ['dog', 'cat'],
            favoriteCategories: ['food', 'toys'],
            newsletter: true,
            notifications: {
              email: true,
              sms: false,
              push: true
            }
          },
          createdAt: '2024-01-01',
          lastLogin: new Date().toISOString()
        };
        setUser(regularUser);
        localStorage.setItem('user', JSON.stringify(regularUser));
        toast.success('Welcome back!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Invalid email or password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      
      // Mock registration - replace with actual API call
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: 'user',
        addresses: [],
        preferences: {
          petTypes: [],
          favoriteCategories: [],
          newsletter: true,
          notifications: {
            email: true,
            sms: false,
            push: true
          }
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};