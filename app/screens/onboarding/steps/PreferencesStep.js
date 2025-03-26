import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch
} from 'react-native';
import Slider from '@react-native-community/slider';
import { translate } from '../../../services/languageService';

const PreferencesStep = ({ profile, updateProfile, width }) => {
  // Gender preference options
  const genderOptions = [
    { id: 'men', label: translate('preferences.men') },
    { id: 'women', label: translate('preferences.women') },
    { id: 'both', label: translate('preferences.both') }
  ];

  // Handle gender preference selection
  const handleGenderPreference = (gender) => {
    updateProfile('preferences.interestedIn', gender);
  };

  // Handle distance preference change
  const handleDistanceChange = (value) => {
    updateProfile('preferences.maxDistance', Math.round(value));
  };

  // Handle age range change
  const handleAgeRangeChange = (values) => {
    updateProfile('preferences.ageRange', values);
  };

  // Handle farm owner preference change
  const handleFarmOwnerPreference = (value) => {
    updateProfile('preferences.mustHaveFarm', value);
  };

  // Toggle for showing profile to farm owners only
  const handleShowToFarmersOnly = (value) => {
    updateProfile('preferences.showToFarmersOnly', value);
  };

  // Handle interest matching options
  const handleInterestMatching = (value) => {
    updateProfile('preferences.matchInterests', value);
  };

  return (
    <ScrollView
      style={[styles.container, { width }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{translate('preferences.title')}</Text>
      <Text style={styles.description}>{translate('preferences.description')}</Text>

      {/* Gender Preferences */}
      <Text style={styles.sectionTitle}>{translate('preferences.interestedIn')}</Text>
      <View style={styles.optionsContainer}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              profile.preferences.interestedIn === option.id && styles.selectedOptionButton
            ]}
            onPress={() => handleGenderPreference(option.id)}
          >
            <Text style={[
              styles.optionText,
              profile.preferences.interestedIn === option.id && styles.selectedOptionText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Distance Preference */}
      <Text style={styles.sectionTitle}>{translate('preferences.maxDistance')}</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={5}
          maximumValue={150}
          step={5}
          value={profile.preferences.maxDistance}
          onValueChange={handleDistanceChange}
          minimumTrackTintColor="#E63946"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#E63946"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.minLabel}>5 km</Text>
          <Text style={styles.currentValue}>{profile.preferences.maxDistance} km</Text>
          <Text style={styles.maxLabel}>150 km</Text>
        </View>
      </View>

      {/* Age Range Preference */}
      <Text style={styles.sectionTitle}>{translate('preferences.ageRange')}</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={18}
          maximumValue={80}
          step={1}
          value={profile.preferences.ageRange[0]}
          onValueChange={(value) => handleAgeRangeChange([value, profile.preferences.ageRange[1]])}
          minimumTrackTintColor="#d3d3d3"
          maximumTrackTintColor="#E63946"
          thumbTintColor="#E63946"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.minLabel}>18</Text>
          <Text style={styles.currentValue}>{profile.preferences.ageRange[0]}</Text>
          <Text style={styles.maxLabel}>80</Text>
        </View>
      </View>
      
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={18}
          maximumValue={80}
          step={1}
          value={profile.preferences.ageRange[1]}
          onValueChange={(value) => handleAgeRangeChange([profile.preferences.ageRange[0], value])}
          minimumTrackTintColor="#E63946"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#E63946"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.minLabel}>18</Text>
          <Text style={styles.currentValue}>{profile.preferences.ageRange[1]}</Text>
          <Text style={styles.maxLabel}>80</Text>
        </View>
      </View>
      
      <Text style={styles.rangeDescription}>
        {translate('preferences.lookingForAges', {
          min: profile.preferences.ageRange[0],
          max: profile.preferences.ageRange[1]
        })}
      </Text>

      {/* Farm Owner Preferences */}
      <Text style={styles.sectionTitle}>{translate('preferences.farmPreferences')}</Text>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>{translate('preferences.mustHaveFarm')}</Text>
        <Switch
          value={profile.preferences.mustHaveFarm}
          onValueChange={handleFarmOwnerPreference}
          trackColor={{ false: '#cccccc', true: '#E63946' }}
          thumbColor="#ffffff"
        />
      </View>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>{translate('preferences.showToFarmersOnly')}</Text>
        <Switch
          value={profile.preferences.showToFarmersOnly}
          onValueChange={handleShowToFarmersOnly}
          trackColor={{ false: '#cccccc', true: '#E63946' }}
          thumbColor="#ffffff"
        />
      </View>

      {/* Interest Matching */}
      <Text style={styles.sectionTitle}>{translate('preferences.interestMatching')}</Text>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>{translate('preferences.matchInterests')}</Text>
        <Switch
          value={profile.preferences.matchInterests}
          onValueChange={handleInterestMatching}
          trackColor={{ false: '#cccccc', true: '#E63946' }}
          thumbColor="#ffffff"
        />
      </View>

      <Text style={styles.helperText}>{translate('preferences.interestMatchingHelp')}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  optionButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    margin: 4,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#E63946',
    borderColor: '#E63946',
  },
  optionText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 16,
  },
  selectedOptionText: {
    color: '#FFF',
  },
  sliderContainer: {
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  minLabel: {
    color: '#999',
    fontSize: 12,
  },
  maxLabel: {
    color: '#999',
    fontSize: 12,
  },
  currentValue: {
    color: '#E63946',
    fontSize: 14,
    fontWeight: '600',
  },
  rangeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  helperText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    marginBottom: 24,
    fontStyle: 'italic',
  },
});

export default PreferencesStep; 