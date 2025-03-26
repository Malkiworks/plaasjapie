import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, ActivityIndicator, Text } from 'react-native';
import { translate } from '../services/languageService';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import MessagesScreen from '../screens/main/MessagesScreen';
import EventsScreen from '../screens/main/EventsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

import ChatScreen from '../screens/chat/ChatScreen';
import EventDetailsScreen from '../screens/events/EventDetailsScreen';
import UserProfileScreen from '../screens/profile/UserProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

import OfflineBanner from '../components/OfflineBanner';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const OnboardingStack = createStackNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator 
    screenOptions={{ 
      headerShown: false, 
      cardStyle: { backgroundColor: '#FFFFFF' }
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// Onboarding Navigator
const OnboardingNavigator = () => (
  <OnboardingStack.Navigator 
    screenOptions={{ 
      headerShown: false, 
      cardStyle: { backgroundColor: '#FFFFFF' }
    }}
  >
    <OnboardingStack.Screen name="Onboarding" component={OnboardingScreen} />
  </OnboardingStack.Navigator>
);

// Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Messages') {
          iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        } else if (route.name === 'Events') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#E63946', // South African red
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
      tabBarStyle: {
        paddingVertical: 5,
        height: 60
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 5
      }
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ tabBarLabel: translate('matching.discover') }} 
    />
    <Tab.Screen 
      name="Events" 
      component={EventsScreen} 
      options={{ tabBarLabel: translate('events.events') }} 
    />
    <Tab.Screen 
      name="Messages" 
      component={MessagesScreen} 
      options={{ tabBarLabel: translate('messaging.newMessage') }} 
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ tabBarLabel: translate('profile.myProfile') }} 
    />
    <Tab.Screen 
      name="Settings" 
      component={SettingsScreen} 
      options={{ tabBarLabel: translate('settings.settings') }} 
    />
  </Tab.Navigator>
);

// Main Navigator (includes tabs and screens accessible after logging in)
const MainNavigator = () => (
  <MainStack.Navigator
    screenOptions={{
      headerShown: false
    }}
  >
    <MainStack.Screen name="Tabs" component={TabNavigator} />
    <MainStack.Screen name="Chat" component={ChatScreen} />
    <MainStack.Screen name="EventDetails" component={EventDetailsScreen} />
    <MainStack.Screen name="UserProfile" component={UserProfileScreen} />
    <MainStack.Screen name="EditProfile" component={EditProfileScreen} />
  </MainStack.Navigator>
);

// Loading component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
    <ActivityIndicator size="large" color="#E63946" />
  </View>
);

// Root Navigator
const AppNavigator = () => {
  const { isOnboarded, isOnline } = useApp();
  const { currentUser, loading: authLoading } = useAuth();
  
  if (authLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <>
      {!isOnline && <OfflineBanner />}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          // Not logged in - show auth screens
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !isOnboarded ? (
          // Logged in but not onboarded - show onboarding
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          // Logged in and onboarded - show main app
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator; 