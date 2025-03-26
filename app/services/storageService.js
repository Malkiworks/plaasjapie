import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from './firebase';
import * as FileSystem from 'expo-file-system';

// Upload a profile image
export const uploadProfileImage = async (userId, imageURI) => {
  try {
    // Create a reference to the profile image
    const storageRef = ref(storage, `profiles/${userId}/profile-image`);
    
    // Convert URI to blob
    const response = await fetch(imageURI);
    const blob = await response.blob();
    
    // Upload the image
    await uploadBytes(storageRef, blob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return { success: true, imageURL: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload multiple gallery images
export const uploadGalleryImages = async (userId, imageURIs) => {
  try {
    const downloadURLs = [];
    
    for (let i = 0; i < imageURIs.length; i++) {
      const imageURI = imageURIs[i];
      
      // Create a reference to the gallery image
      const storageRef = ref(storage, `profiles/${userId}/gallery-image-${Date.now()}-${i}`);
      
      // Convert URI to blob
      const response = await fetch(imageURI);
      const blob = await response.blob();
      
      // Upload the image
      await uploadBytes(storageRef, blob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      downloadURLs.push(downloadURL);
    }
    
    return { success: true, imageURLs: downloadURLs };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete a gallery image
export const deleteGalleryImage = async (imageURL) => {
  try {
    // Get the storage reference from the URL
    const storageRef = ref(storage, imageURL);
    
    // Delete the image
    await deleteObject(storageRef);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload a voice note
export const uploadVoiceNote = async (matchId, userId, voiceNoteURI) => {
  try {
    // Create a reference to the voice note
    const storageRef = ref(storage, `messages/${matchId}/voice-${userId}-${Date.now()}.m4a`);
    
    // Convert URI to blob
    const response = await fetch(voiceNoteURI);
    const blob = await response.blob();
    
    // Upload the voice note
    await uploadBytes(storageRef, blob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return { success: true, voiceNoteURL: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Cache an image locally
export const cacheImage = async (imageURL, cacheDirectory = FileSystem.cacheDirectory) => {
  try {
    // Create a unique filename based on the URL
    const filename = imageURL.split('/').pop();
    const filePath = `${cacheDirectory}images/${filename}`;
    
    // Check if directory exists, create if not
    const dirInfo = await FileSystem.getInfoAsync(`${cacheDirectory}images`);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(`${cacheDirectory}images`, { intermediates: true });
    }
    
    // Check if file already exists
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      return { success: true, localURI: filePath };
    }
    
    // Download the file
    const downloadResult = await FileSystem.downloadAsync(imageURL, filePath);
    
    if (downloadResult.status === 200) {
      return { success: true, localURI: downloadResult.uri };
    } else {
      return { success: false, error: 'Failed to download file' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all gallery images for a user
export const getGalleryImages = async (userId) => {
  try {
    // Create a reference to the gallery folder
    const storageRef = ref(storage, `profiles/${userId}`);
    
    // List all items in the folder
    const result = await listAll(storageRef);
    
    // Filter for gallery images
    const galleryRefs = result.items.filter(item => 
      item.name.startsWith('gallery-image-')
    );
    
    // Get download URLs for all gallery images
    const downloadURLs = await Promise.all(
      galleryRefs.map(async (itemRef) => {
        return await getDownloadURL(itemRef);
      })
    );
    
    return { success: true, imageURLs: downloadURLs };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Clean up temporary files
export const cleanupTemporaryFiles = async () => {
  try {
    const tempDirectory = `${FileSystem.cacheDirectory}ImagePicker`;
    
    // Check if directory exists
    const dirInfo = await FileSystem.getInfoAsync(tempDirectory);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(tempDirectory, { idempotent: true });
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  uploadProfileImage,
  uploadGalleryImages,
  deleteGalleryImage,
  uploadVoiceNote,
  cacheImage,
  getGalleryImages,
  cleanupTemporaryFiles
}; 