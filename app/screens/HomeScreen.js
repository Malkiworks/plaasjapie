import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock data - would be fetched from backend in real app
const mockProfiles = [
  {
    id: '1',
    name: 'Thandi',
    age: 28,
    location: 'Cape Town',
    distance: '5 km away',
    bio: 'Love hiking Table Mountain and exploring local markets on weekends.',
    image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    interests: ['Traditional music', 'Hiking', 'Cooking'],
  },
  {
    id: '2',
    name: 'Johan',
    age: 32,
    location: 'Stellenbosch',
    distance: '15 km away',
    bio: 'Wine farmer by day, amateur astronomer by night. Looking for someone to share the beauty of the countryside.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    interests: ['Farming', 'Wine tasting', 'Astronomy'],
  },
  {
    id: '3',
    name: 'Nosipho',
    age: 25,
    location: 'Johannesburg',
    distance: '3 km away',
    bio: 'Urban professional with rural roots. Love visiting my family farm on weekends and attending cultural events.',
    image: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    interests: ['Township jazz', 'Heritage festivals', 'Reading'],
  }
];

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentProfile, setCurrentProfile] = useState(mockProfiles[0]);

  useEffect(() => {
    setCurrentProfile(mockProfiles[currentIndex]);
  }, [currentIndex]);

  const handleLike = () => {
    if (currentIndex < mockProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePass = () => {
    if (currentIndex < mockProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plaasjapie</Text>
      </View>

      <View style={styles.cardContainer}>
        <Image
          source={{ uri: currentProfile.image }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.nameText}>{currentProfile.name}, {currentProfile.age}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#555" />
            <Text style={styles.locationText}>{currentProfile.location} · {currentProfile.distance}</Text>
          </View>
          <Text style={styles.bioText}>{currentProfile.bio}</Text>
          
          <View style={styles.interestsContainer}>
            {currentProfile.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={handlePass}>
          <Ionicons name="close-circle" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleLike}>
          <Ionicons name="heart" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E63946', // South African red
  },
  cardContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '60%',
  },
  profileInfo: {
    padding: 16,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
  },
  bioText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 22,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#FF5864', // Red
  },
  likeButton: {
    backgroundColor: '#4CD964', // Green
  },
}); 