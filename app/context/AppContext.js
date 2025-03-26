import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, offlineService } from '../services';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

// Create the context
export const AppContext = createContext();

// Create the context provider
export const AppProvider = ({ children }) => {
  // App state
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [theme, setTheme] = useState('light');
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailNotifications: true,
    distanceUnit: 'km', // or 'miles'
  });
  
  // Check if user has completed onboarding
  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboarding-completed');
      setIsOnboarded(onboardingCompleted === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };
  
  // Complete onboarding
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboarding-completed', 'true');
      setIsOnboarded(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };
  
  // Initialize app state
  const initializeApp = async () => {
    try {
      // Load theme preference
      const savedTheme = await AsyncStorage.getItem('app-theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
      
      // Load user preferences
      const savedPreferences = await AsyncStorage.getItem('user-preferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
      
      // Check onboarding status
      await checkOnboardingStatus();
      
      // Initialize database for offline support - do this last and handle errors
      try {
        const dbResult = await offlineService.initializeDatabase();
        if (!dbResult || !dbResult.success) {
          console.warn('Offline database initialization skipped or failed:', dbResult);
          // App can continue without offline support
        } else {
          console.log('Offline database initialized successfully');
        }
      } catch (dbError) {
        console.error('Error initializing database:', dbError);
        // Continue without offline support
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsInitialized(true); // Continue even with error
    }
  };
  
  // Change theme
  const changeTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem('app-theme', newTheme);
      setTheme(newTheme);
      return true;
    } catch (error) {
      console.error('Error changing theme:', error);
      return false;
    }
  };
  
  // Update user preferences
  const updatePreferences = async (newPreferences) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      await AsyncStorage.setItem('user-preferences', JSON.stringify(updatedPreferences));
      setPreferences(updatedPreferences);
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  };
  
  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, []);
  
  // Listen for network state changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected && state.isInternetReachable);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Context value
  const contextValue = {
    isOnboarded,
    completeOnboarding,
    isOnline,
    isInitialized,
    theme,
    changeTheme,
    preferences,
    updatePreferences
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default {
  AppContext,
  AppProvider,
  useApp
}; 