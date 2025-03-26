import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './app/context/AppContext';
import { AuthProvider } from './app/context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(error => {
  console.warn('Error preventing splash screen hide:', error);
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initError, setInitError] = useState(null);
  
  useEffect(() => {
    async function prepare() {
      try {
        console.log('App initializing...');
        // Artificial delay for a smoother experience
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('App initialization complete');
        setAppIsReady(true);
      } catch (e) {
        console.error('Error in app initialization:', e);
        setInitError(e);
      }
    }

    prepare();
  }, []);
  
  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      try {
        // This tells the splash screen to hide immediately
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('Error hiding splash screen:', error);
      }
    }
  }, [appIsReady]);

  const handleRetry = () => {
    setInitError(null);
    setAppIsReady(false);
    
    // Try initialization again
    setTimeout(() => {
      setAppIsReady(true);
    }, 1000);
  };

  console.log('App state:', { appIsReady, initError, platform: Platform.OS });

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E63946" />
        <Text style={{ marginTop: 20 }}>Loading app...</Text>
      </View>
    );
  }

  if (initError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
          There was a problem initializing the app.
        </Text>
        <Text style={{ marginBottom: 20, textAlign: 'center' }}>
          {initError.message || 'Unknown error'}
        </Text>
        <TouchableOpacity 
          onPress={handleRetry}
          style={{ 
            backgroundColor: '#E63946', 
            paddingVertical: 10, 
            paddingHorizontal: 20, 
            borderRadius: 5 
          }}
        >
          <Text style={{ color: '#FFF', fontSize: 16 }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <AuthProvider>
          <NavigationContainer onReady={onLayoutRootView}>
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
} 