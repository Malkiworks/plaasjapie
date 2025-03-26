import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, firestore, storage } from './firebase';
import { Platform } from 'react-native';

// Create a new user with email and password
export const registerWithEmail = async (email, password, displayName) => {
  try {
    console.log('Registering with email:', email);
    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Send verification email
    await sendEmailVerification(user);
    
    // Create user document in Firestore
    await setDoc(doc(firestore, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      interests: [],
      location: null,
      bio: '',
      birthdate: null,
      gender: '',
      lookingFor: '',
      languages: ['English'],
      isPremium: false,
      isVerified: false,
      onboardingCompleted: false
    });
    
    console.log('Registration successful');
    return { success: true, user };
  } catch (error) {
    console.error('Registration error:', error.code, error.message);
    return { success: false, error: error.message };
  }
};

// Sign in with email and password
export const loginWithEmail = async (email, password) => {
  try {
    console.log('Logging in with email:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last login
    try {
      await updateDoc(doc(firestore, 'users', user.uid), {
        lastLogin: new Date().toISOString()
      });
    } catch (updateError) {
      console.warn('Error updating last login:', updateError);
    }
    
    console.log('Login successful');
    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error.code, error.message);
    return { success: false, error: error.message };
  }
};

// Handle creating or updating user document
export const createOrUpdateUserDocument = async (user) => {
  try {
    // Check if user document exists in Firestore
    const userDoc = await getDoc(doc(firestore, 'users', user.uid));
     
    if (!userDoc.exists()) {
      // Create new user document if it doesn't exist
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        interests: [],
        location: null,
        bio: '',
        birthdate: null,
        gender: '',
        lookingFor: '',
        languages: ['English'],
        isPremium: false,
        isVerified: false,
        onboardingCompleted: false
      });
    } else {
      // Update last login timestamp
      await updateDoc(doc(firestore, 'users', user.uid), {
        lastLogin: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error creating/updating user document:', error);
    throw error;
  }
};

// Sign out
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (userID, profileData) => {
  try {
    // Update user document in Firestore
    await updateDoc(doc(firestore, 'users', userID), {
      ...profileData,
      updatedAt: new Date().toISOString()
    });
    
    // If there's a displayName, update auth profile as well
    if (profileData.displayName) {
      await updateProfile(auth.currentUser, { 
        displayName: profileData.displayName 
      });
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload profile picture
export const uploadProfilePicture = async (userID, imageURI) => {
  try {
    // Create a reference to the storage location
    const storageRef = ref(storage, `profile_pictures/${userID}`);
    
    let blob;
    try {
      // Convert URI to blob (using fetch which works in both web and mobile)
      const response = await fetch(imageURI);
      blob = await response.blob();
    } catch (error) {
      console.error('Error converting image to blob:', error);
      return { 
        success: false, 
        error: 'Failed to process image. Please try again.' 
      };
    }
    
    // Upload the image
    await uploadBytes(storageRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update user profile with new photo URL
    await updateProfile(auth.currentUser, { photoURL: downloadURL });
    
    // Update user document in Firestore
    await updateDoc(doc(firestore, 'users', userID), {
      photoURL: downloadURL,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, photoURL: downloadURL };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return { success: false, error: error.message };
  }
};

// Auth state observer with error handling
export const subscribeToAuthChanges = (callback) => {
  try {
    console.log('Setting up auth state observer');
    return onAuthStateChanged(auth, callback);
  } catch (error) {
    console.error('Error setting up auth state observer:', error);
    if (Platform.OS === 'web') {
      // Return a no-op function for web when something fails
      return () => {};
    }
    throw error;
  }
};

// Get current user data including Firestore profile
export const getCurrentUserWithProfile = async () => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.log('No current user found');
      return null;
    }
    
    console.log('Getting profile for user:', currentUser.uid);
    // Get user document from Firestore
    const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
    
    if (userDoc.exists()) {
      console.log('User profile found in Firestore');
      return {
        ...currentUser,
        profile: userDoc.data()
      };
    } else {
      console.log('No user profile found in Firestore');
      return currentUser;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return auth.currentUser;
  }
};

export default {
  registerWithEmail,
  loginWithEmail,
  logout,
  resetPassword,
  updateUserProfile,
  uploadProfilePicture,
  getCurrentUserWithProfile,
  subscribeToAuthChanges,
}; 