import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import steps
import BasicInfoStep from './steps/BasicInfoStep';
import LocationStep from './steps/LocationStep';
import PhotosStep from './steps/PhotosStep';
import FarmDetailsStep from './steps/FarmDetailsStep';
import InterestsStep from './steps/InterestsStep';
import PreferencesStep from './steps/PreferencesStep';

// Import services
import { translate } from '../../services/languageService';
import { updateUserProfile } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const { completeOnboarding: markOnboardingComplete } = useApp();
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const flatListRef = useRef(null);

  // Profile state with default values
  const [profile, setProfile] = useState({
    displayName: '',
    birthday: null,
    gender: '',
    bio: '',
    location: null,
    photos: [],
    primaryPhotoIndex: 0,
    farmDetails: {
      hasFarm: false,
      farmType: '',
      farmSize: '',
      farmingActivities: []
    },
    interests: [],
    preferences: {
      interestedIn: 'both',
      ageRange: [18, 40],
      maxDistance: 50,
      mustHaveFarm: false,
      showToFarmersOnly: false,
      matchInterests: true
    },
    onboardingCompleted: false
  });

  // Steps configuration
  const steps = [
    {
      id: 'basic',
      title: translate('onboarding.basicInfo'),
      component: BasicInfoStep,
      isComplete: () => !!profile.displayName && !!profile.birthday && !!profile.gender
    },
    {
      id: 'location',
      title: translate('onboarding.location'),
      component: LocationStep,
      isComplete: () => !!profile.location
    },
    {
      id: 'photos',
      title: translate('onboarding.photos'),
      component: PhotosStep,
      isComplete: () => profile.photos.length > 0
    },
    {
      id: 'farm',
      title: translate('onboarding.farmDetails'),
      component: FarmDetailsStep,
      isComplete: () => !profile.farmDetails.hasFarm || 
        (!!profile.farmDetails.farmType && profile.farmDetails.farmingActivities.length > 0)
    },
    {
      id: 'interests',
      title: translate('onboarding.interests'),
      component: InterestsStep,
      isComplete: () => profile.interests.length > 0
    },
    {
      id: 'preferences',
      title: translate('onboarding.preferences'),
      component: PreferencesStep,
      isComplete: () => true // Always valid as it has default values
    },
  ];

  // Function to update profile fields using dot notation path
  const updateProfile = (path, value) => {
    const newProfile = { ...profile };
    const pathArray = path.split('.');
    let current = newProfile;
    
    // Navigate to the nested property
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }
    
    // Set the value
    current[pathArray[pathArray.length - 1]] = value;
    setProfile(newProfile);
  };

  // Move to next step
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      if (steps[currentStepIndex].isComplete()) {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        flatListRef.current?.scrollToIndex({ animated: true, index: nextIndex });
      } else {
        Alert.alert(
          translate('onboarding.incompleteStep'),
          translate('onboarding.completeCurrentStep'),
          [{ text: translate('common.ok') }]
        );
      }
    } else {
      // Last step, complete onboarding
      completeOnboarding();
    }
  };

  // Move to previous step
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ animated: true, index: prevIndex });
    }
  };

  // Complete onboarding and save profile
  const completeOnboarding = async () => {
    try {
      setLoading(true);
      
      // Mark onboarding as completed
      const updatedProfile = {
        ...profile,
        onboardingCompleted: true
      };
      
      // Save profile to Firestore
      await updateUserProfile(currentUser.uid, updatedProfile);
      
      // Complete onboarding in app context
      await markOnboardingComplete();
      
      // Navigate to main app - fix navigation route
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      Alert.alert(
        translate('common.error'),
        translate('onboarding.saveError'),
        [{ text: translate('common.ok') }]
      );
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render current step
  const renderStep = ({ item, index }) => {
    const StepComponent = item.component;
    
    // Only render visible steps (current and adjacent) for performance
    if (Math.abs(index - currentStepIndex) > 1) {
      return <View style={{ width }} />;
    }
    
    return (
      <View style={{ width }}>
        <StepComponent 
          profile={profile} 
          updateProfile={updateProfile} 
          width={width} 
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{translate('onboarding.setup')}</Text>
        <Text style={styles.stepIndicator}>
          {currentStepIndex + 1}/{steps.length}
        </Text>
      </View>

      {/* Step title */}
      <Text style={styles.stepTitle}>{steps[currentStepIndex].title}</Text>

      {/* Steps content */}
      <FlatList
        ref={flatListRef}
        data={steps}
        renderItem={renderStep}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
      />

      {/* Navigation buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goToPreviousStep}
          disabled={currentStepIndex === 0 || loading}
        >
          <Ionicons name="chevron-back" size={24} color={currentStepIndex === 0 ? '#CCC' : '#333'} />
          <Text style={[styles.backButtonText, currentStepIndex === 0 && styles.disabledText]}>
            {translate('common.back')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={goToNextStep}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {currentStepIndex === steps.length - 1 
                  ? translate('onboarding.finish') 
                  : translate('common.next')}
              </Text>
              <Ionicons name="chevron-forward" size={24} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Progress dots */}
      <View style={styles.progressDots}>
        {steps.map((step, index) => (
          <View
            key={step.id}
            style={[
              styles.progressDot,
              index === currentStepIndex ? styles.activeDot : null,
              index < currentStepIndex ? styles.completedDot : null
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  stepIndicator: {
    fontSize: 14,
    color: '#666',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
  disabledText: {
    color: '#CCC',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E63946',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginRight: 4,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#E63946',
    width: 20,
  },
  completedDot: {
    backgroundColor: '#A8DADC',
  },
});

export default OnboardingScreen; 