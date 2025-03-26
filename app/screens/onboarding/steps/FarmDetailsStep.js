import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '../../../services/languageService';

const FarmDetailsStep = ({ profile, updateProfile, width }) => {
  // Farm types options
  const farmTypes = [
    { id: 'livestock', label: translate('profile.livestock') },
    { id: 'crops', label: translate('profile.crops') },
    { id: 'mixed', label: translate('profile.mixed') },
    { id: 'hobby', label: translate('profile.hobby') },
    { id: 'dairy', label: translate('profile.dairy') },
    { id: 'orchard', label: translate('profile.orchard') },
    { id: 'vineyard', label: translate('profile.vineyard') },
    { id: 'game', label: translate('profile.game') },
  ];

  // Farming activities
  const farmingActivities = [
    { id: 'cattle', label: translate('profile.cattle') },
    { id: 'sheep', label: translate('profile.sheep') },
    { id: 'goats', label: translate('profile.goats') },
    { id: 'poultry', label: translate('profile.poultry') },
    { id: 'pigs', label: translate('profile.pigs') },
    { id: 'corn', label: translate('profile.corn') },
    { id: 'wheat', label: translate('profile.wheat') },
    { id: 'vegetables', label: translate('profile.vegetables') },
    { id: 'fruit', label: translate('profile.fruit') },
    { id: 'nuts', label: translate('profile.nuts') },
    { id: 'wine', label: translate('profile.wine') },
    { id: 'flowers', label: translate('profile.flowers') },
    { id: 'bees', label: translate('profile.bees') },
    { id: 'horses', label: translate('profile.horses') },
    { id: 'wildlife', label: translate('profile.wildlife') },
  ];

  // Toggle farm owner status
  const toggleHasFarm = (value) => {
    updateProfile('farmDetails.hasFarm', value);
  };

  // Toggle farm type
  const toggleFarmType = (farmTypeId) => {
    updateProfile('farmDetails.farmType', farmTypeId);
  };

  // Toggle farming activity
  const toggleActivity = (activityId) => {
    const currentActivities = [...profile.farmDetails.farmingActivities];
    
    if (currentActivities.includes(activityId)) {
      // Remove the activity if it's already selected
      const updatedActivities = currentActivities.filter(id => id !== activityId);
      updateProfile('farmDetails.farmingActivities', updatedActivities);
    } else {
      // Add the activity
      updateProfile('farmDetails.farmingActivities', [...currentActivities, activityId]);
    }
  };

  // Update farm size
  const updateFarmSize = (text) => {
    // Only allow numbers
    const onlyNumbers = text.replace(/[^0-9]/g, '');
    updateProfile('farmDetails.farmSize', onlyNumbers);
  };

  return (
    <ScrollView
      style={[styles.container, { width }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>{translate('onboarding.farmOwner')}</Text>
        <Switch
          value={profile.farmDetails.hasFarm}
          onValueChange={toggleHasFarm}
          trackColor={{ false: '#cccccc', true: '#E63946' }}
          thumbColor="#ffffff"
        />
      </View>

      {profile.farmDetails.hasFarm && (
        <>
          <Text style={styles.sectionTitle}>{translate('onboarding.farmTypePrompt')}</Text>
          <View style={styles.optionsContainer}>
            {farmTypes.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  profile.farmDetails.farmType === option.id && styles.selectedOptionButton
                ]}
                onPress={() => toggleFarmType(option.id)}
              >
                <Text style={[
                  styles.optionText,
                  profile.farmDetails.farmType === option.id && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{translate('onboarding.farmSizePrompt')}</Text>
          <View style={styles.sizeContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={profile.farmDetails.farmSize}
                onChangeText={updateFarmSize}
              />
            </View>
            <Text style={styles.unitText}>{translate('profile.hectares')}</Text>
          </View>

          <Text style={styles.sectionTitle}>{translate('onboarding.farmingActivities')}</Text>
          <Text style={styles.description}>{translate('onboarding.selectAllApply')}</Text>
          <View style={styles.optionsContainer}>
            {farmingActivities.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  profile.farmDetails.farmingActivities.includes(option.id) && styles.selectedOptionButton
                ]}
                onPress={() => toggleActivity(option.id)}
              >
                <Text style={[
                  styles.optionText,
                  profile.farmDetails.farmingActivities.includes(option.id) && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {!profile.farmDetails.hasFarm && (
        <View style={styles.noFarmContainer}>
          <Ionicons name="leaf-outline" size={80} color="#ccc" />
          <Text style={styles.noFarmText}>{translate('onboarding.noFarmText')}</Text>
          <Text style={styles.noFarmSubtext}>{translate('onboarding.noFarmSubtext')}</Text>
        </View>
      )}
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    margin: 4,
    backgroundColor: '#FFF',
  },
  selectedOptionButton: {
    backgroundColor: '#E63946',
    borderColor: '#E63946',
  },
  optionText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFF',
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    width: 120,
    backgroundColor: '#FFF',
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  unitText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  noFarmContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  noFarmText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  noFarmSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default FarmDetailsStep; 