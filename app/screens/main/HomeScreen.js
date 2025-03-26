import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '../../services/languageService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const HomeScreen = () => {
  const [profiles, setProfiles] = useState([
    // Sample profiles for demonstration
    {
      id: '1',
      displayName: 'Anna',
      age: 28,
      distance: 15,
      bio: 'Third generation farmer from Stellenbosch. Love my vineyard and making wine!',
      photos: ['https://images.unsplash.com/photo-1615212814093-f56085658024?q=80&w=1974&auto=format&fit=crop'],
      farmDetails: {
        hasFarm: true,
        farmType: 'vineyard'
      },
      location: {
        name: 'Stellenbosch, South Africa'
      }
    },
    {
      id: '2',
      displayName: 'Johan',
      age: 32,
      distance: 23,
      bio: 'Cattle farmer from the Eastern Cape. Looking for someone who enjoys farm life and outdoor activities.',
      photos: ['https://images.unsplash.com/photo-1530268729831-4b0b9e170218?q=80&w=2070&auto=format&fit=crop'],
      farmDetails: {
        hasFarm: true,
        farmType: 'livestock'
      },
      location: {
        name: 'Grahamstown, South Africa'
      }
    },
    {
      id: '3',
      displayName: 'Lerato',
      age: 26,
      distance: 42,
      bio: 'I run a small vegetable farm and I love hiking and outdoor adventures.',
      photos: ['https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?q=80&w=1968&auto=format&fit=crop'],
      farmDetails: {
        hasFarm: true,
        farmType: 'crops'
      },
      location: {
        name: 'Nelspruit, South Africa'
      }
    },
  ]);
  const [loading, setLoading] = useState(false);
  
  const position = useRef(new Animated.ValueXY()).current;
  const currentIndex = useRef(0);
  
  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      }
    })
  ).current;
  
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: true
    }).start();
  };
  
  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH * 1.5, y: 0 },
      duration: 250,
      useNativeDriver: true
    }).start(() => handleSwipe('left'));
  };
  
  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH * 1.5, y: 0 },
      duration: 250,
      useNativeDriver: true
    }).start(() => handleSwipe('right'));
  };
  
  const handleSwipe = (direction) => {
    const nextIndex = currentIndex.current + 1;
    
    if (nextIndex >= profiles.length) {
      // No more profiles, reset or fetch more
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setLoading(false);
        currentIndex.current = 0;
        position.setValue({ x: 0, y: 0 });
      }, 1000);
    } else {
      currentIndex.current = nextIndex;
      position.setValue({ x: 0, y: 0 });
    }
  };
  
  // Calculate rotation based on swipe position
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });
  
  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  const passOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  
  const renderProfile = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E63946" />
          <Text style={styles.loadingText}>{translate('common.loading')}</Text>
        </View>
      );
    }
    
    if (profiles.length === 0 || currentIndex.current >= profiles.length) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={60} color="#ccc" />
          <Text style={styles.emptyTitle}>{translate('discover.noProfiles')}</Text>
          <Text style={styles.emptyText}>{translate('discover.noProfilesDescription')}</Text>
          <TouchableOpacity style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>{translate('discover.refresh')}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    const profile = profiles[currentIndex.current];
    
    return (
      <Animated.View
        key={profile.id}
        style={[
          styles.cardContainer,
          {
            transform: [
              { translateX: position.x },
              { rotate: rotate }
            ]
          }
        ]}
        {...panResponder.panHandlers}
      >
        <Image source={{ uri: profile.photos[0] }} style={styles.profileImage} />
        
        <View style={styles.cardOverlay}>
          {/* Like badge */}
          <Animated.View style={[styles.badge, styles.likeBadge, { opacity: likeOpacity }]}>
            <Text style={styles.badgeText}>{translate('discover.like').toUpperCase()}</Text>
          </Animated.View>
          
          {/* Pass badge */}
          <Animated.View style={[styles.badge, styles.passBadge, { opacity: passOpacity }]}>
            <Text style={styles.badgeText}>{translate('discover.pass').toUpperCase()}</Text>
          </Animated.View>
          
          <View style={styles.profileInfo}>
            <View style={styles.nameAgeContainer}>
              <Text style={styles.profileName}>{profile.displayName}</Text>
              <Text style={styles.profileAge}>{profile.age}</Text>
            </View>
            
            {profile.location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color="#fff" />
                <Text style={styles.locationText}>{profile.location.name}</Text>
              </View>
            )}
            
            {profile.distance && (
              <Text style={styles.distanceText}>
                {translate('discover.kmAway', { distance: profile.distance })}
              </Text>
            )}
            
            {profile.farmDetails && profile.farmDetails.hasFarm && (
              <View style={styles.farmBadge}>
                <Text style={styles.farmBadgeText}>
                  {translate(`profile.${profile.farmDetails.farmType || 'farmOwner'}`)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{translate('discover.title')}</Text>
      </View>
      
      <View style={styles.cardsContainer}>
        {renderProfile()}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={swipeLeft}>
          <Ionicons name="close-circle" size={60} color="#F95738" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={swipeRight}>
          <Ionicons name="heart-circle" size={60} color="#E63946" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginRight: 8,
  },
  profileAge: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 2,
    opacity: 0.8,
  },
  farmBadge: {
    marginTop: 8,
    backgroundColor: '#E63946',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  farmBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 16,
  },
  actionButton: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 4,
    borderRadius: 10,
    transform: [{ rotate: '-30deg' }],
  },
  likeBadge: {
    right: 20,
    borderColor: '#52C41A',
  },
  passBadge: {
    left: 20,
    borderColor: '#F95738',
  },
  badgeText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#E63946',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  profileInfo: {
    paddingTop: 12,
  },
});

export default HomeScreen; 