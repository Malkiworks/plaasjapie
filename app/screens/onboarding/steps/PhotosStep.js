import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { translate } from '../../../services/languageService';

const MAX_PHOTOS = 6;

const PhotosStep = ({ profile, updateProfile, width }) => {
  // Request camera and library permissions
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert(
          translate('errors.permissionRequired'),
          translate('errors.cameraPermission'),
          [{ text: translate('common.ok') }]
        );
        return false;
      }
    }
    return true;
  };

  // Take a photo using camera
  const takePhoto = async () => {
    if (profile.photos.length >= MAX_PHOTOS) {
      Alert.alert(
        translate('errors.error'),
        translate('profile.maxPhotosReached', { count: MAX_PHOTOS }),
        [{ text: translate('common.ok') }]
      );
      return;
    }

    const permissionsGranted = await requestPermissions();
    if (!permissionsGranted) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        updateProfile('photos', [...profile.photos, selectedImage.uri]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(translate('errors.error'), translate('errors.somethingWentWrong'));
    }
  };

  // Pick photos from library
  const pickImages = async () => {
    if (profile.photos.length >= MAX_PHOTOS) {
      Alert.alert(
        translate('errors.error'),
        translate('profile.maxPhotosReached', { count: MAX_PHOTOS }),
        [{ text: translate('common.ok') }]
      );
      return;
    }

    const permissionsGranted = await requestPermissions();
    if (!permissionsGranted) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: MAX_PHOTOS - profile.photos.length,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUris = result.assets.map(asset => asset.uri);
        updateProfile('photos', [...profile.photos, ...selectedImageUris]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert(translate('errors.error'), translate('errors.somethingWentWrong'));
    }
  };

  // Remove a photo
  const removePhoto = (index) => {
    const updatedPhotos = [...profile.photos];
    updatedPhotos.splice(index, 1);
    updateProfile('photos', updatedPhotos);
  };

  // Reorder photos (set as primary)
  const setAsPrimary = (index) => {
    if (index === 0) return; // Already primary
    
    const updatedPhotos = [...profile.photos];
    const primaryPhoto = updatedPhotos.splice(index, 1)[0];
    updatedPhotos.unshift(primaryPhoto);
    updateProfile('photos', updatedPhotos);
  };

  return (
    <ScrollView 
      style={[styles.container, { width }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.description}>
        {translate('onboarding.photoDescription')}
      </Text>
      
      <View style={styles.photosContainer}>
        {/* Current photos */}
        {profile.photos.map((photo, index) => (
          <View key={index} style={styles.photoWrapper}>
            <Image source={{ uri: photo }} style={styles.photo} />
            
            <View style={styles.photoActions}>
              {index > 0 && (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => setAsPrimary(index)}
                >
                  <Ionicons name="star" size={18} color="#FFF" />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removePhoto(index)}
              >
                <Ionicons name="trash" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            {index === 0 && (
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryText}>{translate('profile.primary')}</Text>
              </View>
            )}
          </View>
        ))}
        
        {/* Add more photos if less than max */}
        {profile.photos.length < MAX_PHOTOS && (
          <View style={styles.addPhotoContainer}>
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={pickImages}
            >
              <Ionicons name="images-outline" size={32} color="#666" />
              <Text style={styles.addPhotoText}>{translate('onboarding.addPhotos')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={takePhoto}
          disabled={profile.photos.length >= MAX_PHOTOS}
        >
          <Ionicons name="camera" size={24} color="#FFF" />
          <Text style={styles.buttonText}>{translate('onboarding.takePhoto')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={pickImages}
          disabled={profile.photos.length >= MAX_PHOTOS}
        >
          <Ionicons name="images" size={24} color="#FFF" />
          <Text style={styles.buttonText}>{translate('onboarding.fromGallery')}</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.photoTips}>
        {translate('onboarding.photoTips')}
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
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  photoWrapper: {
    width: '48%',
    aspectRatio: 0.8,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  photoActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: 'rgba(230, 57, 70, 0.8)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  addPhotoContainer: {
    width: '48%',
    aspectRatio: 0.8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  addPhotoText: {
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cameraButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#5C7AEA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  galleryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E63946',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  photoTips: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default PhotosStep; 