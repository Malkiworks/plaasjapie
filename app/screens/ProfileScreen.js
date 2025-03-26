import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock user data - would be fetched from auth context in real app
const userData = {
  name: 'Lerato Ndlovu',
  age: 27,
  location: 'Pretoria',
  bio: 'I grew up on a farm near Rustenburg but moved to the city for work. Love spending weekends back home and connecting with my roots. Looking for someone who appreciates both rural and urban life.',
  images: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  ],
  interests: ['Farming', 'Traditional Dance', 'Soccer', 'Braai', 'Reading'],
  languages: ['English', 'Zulu', 'Xhosa'],
  isVerified: true,
  premium: false,
};

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('about');

  const renderAboutSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>About Me</Text>
      <Text style={styles.bioText}>{userData.bio}</Text>

      <Text style={styles.sectionSubtitle}>My Interests</Text>
      <View style={styles.tagsContainer}>
        {userData.interests.map((interest, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{interest}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionSubtitle}>Languages</Text>
      <View style={styles.tagsContainer}>
        {userData.languages.map((language, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{language}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPhotosSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>My Photos</Text>
      <View style={styles.photoGrid}>
        {userData.images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.photoItem} />
        ))}
        <TouchableOpacity style={styles.addPhotoButton}>
          <Ionicons name="add-circle" size={40} color="#E63946" />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="settings-outline" size={24} color="#E63946" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: userData.images[0] }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{userData.name}, {userData.age}</Text>
              {userData.isVerified && (
                <Ionicons name="checkmark-circle" size={20} color="#4CD964" style={styles.verifiedIcon} />
              )}
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#555" />
              <Text style={styles.locationText}>{userData.location}</Text>
            </View>
            
            {!userData.premium && (
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'photos' && styles.activeTab]}
            onPress={() => setActiveTab('photos')}
          >
            <Text style={[styles.tabText, activeTab === 'photos' && styles.activeTabText]}>Photos</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'about' ? renderAboutSection() : renderPhotosSection()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
  },
  upgradeButton: {
    backgroundColor: '#E63946',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  upgradeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E63946',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#E63946',
    fontWeight: 'bold',
  },
  sectionContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  photoItem: {
    width: '30%',
    aspectRatio: 1,
    margin: 4,
    borderRadius: 8,
  },
  addPhotoButton: {
    width: '30%',
    aspectRatio: 1,
    margin: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
}); 