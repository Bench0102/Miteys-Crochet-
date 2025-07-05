import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser(userData);
        } else {
          // Create user document if it doesn't exist
          const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            phone: '',
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
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: new Date().toISOString()
      });
      
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      // Update Firebase Auth profile
      await updateFirebaseProfile(userCredential.user, {
        displayName: userData.name
      });
      
      const newUser: User = {
        id: userCredential.user.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
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
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Logout failed');
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = { ...user, ...userData };
      
      // Update Firestore
      await updateDoc(doc(db, 'users', user.id), userData);
      
      // Update Firebase Auth profile if name changed
      if (userData.name) {
        await updateFirebaseProfile(auth.currentUser!, {
          displayName: userData.name
        });
      }
      
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
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

export { AuthContext };