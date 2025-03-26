import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '../../../services/languageService';

const InterestsStep = ({ profile, updateProfile, width }) => {
  // List of interests with icon names and categories
  const interestsList = [
    // Outdoor activities
    { id: 'hiking', label: translate('interests.hiking'), icon: 'footsteps-outline', category: 'outdoor' },
    { id: 'fishing', label: translate('interests.fishing'), icon: 'fish-outline', category: 'outdoor' },
    { id: 'hunting', label: translate('interests.hunting'), icon: 'trail-sign-outline', category: 'outdoor' },
    { id: 'camping', label: translate('interests.camping'), icon: 'bonfire-outline', category: 'outdoor' },
    { id: 'horseRiding', label: translate('interests.horseRiding'), icon: 'bicycle-outline', category: 'outdoor' },
    { id: 'gardening', label: translate('interests.gardening'), icon: 'leaf-outline', category: 'outdoor' },
    
    // Sports
    { id: 'rugby', label: translate('interests.rugby'), icon: 'american-football-outline', category: 'sports' },
    { id: 'cricket', label: translate('interests.cricket'), icon: 'baseball-outline', category: 'sports' },
    { id: 'soccer', label: translate('interests.soccer'), icon: 'football-outline', category: 'sports' },
    { id: 'tennis', label: translate('interests.tennis'), icon: 'tennisball-outline', category: 'sports' },
    { id: 'golf', label: translate('interests.golf'), icon: 'golf-outline', category: 'sports' },
    
    // Home & Living
    { id: 'cooking', label: translate('interests.cooking'), icon: 'restaurant-outline', category: 'home' },
    { id: 'baking', label: translate('interests.baking'), icon: 'pizza-outline', category: 'home' },
    { id: 'braai', label: translate('interests.braai'), icon: 'flame-outline', category: 'home' },
    { id: 'wine', label: translate('interests.wine'), icon: 'wine-outline', category: 'home' },
    { id: 'crafts', label: translate('interests.crafts'), icon: 'color-palette-outline', category: 'home' },
    
    // Arts & Culture
    { id: 'music', label: translate('interests.music'), icon: 'musical-notes-outline', category: 'arts' },
    { id: 'reading', label: translate('interests.reading'), icon: 'book-outline', category: 'arts' },
    { id: 'theater', label: translate('interests.theater'), icon: 'film-outline', category: 'arts' },
    { id: 'dancing', label: translate('interests.dancing'), icon: 'pulse-outline', category: 'arts' },
    { id: 'photography', label: translate('interests.photography'), icon: 'camera-outline', category: 'arts' },
    
    // Social
    { id: 'churchGroup', label: translate('interests.churchGroup'), icon: 'people-outline', category: 'social' },
    { id: 'volunteering', label: translate('interests.volunteering'), icon: 'hand-left-outline', category: 'social' },
    { id: 'marketDays', label: translate('interests.marketDays'), icon: 'storefront-outline', category: 'social' },
    { id: 'community', label: translate('interests.community'), icon: 'business-outline', category: 'social' },
    
    // Animals
    { id: 'dogs', label: translate('interests.dogs'), icon: 'paw-outline', category: 'animals' },
    { id: 'cats', label: translate('interests.cats'), icon: 'logo-octocat', category: 'animals' },
    { id: 'horses', label: translate('interests.horses'), icon: 'speedometer-outline', category: 'animals' },
    { id: 'wildlife', label: translate('interests.wildlife'), icon: 'telescope-outline', category: 'animals' },
    { id: 'birds', label: translate('interests.birds'), icon: 'airplane-outline', category: 'animals' },
  ];

  // Get unique categories
  const categories = [...new Set(interestsList.map(item => item.category))];
  
  // Translate category names
  const getCategoryName = (category) => {
    const categoryNames = {
      'outdoor': translate('categories.outdoor'),
      'sports': translate('categories.sports'),
      'home': translate('categories.home'),
      'arts': translate('categories.arts'),
      'social': translate('categories.social'),
      'animals': translate('categories.animals')
    };
    return categoryNames[category] || category;
  };

  // Toggle interest selection
  const toggleInterest = (interestId) => {
    const currentInterests = [...profile.interests];
    
    if (currentInterests.includes(interestId)) {
      // Remove if already selected
      const updatedInterests = currentInterests.filter(id => id !== interestId);
      updateProfile('interests', updatedInterests);
    } else {
      // Add if not selected
      updateProfile('interests', [...currentInterests, interestId]);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { width }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{translate('onboarding.selectInterests')}</Text>
      <Text style={styles.description}>{translate('onboarding.interestsDescription')}</Text>

      {categories.map(category => (
        <View key={category} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{getCategoryName(category)}</Text>
          <View style={styles.interestsContainer}>
            {interestsList
              .filter(interest => interest.category === category)
              .map(interest => (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestButton,
                    profile.interests.includes(interest.id) && styles.selectedInterestButton
                  ]}
                  onPress={() => toggleInterest(interest.id)}
                >
                  <Ionicons
                    name={interest.icon}
                    size={20}
                    color={profile.interests.includes(interest.id) ? '#FFF' : '#666'}
                    style={styles.interestIcon}
                  />
                  <Text
                    style={[
                      styles.interestText,
                      profile.interests.includes(interest.id) && styles.selectedInterestText
                    ]}
                  >
                    {interest.label}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      ))}

      <Text style={styles.selectedCount}>
        {translate('onboarding.selectedCount', { count: profile.interests.length })}
      </Text>
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
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#E63946',
    paddingLeft: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  interestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    margin: 4,
    backgroundColor: '#FFF',
  },
  selectedInterestButton: {
    backgroundColor: '#E63946',
    borderColor: '#E63946',
  },
  interestIcon: {
    marginRight: 6,
  },
  interestText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedInterestText: {
    color: '#FFF',
  },
  selectedCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default InterestsStep; 