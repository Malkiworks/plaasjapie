import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '../../services/languageService';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { currentUser, userProfile } = useAuth();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {userProfile?.photos && userProfile.photos.length > 0 ? (
              <Image 
                source={{ uri: userProfile.photos[userProfile.primaryPhotoIndex || 0] }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person" size={60} color="#ccc" />
              </View>
            )}
          </View>
          
          <Text style={styles.name}>
            {userProfile?.displayName || 'Your Profile'}
          </Text>
          
          {userProfile?.location?.name && (
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.locationText}>{userProfile.location.name}</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={18} color="#FFF" />
            <Text style={styles.editButtonText}>{translate('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>
        
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translate('profile.about')}</Text>
          <Text style={styles.bioText}>
            {userProfile?.bio || 'Your bio will appear here after you complete the onboarding process.'}
          </Text>
        </View>
        
        {/* Farm Details Section */}
        {userProfile?.farmDetails?.hasFarm && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translate('profile.farm')}</Text>
            
            <View style={styles.farmDetails}>
              {userProfile.farmDetails.farmType && (
                <View style={styles.detailItem}>
                  <Ionicons name="leaf-outline" size={20} color="#E63946" />
                  <Text style={styles.detailText}>
                    {translate(`profile.${userProfile.farmDetails.farmType}`)}
                  </Text>
                </View>
              )}
              
              {userProfile.farmDetails.farmSize && (
                <View style={styles.detailItem}>
                  <Ionicons name="expand-outline" size={20} color="#E63946" />
                  <Text style={styles.detailText}>
                    {`${userProfile.farmDetails.farmSize} ${translate('profile.hectares')}`}
                  </Text>
                </View>
              )}
            </View>
            
            {userProfile.farmDetails.farmingActivities && 
             userProfile.farmDetails.farmingActivities.length > 0 && (
              <View style={styles.tagsContainer}>
                {userProfile.farmDetails.farmingActivities.map((activity, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>
                      {translate(`profile.${activity}`)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        
        {/* Interests Section */}
        {userProfile?.interests && userProfile.interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translate('onboarding.interests')}</Text>
            
            <View style={styles.tagsContainer}>
              {userProfile.interests.map((interest, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>
                    {translate(`interests.${interest}`)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#fff',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E63946',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  section: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  farmDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileScreen; 