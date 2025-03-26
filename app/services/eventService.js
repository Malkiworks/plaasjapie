import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  GeoPoint,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from './firebase';

// Get events with filtering options
export const getEvents = async (filters = {}, lastVisible = null, eventsPerPage = 10) => {
  try {
    const eventsCollection = collection(firestore, 'events');
    const queryFilters = [];
    
    // Apply category filter if provided
    if (filters.category && filters.category !== 'all') {
      queryFilters.push(where('category', '==', filters.category));
    }
    
    // Apply saved filter if provided
    if (filters.saved === true && filters.userId) {
      queryFilters.push(where('savedBy', 'array-contains', filters.userId));
    }
    
    // Apply date filter if provided
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      queryFilters.push(where('date', '>=', startDate.toISOString()));
    }
    
    // Build the query
    let q = query(
      eventsCollection,
      ...queryFilters,
      orderBy('date', 'asc'),
      limit(eventsPerPage)
    );
    
    // If paginating with a lastVisible cursor
    if (lastVisible) {
      q = query(
        eventsCollection,
        ...queryFilters,
        orderBy('date', 'asc'),
        startAfter(lastVisible),
        limit(eventsPerPage)
      );
    }
    
    const eventsSnapshot = await getDocs(q);
    const events = [];
    let newLastVisible = null;
    
    eventsSnapshot.forEach(doc => {
      events.push({
        id: doc.id,
        ...doc.data()
      });
      newLastVisible = doc;
    });
    
    return { 
      success: true, 
      events, 
      lastVisible: newLastVisible, 
      hasMore: events.length === eventsPerPage 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get event details by ID
export const getEventById = async (eventId) => {
  try {
    const eventDoc = await getDoc(doc(firestore, 'events', eventId));
    
    if (eventDoc.exists()) {
      return { success: true, event: { id: eventDoc.id, ...eventDoc.data() } };
    } else {
      return { success: false, error: 'Event not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Save an event for a user
export const saveEvent = async (eventId, userId) => {
  try {
    const eventRef = doc(firestore, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      return { success: false, error: 'Event not found' };
    }
    
    const event = eventDoc.data();
    const savedBy = event.savedBy || [];
    
    // Check if already saved
    if (savedBy.includes(userId)) {
      return { success: true, alreadySaved: true };
    }
    
    // Add user to the savedBy array
    await updateDoc(eventRef, {
      savedBy: [...savedBy, userId]
    });
    
    // Also create a record in the user's saved events collection
    await setDoc(doc(firestore, `users/${userId}/savedEvents`, eventId), {
      eventId,
      savedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Unsave an event for a user
export const unsaveEvent = async (eventId, userId) => {
  try {
    const eventRef = doc(firestore, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      return { success: false, error: 'Event not found' };
    }
    
    const event = eventDoc.data();
    const savedBy = event.savedBy || [];
    
    // Check if not saved
    if (!savedBy.includes(userId)) {
      return { success: true, notSaved: true };
    }
    
    // Remove user from the savedBy array
    await updateDoc(eventRef, {
      savedBy: savedBy.filter(id => id !== userId)
    });
    
    // Also remove the record from the user's saved events collection
    await setDoc(doc(firestore, `users/${userId}/savedEvents`, eventId), {
      eventId,
      savedAt: null,
      removed: true
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Download events for offline use
export const downloadEventsForOffline = async (userId, categories = []) => {
  try {
    const eventsCollection = collection(firestore, 'events');
    let q;
    
    if (categories.length > 0) {
      q = query(
        eventsCollection,
        where('category', 'in', categories),
        orderBy('date', 'asc')
      );
    } else {
      q = query(
        eventsCollection,
        orderBy('date', 'asc')
      );
    }
    
    const eventsSnapshot = await getDocs(q);
    const events = [];
    
    for (const eventDoc of eventsSnapshot.docs) {
      const event = { id: eventDoc.id, ...eventDoc.data() };
      events.push(event);
    }
    
    // In a real app, you would store these in SQLite
    // For now, return the events that should be stored
    return { success: true, events };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create a new event (for admins or community members)
export const createEvent = async (eventData, imageURI) => {
  try {
    // If there's an image, upload it first
    let imageURL = null;
    if (imageURI) {
      const imageRef = ref(storage, `events/${Date.now()}`);
      
      // Convert URI to blob
      const response = await fetch(imageURI);
      const blob = await response.blob();
      
      // Upload the image
      await uploadBytes(imageRef, blob);
      
      // Get the download URL
      imageURL = await getDownloadURL(imageRef);
    }
    
    // Process location data into GeoPoint if provided
    let dataToUpload = { ...eventData };
    
    if (eventData.location && 
        typeof eventData.location === 'object' && 
        'latitude' in eventData.location && 
        'longitude' in eventData.location) {
      dataToUpload.locationGeoPoint = new GeoPoint(
        eventData.location.latitude, 
        eventData.location.longitude
      );
    }
    
    // Add event to Firestore
    const eventRef = await addDoc(collection(firestore, 'events'), {
      ...dataToUpload,
      image: imageURL,
      createdAt: serverTimestamp(),
      savedBy: [],
      attendees: 0
    });
    
    return { success: true, eventId: eventRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Register interest in an event
export const registerInterest = async (eventId, userId) => {
  try {
    const eventRef = doc(firestore, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      return { success: false, error: 'Event not found' };
    }
    
    // Create a record in the user's interested events collection
    await setDoc(doc(firestore, `users/${userId}/interestedEvents`, eventId), {
      eventId,
      interestedAt: serverTimestamp()
    });
    
    // Also create a record in the event's interested users collection
    await setDoc(doc(firestore, `events/${eventId}/interestedUsers`, userId), {
      userId,
      interestedAt: serverTimestamp()
    });
    
    // Increment attendees count
    await updateDoc(eventRef, {
      attendees: firestore.FieldValue.increment(1)
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  getEvents,
  getEventById,
  saveEvent,
  unsaveEvent,
  downloadEventsForOffline,
  createEvent,
  registerInterest
}; 