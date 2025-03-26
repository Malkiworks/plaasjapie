import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from './firebase';

// Get messages for a specific match
export const getMessages = async (matchId, lastVisible = null, messagesPerPage = 20) => {
  try {
    const messagesCollection = collection(firestore, `matches/${matchId}/messages`);
    
    let q = query(
      messagesCollection,
      orderBy('timestamp', 'desc'),
      limit(messagesPerPage)
    );
    
    if (lastVisible) {
      q = query(
        messagesCollection,
        orderBy('timestamp', 'desc'),
        startAfter(lastVisible),
        limit(messagesPerPage)
      );
    }
    
    const messagesSnapshot = await getDocs(q);
    const messages = [];
    let newLastVisible = null;
    
    messagesSnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
      newLastVisible = doc;
    });
    
    // We retrieved in descending order for pagination, but we want to display in ascending
    messages.reverse();
    
    return { 
      success: true, 
      messages, 
      lastVisible: newLastVisible, 
      hasMore: messages.length === messagesPerPage 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send a text message
export const sendTextMessage = async (matchId, senderId, receiverId, text) => {
  try {
    // Add message to the messages subcollection
    const messageDoc = await addDoc(collection(firestore, `matches/${matchId}/messages`), {
      senderId,
      receiverId,
      text,
      type: 'text',
      timestamp: serverTimestamp(),
      read: false
    });
    
    // Update the match document with the latest message info
    await updateDoc(doc(firestore, 'matches', matchId), {
      lastMessage: {
        text,
        senderId,
        type: 'text'
      },
      lastMessageTimestamp: serverTimestamp()
    });
    
    return { success: true, messageId: messageDoc.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send a voice note
export const sendVoiceNote = async (matchId, senderId, receiverId, voiceNoteURI) => {
  try {
    // Upload voice note to Firebase Storage
    const voiceNoteRef = ref(storage, `voice_notes/${matchId}/${Date.now()}`);
    
    // Convert URI to blob (in a real app, you'd use File System API)
    const response = await fetch(voiceNoteURI);
    const blob = await response.blob();
    
    // Upload the voice note
    await uploadBytes(voiceNoteRef, blob);
    
    // Get download URL
    const voiceNoteURL = await getDownloadURL(voiceNoteRef);
    
    // Add message to the messages subcollection
    const messageDoc = await addDoc(collection(firestore, `matches/${matchId}/messages`), {
      senderId,
      receiverId,
      voiceNoteURL,
      type: 'voice',
      timestamp: serverTimestamp(),
      read: false
    });
    
    // Update the match document with the latest message info
    await updateDoc(doc(firestore, 'matches', matchId), {
      lastMessage: {
        text: 'Voice note',
        senderId,
        type: 'voice'
      },
      lastMessageTimestamp: serverTimestamp()
    });
    
    return { success: true, messageId: messageDoc.id, voiceNoteURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mark messages as read
export const markMessagesAsRead = async (matchId, userId) => {
  try {
    const messagesCollection = collection(firestore, `matches/${matchId}/messages`);
    
    const q = query(
      messagesCollection,
      where('receiverId', '==', userId),
      where('read', '==', false)
    );
    
    const unreadMessagesSnapshot = await getDocs(q);
    
    const updatePromises = unreadMessagesSnapshot.docs.map(messageDoc => 
      updateDoc(doc(firestore, `matches/${matchId}/messages`, messageDoc.id), {
        read: true
      })
    );
    
    await Promise.all(updatePromises);
    
    return { success: true, count: unreadMessagesSnapshot.size };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Subscribe to messages for real-time updates
export const subscribeToMessages = (matchId, callback) => {
  const messagesCollection = collection(firestore, `matches/${matchId}/messages`);
  
  const q = query(
    messagesCollection,
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    callback(messages);
  }, error => {
    console.error('Error subscribing to messages:', error);
  });
};

// Get all conversations for a user with unread counts
export const getConversations = async (userId) => {
  try {
    const matchesCollection = collection(firestore, 'matches');
    
    const q = query(
      matchesCollection,
      where('users', 'array-contains', userId),
      orderBy('lastMessageTimestamp', 'desc')
    );
    
    const matchesSnapshot = await getDocs(q);
    const conversations = [];
    
    for (const matchDoc of matchesSnapshot.docs) {
      const matchData = matchDoc.data();
      const matchId = matchDoc.id;
      
      // Get the other user's ID
      const otherUserId = matchData.users.find(id => id !== userId);
      
      // Get the other user's profile
      const otherUserDoc = await getDoc(doc(firestore, 'users', otherUserId));
      
      if (otherUserDoc.exists()) {
        // Count unread messages
        const messagesCollection = collection(firestore, `matches/${matchId}/messages`);
        const unreadQuery = query(
          messagesCollection,
          where('receiverId', '==', userId),
          where('read', '==', false)
        );
        
        const unreadSnapshot = await getDocs(unreadQuery);
        const unreadCount = unreadSnapshot.size;
        
        conversations.push({
          matchId,
          user: otherUserDoc.data(),
          lastMessage: matchData.lastMessage,
          lastMessageTimestamp: matchData.lastMessageTimestamp,
          unreadCount
        });
      }
    }
    
    return { success: true, conversations };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Store offline messages for syncing later
export const storeOfflineMessage = async (matchId, senderId, receiverId, text, type = 'text', voiceNotePath = null) => {
  try {
    const message = {
      matchId,
      senderId,
      receiverId,
      text: type === 'text' ? text : 'Voice note',
      type,
      voiceNotePath,
      timestamp: new Date().toISOString(),
      pendingSync: true
    };
    
    // In a real app, this would store to SQLite/local storage
    // For now, we'll just return the message object that should be stored
    return { success: true, message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  getMessages,
  sendTextMessage,
  sendVoiceNote,
  markMessagesAsRead,
  subscribeToMessages,
  getConversations,
  storeOfflineMessage
}; 