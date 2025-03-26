import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Only import maps for native platforms
let MapView = null;
let Marker = null;
if (Platform.OS !== 'web') {
  try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
  } catch (error) {
    console.warn('Could not load react-native-maps:', error);
  }
}

import { translate } from '../../../services/languageService';

const LocationStep = ({ profile, updateProfile, width }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Request location permissions when component mounts
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          translate('common.error'),
          translate('onboarding.locationPermissionDenied')
        );
      }
    })();
  }, []);

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      // Check permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          translate('common.error'),
          translate('onboarding.locationPermissionDenied')
        );
        setLoading(false);
        return;
      }
      
      // Get location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      // Reverse geocode to get address
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      if (geocode && geocode.length > 0) {
        const address = geocode[0];
        const locationName = [
          address.city || address.subregion || address.region,
          address.country
        ].filter(Boolean).join(', ');
        
        updateProfile('location', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          name: locationName,
          address: address
        });
      }
    } catch (error) {
      Alert.alert(
        translate('common.error'),
        translate('errors.locationError')
      );
      console.error('Error getting location:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search for locations
  const searchLocations = async (query) => {
    if (query.length < 3) return;
    
    try {
      setLoading(true);
      
      const geocode = await Location.geocodeAsync(query);
      
      if (geocode && geocode.length > 0) {
        // Limit to first 5 results
        const limitedResults = geocode.slice(0, 5);
        
        // For each result, reverse geocode to get place name
        const resultsWithNames = await Promise.all(
          limitedResults.map(async (item) => {
            const addressDetails = await Location.reverseGeocodeAsync({
              latitude: item.latitude,
              longitude: item.longitude
            });
            
            if (addressDetails && addressDetails.length > 0) {
              const address = addressDetails[0];
              const locationName = [
                address.city || address.subregion || address.region,
                address.country
              ].filter(Boolean).join(', ');
              
              return {
                ...item,
                name: locationName,
                address: address
              };
            }
            
            return item;
          })
        );
        
        setSearchResults(resultsWithNames);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Select a location from search results
  const selectLocation = (location) => {
    updateProfile('location', location);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Handle map marker drag
  const handleMarkerDrag = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      if (geocode && geocode.length > 0) {
        const address = geocode[0];
        const locationName = [
          address.city || address.subregion || address.region,
          address.country
        ].filter(Boolean).join(', ');
        
        updateProfile('location', {
          latitude,
          longitude,
          name: locationName,
          address: address
        });
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  // Web-specific location display component
  const WebLocationDisplay = () => (
    <View style={styles.webLocationContainer}>
      <View style={styles.locationInfo}>
        <Ionicons name="location" size={20} color="#E63946" />
        <Text style={styles.locationName}>{profile.location.name}</Text>
      </View>
      <Text style={styles.webMapMessage}>
        {translate('onboarding.locationSaved')}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { width }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{translate('onboarding.yourLocation')}</Text>
      <Text style={styles.description}>{translate('onboarding.locationPrompt')}</Text>
      
      {/* Current Location Button */}
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={getCurrentLocation}
        disabled={loading}
      >
        <Ionicons name="locate" size={20} color="#E63946" />
        <Text style={styles.currentLocationText}>
          {translate('onboarding.useCurrentLocation')}
        </Text>
        {loading && <ActivityIndicator size="small" color="#E63946" style={styles.loader} />}
      </TouchableOpacity>
      
      {/* Location Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={translate('onboarding.searchLocation')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => searchLocations(searchQuery)}
          clearButtonMode="while-editing"
        />
      </View>
      
      {/* Search Results */}
      {showSearchResults && searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          {searchResults.map((result, index) => (
            <TouchableOpacity
              key={index}
              style={styles.resultItem}
              onPress={() => selectLocation(result)}
            >
              <Ionicons name="location" size={20} color="#666" />
              <Text style={styles.resultText}>{result.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Map View - Conditionally rendered based on platform */}
      {profile.location && (
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' || !MapView ? (
            <WebLocationDisplay />
          ) : (
            <>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: profile.location.latitude,
                  longitude: profile.location.longitude,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}
                region={{
                  latitude: profile.location.latitude,
                  longitude: profile.location.longitude,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: profile.location.latitude,
                    longitude: profile.location.longitude,
                  }}
                  draggable
                  onDragEnd={handleMarkerDrag}
                />
              </MapView>
              
              <View style={styles.locationInfo}>
                <Ionicons name="location" size={20} color="#E63946" />
                <Text style={styles.locationName}>{profile.location.name}</Text>
              </View>
              
              <Text style={styles.dragHint}>
                {translate('onboarding.dragToAdjust')}
              </Text>
            </>
          )}
        </View>
      )}
      
      {/* Location Required Message */}
      {!profile.location && (
        <Text style={styles.requiredMessage}>
          {translate('onboarding.locationRequired')}
        </Text>
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
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E63946',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currentLocationText: {
    fontSize: 16,
    color: '#E63946',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  loader: {
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 200,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: 250,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  dragHint: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  requiredMessage: {
    fontSize: 16,
    color: '#E63946',
    textAlign: 'center',
    marginTop: 24,
  },
  // Add new styles for web
  webLocationContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  webMapMessage: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default LocationStep; 