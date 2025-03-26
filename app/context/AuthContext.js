import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';
import { Platform } from 'react-native';

// Create the context
export const AuthContext = createContext();

// Create the context provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setAuthError(null);
      console.log('Signing in with email:', email);
      const result = await authService.loginWithEmail(email, password);
      if (!result.success) {
        console.log('Sign in failed:', result.error);
        setAuthError(result.error);
        return false;
      }
      console.log('Sign in successful');
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError(error.message);
      return false;
    }
  };

  // Sign up with email, password, and display name
  const signUp = async (email, password, displayName) => {
    try {
      setAuthError(null);
      const result = await authService.registerWithEmail(email, password, displayName);
      if (!result.success) {
        setAuthError(result.error);
        return false;
      }
      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setAuthError(null);
      await authService.logout();
      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setAuthError(null);
      const result = await authService.resetPassword(email);
      if (!result.success) {
        setAuthError(result.error);
        return false;
      }
      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      if (!currentUser) {
        setAuthError('User not authenticated');
        return false;
      }
      
      setAuthError(null);
      const result = await authService.updateUserProfile(currentUser.uid, userData);
      if (!result.success) {
        setAuthError(result.error);
        return false;
      }
      
      // Refresh user data
      const updatedUser = await authService.getCurrentUserWithProfile();
      setCurrentUser(updatedUser);
      
      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (imageURI) => {
    try {
      if (!currentUser) {
        setAuthError('User not authenticated');
        return false;
      }
      
      setAuthError(null);
      const result = await authService.uploadProfilePicture(currentUser.uid, imageURI);
      if (!result.success) {
        setAuthError(result.error);
        return false;
      }
      
      // Refresh user data
      const updatedUser = await authService.getCurrentUserWithProfile();
      setCurrentUser(updatedUser);
      
      return result.photoURL;
    } catch (error) {
      setAuthError(error.message);
      return false;
    }
  };

  // Subscribe to auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    let unsubscribe = () => {};
    
    try {
      unsubscribe = authService.subscribeToAuthChanges(async (user) => {
        console.log('Auth state changed:', user ? 'User logged in' : 'No user');
        if (user) {
          try {
            // Get user profile with Firestore data
            const userWithProfile = await authService.getCurrentUserWithProfile();
            setCurrentUser(userWithProfile);
          } catch (error) {
            console.error('Error getting user profile:', error);
            setCurrentUser(user);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      setLoading(false);
    }
    
    return () => {
      try {
        unsubscribe();
      } catch (error) {
        console.warn('Error unsubscribing from auth state changes:', error);
      }
    };
  }, []);

  // Context value
  const value = {
    currentUser,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    uploadProfilePicture
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default {
  AuthContext,
  AuthProvider,
  useAuth
}; 