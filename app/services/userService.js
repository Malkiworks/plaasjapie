import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  limit, 
  orderBy, 
  startAfter,
  GeoPoint,
  serverTimestamp
} from 'firebase/firestore';
import { firestore } from './firebase';

// Get user profile by ID
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    
    if (userDoc.exists()) {
      return { success: true, profile: userDoc.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    // If location is provided as lat/lng, convert to GeoPoint
    let dataToUpdate = { ...profileData };
    
    if (profileData.location && 
        typeof profileData.location === 'object' && 
        'latitude' in profileData.location && 
        'longitude' in profileData.location) {
      dataToUpdate.location = new GeoPoint(
        profileData.location.latitude, 
        profileData.location.longitude
      );
    }
    
    await updateDoc(doc(firestore, 'users', userId), {
      ...dataToUpdate,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user interests
export const updateUserInterests = async (userId, interests) => {
  try {
    await updateDoc(doc(firestore, 'users', userId), {
      interests,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get potential matches for a user
// This is a basic implementation. In a real app, you'd have more complex matching algorithms.
export const getPotentialMatches = async (userId, userPreferences, lastVisible = null, matchesPerPage = 10) => {
  try {
    // Get current user's profile
    const userProfile = await getUserProfile(userId);
    
    if (!userProfile.success) {
      return { success: false, error: 'Failed to load user profile' };
    }
    
    // Build query based on user preferences
    let matchQuery = collection(firestore, 'users');
    const filters = [];
    
    // Don't match with yourself
    filters.push(where('uid', '!=', userId));
    
    // Filter by gender preference if set
    if (userPreferences.lookingFor && userPreferences.lookingFor !== 'any') {
      filters.push(where('gender', '==', userPreferences.lookingFor));
    }
    
    // Age filter (if set)
    if (userPreferences.minAge && userPreferences.maxAge) {
      // This is simplified - real implementation would calculate date ranges from ages
      filters.push(where('age', '>=', userPreferences.minAge));
      filters.push(where('age', '<=', userPreferences.maxAge));
    }
    
    // Apply filters
    let q = query(matchQuery, ...filters, orderBy('lastLogin', 'desc'), limit(matchesPerPage));
    
    // If paginating with a lastVisible cursor
    if (lastVisible) {
      q = query(matchQuery, ...filters, orderBy('lastLogin', 'desc'), startAfter(lastVisible), limit(matchesPerPage));
    }
    
    const matchesSnapshot = await getDocs(q);
    const matches = [];
    let newLastVisible = null;
    
    matchesSnapshot.forEach(doc => {
      matches.push(doc.data());
      newLastVisible = doc;
    });
    
    return { 
      success: true, 
      matches, 
      lastVisible: newLastVisible, 
      hasMore: matches.length === matchesPerPage 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Record a "like" action
export const likeUser = async (currentUserId, likedUserId) => {
  try {
    // Record the like in Firestore
    await setDoc(doc(firestore, 'likes', `${currentUserId}_${likedUserId}`), {
      fromUser: currentUserId,
      toUser: likedUserId,
      timestamp: serverTimestamp()
    });
    
    // Check if the other user has already liked this user (to create a match)
    const reverseDoc = await getDoc(doc(firestore, 'likes', `${likedUserId}_${currentUserId}`));
    
    if (reverseDoc.exists()) {
      // Create a match document
      await setDoc(doc(firestore, 'matches', `${currentUserId}_${likedUserId}`), {
        users: [currentUserId, likedUserId],
        timestamp: serverTimestamp(),
        lastMessage: null,
        lastMessageTimestamp: null
      });
      
      return { success: true, isMatch: true };
    }
    
    return { success: true, isMatch: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Record a "pass" action
export const passUser = async (currentUserId, passedUserId) => {
  try {
    // Record the pass in Firestore
    await setDoc(doc(firestore, 'passes', `${currentUserId}_${passedUserId}`), {
      fromUser: currentUserId,
      toUser: passedUserId,
      timestamp: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all matches for a user
export const getUserMatches = async (userId) => {
  try {
    const q = query(
      collection(firestore, 'matches'),
      where('users', 'array-contains', userId),
      orderBy('lastMessageTimestamp', 'desc')
    );
    
    const matchesSnapshot = await getDocs(q);
    const matches = [];
    
    for (const matchDoc of matchesSnapshot.docs) {
      const matchData = matchDoc.data();
      
      // Get the other user's ID
      const otherUserId = matchData.users.find(id => id !== userId);
      
      // Get the other user's profile
      const otherUserProfile = await getUserProfile(otherUserId);
      
      if (otherUserProfile.success) {
        matches.push({
          matchId: matchDoc.id,
          profile: otherUserProfile.profile,
          lastMessage: matchData.lastMessage,
          lastMessageTimestamp: matchData.lastMessageTimestamp
        });
      }
    }
    
    return { success: true, matches };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  updateUserInterests,
  getPotentialMatches,
  likeUser,
  passUser,
  getUserMatches
}; 