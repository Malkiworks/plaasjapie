import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { translate } from '../../../services/languageService';

const BasicInfoStep = ({ profile, updateProfile, width }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bioLength, setBioLength] = useState(profile.bio ? profile.bio.length : 0);
  const MAX_BIO_LENGTH = 300;

  // Gender options
  const genderOptions = [
    { id: 'male', label: translate('profile.male') },
    { id: 'female', label: translate('profile.female') },
    { id: 'other', label: translate('profile.other') }
  ];

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || profile.birthday;
    
    // Hide date picker (iOS)
    if (Platform.OS === 'ios') {
      // For iOS, the picker stays open until Done is clicked
    } else {
      setShowDatePicker(false);
    }
    
    if (currentDate) {
      updateProfile('birthday', currentDate.toISOString());
    }
  };

  // Handle gender selection
  const selectGender = (gender) => {
    updateProfile('gender', gender);
  };

  // Handle bio text changes
  const handleBioChange = (text) => {
    if (text.length <= MAX_BIO_LENGTH) {
      updateProfile('bio', text);
      setBioLength(text.length);
    }
  };

  // Check if user is at least 18 years old
  const isMinimumAge = (dateString) => {
    if (!dateString) return false;
    
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  return (
    <ScrollView
      style={[styles.container, { width }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{translate('onboarding.tellAboutYourself')}</Text>
      
      {/* Name Input */}
      <Text style={styles.inputLabel}>{translate('onboarding.displayName')}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={translate('onboarding.displayNamePlaceholder')}
          value={profile.displayName}
          onChangeText={(text) => updateProfile('displayName', text)}
          autoCapitalize="words"
          maxLength={50}
        />
      </View>
      
      {/* Date of Birth */}
      <Text style={styles.inputLabel}>{translate('onboarding.birthday')}</Text>
      <TouchableOpacity
        style={styles.dateContainer}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={profile.birthday ? styles.dateText : styles.placeholderText}>
          {profile.birthday ? formatDate(profile.birthday) : translate('onboarding.birthday')}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#666" />
      </TouchableOpacity>
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={profile.birthday ? new Date(profile.birthday) : new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)} // 18 years ago
          minimumDate={new Date(1940, 0, 1)}
          onChange={onDateChange}
          onDismiss={() => setShowDatePicker(false)}
        />
      )}
      
      {/* Show error if age less than 18 */}
      {profile.birthday && !isMinimumAge(profile.birthday) && (
        <Text style={styles.errorText}>
          You must be at least 18 years old to use this app.
        </Text>
      )}
      
      {/* Gender Selection */}
      <Text style={styles.inputLabel}>{translate('onboarding.gender')}</Text>
      <View style={styles.optionsContainer}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              profile.gender === option.id && styles.selectedOptionButton
            ]}
            onPress={() => selectGender(option.id)}
          >
            <Text style={[
              styles.optionText,
              profile.gender === option.id && styles.selectedOptionText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Bio */}
      <Text style={styles.inputLabel}>{translate('onboarding.bio')}</Text>
      <View style={styles.bioContainer}>
        <TextInput
          style={styles.bioInput}
          placeholder={translate('onboarding.bioPlaceholder')}
          value={profile.bio}
          onChangeText={handleBioChange}
          multiline
          numberOfLines={4}
          maxLength={MAX_BIO_LENGTH}
          textAlignVertical="top"
        />
        <Text style={styles.bioCounter}>
          {translate('onboarding.bioCounter', { remaining: MAX_BIO_LENGTH - bioLength })}
        </Text>
      </View>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#E63946',
    borderColor: '#E63946',
  },
  optionText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFF',
  },
  bioContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  bioInput: {
    height: 120,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
  },
  bioCounter: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  errorText: {
    color: '#E63946',
    fontSize: 14,
    marginTop: -16,
    marginBottom: 16,
  }
});

export default BasicInfoStep; 