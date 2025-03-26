import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '../../services/languageService';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = width;

const UserProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params || {};
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  // Sample user data (would be fetched from Firestore in a real app)
  const user = {
    id: userId || 'user456',
    displayName: 'Anna Visser',
    age: 28,
    location: 'Stellenbosch, Western Cape',
    distance: 15,
    bio: 'Fourth-generation olive farmer passionate about sustainable agriculture. My family farm produces award-winning olive oil and table olives. Looking to connect with like-minded farmers who value tradition but embrace innovation.',
    photos: [
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523224042829-4731dd15a3bb?q=80&w=2026&auto=format&fit=crop',
    ],
    farmDetails: {
      name: 'Visser Family Olives',
      type: 'Olive Farm',
      size: '35 hectares',
      products: ['Extra Virgin Olive Oil', 'Kalamata Olives', 'Nocellara Olives']
    },
    interests: ['Sustainable Farming', 'Irrigation Systems', 'Farmers Markets', 'Hiking', 'Wine Tasting']
  };
  
  // Handle navigation to chat
  const handleMessagePress = () => {
    navigation.navigate('Chat', {
      matchId: user.id,
      matchName: user.displayName,
      matchPhoto: user.photos[0]
    });
  };
  
  // Handle like/unlike
  const handleLikePress = () => {
    if (isLiked) {
      Alert.alert(
        translate('matching.unlikeUser'),
        translate('matching.unlikeUserConfirm'),
        [
          {
            text: translate('common.cancel'),
            style: 'cancel'
          },
          {
            text: translate('common.yes'),
            onPress: () => setIsLiked(false)
          }
        ]
      );
    } else {
      setIsLiked(true);
      // In a real app, you would check for a match here
      // and show a different alert if it's a match
      Alert.alert(
        translate('matching.liked'),
        translate('matching.likedMessage')
      );
    }
  };
  
  // Handle report user
  const handleReportPress = () => {
    Alert.alert(
      translate('common.reportUser'),
      translate('common.reportUserConfirm'),
      [
        {
          text: translate('common.cancel'),
          style: 'cancel'
        },
        {
          text: translate('common.report'),
          onPress: () => {
            // In a real app, you would send a report to the backend
            Alert.alert(
              translate('common.reportSent'),
              translate('common.reportSentMessage')
            );
          }
        }
      ]
    );
  };
  
  // Render photos pagination
  const renderPagination = () => (
    <View style={styles.pagination}>
      {user.photos.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentPhotoIndex && styles.paginationDotActive
          ]}
        />
      ))}
    </View>
  );
  
  // Handle photo change
  const handlePreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };
  
  const handleNextPhoto = () => {
    if (currentPhotoIndex < user.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photos section with pagination */}
        <View style={styles.photosContainer}>
          <Image
            source={{ uri: user.photos[currentPhotoIndex] }}
            style={styles.photo}
          />
          
          {/* Navigation arrows for photos */}
          {currentPhotoIndex > 0 && (
            <TouchableOpacity 
              style={[styles.photoNavButton, styles.photoNavButtonLeft]}
              onPress={handlePreviousPhoto}
            >
              <Ionicons name="chevron-back" size={30} color="#fff" />
            </TouchableOpacity>
          )}
          
          {currentPhotoIndex < user.photos.length - 1 && (
            <TouchableOpacity 
              style={[styles.photoNavButton, styles.photoNavButtonRight]}
              onPress={handleNextPhoto}
            >
              <Ionicons name="chevron-forward" size={30} color="#fff" />
            </TouchableOpacity>
          )}
          
          {renderPagination()}
          
          {/* Back button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          {/* Report button */}
          <TouchableOpacity 
            style={styles.reportButton}
            onPress={handleReportPress}
          >
            <Ionicons name="flag-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* User info header */}
        <View style={styles.userInfoHeader}>
          <View>
            <Text style={styles.userName}>{user.displayName}, {user.age}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.locationText}>{user.location}</Text>
            </View>
            <Text style={styles.distanceText}>{user.distance} km {translate('profile.away')}</Text>
          </View>
          
          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, isLiked ? styles.likedButton : styles.likeButton]}
              onPress={handleLikePress}
            >
              <Ionicons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={24} 
                color={isLiked ? "#fff" : "#E63946"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.messageButton}
              onPress={handleMessagePress}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Bio section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translate('profile.about')}</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
        
        {/* Farm details section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translate('profile.farmDetails')}</Text>
          
          <View style={styles.farmDetailsContainer}>
            <View style={styles.farmDetailItem}>
              <Ionicons name="business-outline" size={20} color="#E63946" />
              <View>
                <Text style={styles.farmDetailLabel}>{translate('profile.farmName')}</Text>
                <Text style={styles.farmDetailText}>{user.farmDetails.name}</Text>
              </View>
            </View>
            
            <View style={styles.farmDetailItem}>
              <Ionicons name="leaf-outline" size={20} color="#E63946" />
              <View>
                <Text style={styles.farmDetailLabel}>{translate('profile.farmType')}</Text>
                <Text style={styles.farmDetailText}>{user.farmDetails.type}</Text>
              </View>
            </View>
            
            <View style={styles.farmDetailItem}>
              <Ionicons name="resize-outline" size={20} color="#E63946" />
              <View>
                <Text style={styles.farmDetailLabel}>{translate('profile.farmSize')}</Text>
                <Text style={styles.farmDetailText}>{user.farmDetails.size}</Text>
              </View>
            </View>
            
            <View style={styles.productsContainer}>
              <Text style={styles.productsLabel}>{translate('profile.farmProducts')}</Text>
              <View style={styles.productsList}>
                {user.farmDetails.products.map((product, index) => (
                  <View key={index} style={styles.productBadge}>
                    <Text style={styles.productText}>{product}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        
        {/* Interests section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translate('profile.interests')}</Text>
          <View style={styles.interestsList}>
            {user.interests.map((interest, index) => (
              <View key={index} style={styles.interestBadge}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Common connection - would be dynamic in a real app */}
        <View style={styles.connectionSection}>
          <Ionicons name="git-network-outline" size={24} color="#E63946" />
          <Text style={styles.connectionText}>
            {translate('profile.commonConnection')}: <Text style={styles.connectionName}>Stellenbosch Farmers Association</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  photosContainer: {
    height: PHOTO_SIZE,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  photoNavButton: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    padding: 10,
    marginTop: -25,
  },
  photoNavButtonLeft: {
    left: 10,
  },
  photoNavButtonRight: {
    right: 10,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  reportButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  userInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#E63946',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
  },
  likeButton: {
    borderColor: '#E63946',
    backgroundColor: '#fff',
  },
  likedButton: {
    backgroundColor: '#E63946',
    borderColor: '#E63946',
  },
  messageButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
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
  farmDetailsContainer: {
    marginTop: 8,
  },
  farmDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  farmDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  farmDetailText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginLeft: 12,
  },
  productsContainer: {
    marginLeft: 32,
  },
  productsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productBadge: {
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  productText: {
    color: '#0079BF',
    fontSize: 14,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestBadge: {
    backgroundColor: '#F8F1E7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: '#D48D3B',
    fontSize: 14,
  },
  connectionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF9FA',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    marginBottom: 20,
  },
  connectionText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  connectionName: {
    fontWeight: '600',
    color: '#E63946',
  },
});

export default UserProfileScreen; 