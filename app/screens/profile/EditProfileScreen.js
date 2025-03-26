import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { translate } from '../../services/languageService';
import { useApp } from '../../context/AppContext';

const EditProfileScreen = ({ navigation }) => {
  // Access user context
  const { user } = useApp();
  
  // Sample user data (replace with context data in real app)
  const [profile, setProfile] = useState({
    displayName: 'Johan Botha',
    age: 32,
    location: 'Stellenbosch, Western Cape',
    bio: 'Fourth-generation wine farmer with a passion for sustainable viticulture. Our family vineyard has been producing award-winning wines since 1920. Looking to connect with other farmers and share knowledge.',
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=1889&auto=format&fit=crop',
    ],
    farmDetails: {
      name: 'Botha Family Vineyards',
      type: 'Vineyard',
      size: '75 hectares',
      products: ['Cabernet Sauvignon', 'Chenin Blanc', 'Pinotage']
    },
    interests: ['Viticulture', 'Irrigation Systems', 'Organic Farming', 'Hiking', 'Wine Tasting'],
    phoneNumber: '+27 82 123 4567',
    email: 'johan@bothawines.co.za'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [newProduct, setNewProduct] = useState('');
  const [newInterest, setNewInterest] = useState('');
  
  // Request permissions for image library
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          translate('common.permissionDenied'),
          translate('profile.cameraRollPermission')
        );
      }
    })();
  }, []);
  
  // Handle text input changes
  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle farm details changes
  const handleFarmDetailsChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      farmDetails: {
        ...prev.farmDetails,
        [field]: value
      }
    }));
  };
  
  // Add new product
  const addProduct = () => {
    if (newProduct.trim() === '') return;
    
    setProfile(prev => ({
      ...prev,
      farmDetails: {
        ...prev.farmDetails,
        products: [...prev.farmDetails.products, newProduct.trim()]
      }
    }));
    
    setNewProduct('');
  };
  
  // Remove product
  const removeProduct = (index) => {
    setProfile(prev => ({
      ...prev,
      farmDetails: {
        ...prev.farmDetails,
        products: prev.farmDetails.products.filter((_, i) => i !== index)
      }
    }));
  };
  
  // Add new interest
  const addInterest = () => {
    if (newInterest.trim() === '') return;
    
    setProfile(prev => ({
      ...prev,
      interests: [...prev.interests, newInterest.trim()]
    }));
    
    setNewInterest('');
  };
  
  // Remove interest
  const removeInterest = (index) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };
  
  // Pick image from library
  const pickImage = async (index) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        // Update photo at specific index
        let updatedPhotos = [...profile.photos];
        
        if (index !== undefined && index < updatedPhotos.length) {
          // Replace photo at index
          updatedPhotos[index] = photoUri;
        } else {
          // Add new photo
          updatedPhotos.push(photoUri);
        }
        
        // Limit to MAX_PHOTOS
        if (updatedPhotos.length > 6) {
          updatedPhotos = updatedPhotos.slice(0, 6);
        }
        
        setProfile(prev => ({
          ...prev,
          photos: updatedPhotos
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(translate('common.error'), translate('profile.imagePickerError'));
    }
  };
  
  // Remove photo
  const removePhoto = (index) => {
    if (profile.photos.length <= 1) {
      Alert.alert(
        translate('common.error'),
        translate('profile.lastPhotoError')
      );
      return;
    }
    
    setProfile(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };
  
  // Save profile
  const saveProfile = async () => {
    // Validation
    if (!profile.displayName.trim()) {
      Alert.alert(translate('common.error'), translate('profile.nameRequired'));
      return;
    }
    
    // Show saving indicator
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Success
      Alert.alert(
        translate('profile.profileUpdated'),
        translate('profile.profileUpdatedMessage'),
        [
          {
            text: translate('common.ok'),
            onPress: () => navigation.goBack()
          }
        ]
      );
    }, 1500);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{translate('profile.editProfile')}</Text>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={saveProfile}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>{translate('common.save')}</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scrollView}>
          {/* Photos section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translate('profile.photos')}</Text>
            <Text style={styles.sectionDescription}>{translate('profile.photosDescription')}</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.photosContainer}
              contentContainerStyle={styles.photosContent}
            >
              {profile.photos.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.editPhotoButton}
                    onPress={() => pickImage(index)}
                  >
                    <Ionicons name="pencil" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                  {index === 0 && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryBadgeText}>{translate('profile.primary')}</Text>
                    </View>
                  )}
                </View>
              ))}
              
              {profile.photos.length < 6 && (
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={() => pickImage()}
                >
                  <Ionicons name="add" size={32} color="#666" />
                  <Text style={styles.addPhotoText}>{translate('profile.addPhoto')}</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
          
          {/* Basic Info section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translate('profile.basicInfo')}</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{translate('profile.name')}</Text>
              <TextInput
                style={styles.textInput}
                value={profile.displayName}
                onChangeText={(value) => handleInputChange('displayName', value)}
                placeholder={translate('profile.namePlaceholder')}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{translate('profile.age')}</Text>
              <TextInput
                style={styles.textInput}
                value={profile.age.toString()}
                onChangeText={(value) => handleInputChange('age', parseInt(value) || '')}
                placeholder={translate('profile.agePlaceholder')}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{translate('profile.location')}</Text>
              <TextInput
                style={styles.textInput}
                value={profile.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholder={translate('profile.locationPlaceholder')}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{translate('profile.bio')}</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={profile.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
                placeholder={translate('profile.bioPlaceholder')}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
          
          {/* Contact Info section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translate('profile.contactInfo')}</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{translate('profile.phoneNumber')}</Text>
              <TextInput
                style={styles.textInput}
                value={profile.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                placeholder={translate('profile.phoneNumberPlaceholder')}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{translate('profile.email')}</Text>
              <TextInput
                style={styles.textInput}
                value={profile.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder={translate('profile.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          {/* Farm Details section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translate('profile.farmDetails')}</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{translate('profile.farmName')}</Text>
              <TextInput
                style={styles.textInput}
                value={profile.farmDetails.name}
                onChangeText={(value) => handleFarmDetailsChange('name', value)}
                placeholder={translate('profile.farmNamePlaceholder')}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{translate('profile.farmType')}</Text>
              <TextInput
                style={styles.textInput}
                value={profile.farmDetails.type}
                onChangeText={(value) => handleFarmDetailsChange('type', value)}
                placeholder={translate('profile.farmTypePlaceholder')}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{translate('profile.farmSize')}</Text>
              <TextInput
                style={styles.textInput}
                value={profile.farmDetails.size}
                onChangeText={(value) => handleFarmDetailsChange('size', value)}
                placeholder={translate('profile.farmSizePlaceholder')}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{translate('profile.farmProducts')}</Text>
              <View style={styles.chipList}>
                {profile.farmDetails.products.map((product, index) => (
                  <View key={index} style={styles.chip}>
                    <Text style={styles.chipText}>{product}</Text>
                    <TouchableOpacity
                      style={styles.chipRemove}
                      onPress={() => removeProduct(index)}
                    >
                      <Ionicons name="close-circle" size={18} color="#0079BF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              
              <View style={styles.addItemContainer}>
                <TextInput
                  style={[styles.textInput, styles.addItemInput]}
                  value={newProduct}
                  onChangeText={setNewProduct}
                  placeholder={translate('profile.addProduct')}
                />
                <TouchableOpacity
                  style={styles.addItemButton}
                  onPress={addProduct}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Interests section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translate('profile.interests')}</Text>
            <Text style={styles.sectionDescription}>{translate('profile.interestsDescription')}</Text>
            
            <View style={styles.chipList}>
              {profile.interests.map((interest, index) => (
                <View key={index} style={[styles.chip, styles.interestChip]}>
                  <Text style={[styles.chipText, styles.interestChipText]}>{interest}</Text>
                  <TouchableOpacity
                    style={styles.chipRemove}
                    onPress={() => removeInterest(index)}
                  >
                    <Ionicons name="close-circle" size={18} color="#D48D3B" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            
            <View style={styles.addItemContainer}>
              <TextInput
                style={[styles.textInput, styles.addItemInput]}
                value={newInterest}
                onChangeText={setNewInterest}
                placeholder={translate('profile.addInterest')}
              />
              <TouchableOpacity
                style={[styles.addItemButton, styles.addInterestButton]}
                onPress={addInterest}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#E63946',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  photosContainer: {
    marginTop: 16,
  },
  photosContent: {
    paddingBottom: 8,
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  photo: {
    width: 100,
    height: 130,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#E63946',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  primaryBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  addPhotoButton: {
    width: 100,
    height: 130,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  addPhotoText: {
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
    fontSize: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8F8F8',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  chipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  interestChip: {
    backgroundColor: '#F8F1E7',
  },
  chipText: {
    color: '#0079BF',
    marginRight: 4,
  },
  interestChipText: {
    color: '#D48D3B',
  },
  chipRemove: {
    padding: 2,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addItemInput: {
    flex: 1,
    marginRight: 8,
  },
  addItemButton: {
    backgroundColor: '#0079BF',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addInterestButton: {
    backgroundColor: '#D48D3B',
  },
  bottomPadding: {
    height: 40,
  },
});

export default EditProfileScreen; 