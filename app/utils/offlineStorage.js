import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('plaasjapie.db');

// Initialize database tables
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Create tables for offline storage
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS profiles (
          id TEXT PRIMARY KEY,
          name TEXT,
          age INTEGER,
          location TEXT,
          bio TEXT,
          image_path TEXT,
          interests TEXT,
          last_updated INTEGER
        )`,
        [],
        () => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS messages (
              id TEXT PRIMARY KEY,
              conversation_id TEXT,
              sender_id TEXT,
              receiver_id TEXT,
              text TEXT,
              voice_note_path TEXT,
              timestamp INTEGER,
              is_read INTEGER,
              is_sent INTEGER
            )`,
            [],
            () => {
              tx.executeSql(
                `CREATE TABLE IF NOT EXISTS events (
                  id TEXT PRIMARY KEY,
                  title TEXT,
                  date TEXT,
                  location TEXT,
                  description TEXT,
                  image_path TEXT,
                  category TEXT,
                  attendees INTEGER,
                  is_saved INTEGER,
                  last_updated INTEGER
                )`,
                [],
                resolve,
                (_, error) => reject(error)
              );
            },
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};

// Save profiles for offline use
export const saveProfilesToOfflineStorage = async (profiles) => {
  // First, download and save images
  const profilesWithLocalImages = await Promise.all(
    profiles.map(async profile => {
      if (profile.image) {
        const imageName = `${FileSystem.documentDirectory}profiles/${profile.id}.jpg`;
        const dirInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}profiles`);
        
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}profiles`);
        }
        
        await FileSystem.downloadAsync(profile.image, imageName);
        return { ...profile, image_path: imageName };
      }
      return profile;
    })
  );
  
  // Then save to SQLite
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      profilesWithLocalImages.forEach(profile => {
        tx.executeSql(
          `INSERT OR REPLACE INTO profiles (id, name, age, location, bio, image_path, interests, last_updated)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            profile.id,
            profile.name,
            profile.age,
            profile.location,
            profile.bio,
            profile.image_path,
            JSON.stringify(profile.interests),
            Date.now()
          ],
          () => {},
          (_, error) => reject(error)
        );
      });
      resolve();
    });
  });
};

// Get profiles from offline storage
export const getProfilesFromOfflineStorage = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM profiles ORDER BY last_updated DESC',
        [],
        (_, { rows }) => {
          const profiles = rows._array.map(row => ({
            id: row.id,
            name: row.name,
            age: row.age,
            location: row.location,
            bio: row.bio,
            image: row.image_path,
            interests: JSON.parse(row.interests),
          }));
          resolve(profiles);
        },
        (_, error) => reject(error)
      );
    });
  });
};

// Save events for offline use
export const saveEventsToOfflineStorage = async (events) => {
  // First, download and save images
  const eventsWithLocalImages = await Promise.all(
    events.map(async event => {
      if (event.image) {
        const imageName = `${FileSystem.documentDirectory}events/${event.id}.jpg`;
        const dirInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}events`);
        
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}events`);
        }
        
        await FileSystem.downloadAsync(event.image, imageName);
        return { ...event, image_path: imageName };
      }
      return event;
    })
  );
  
  // Then save to SQLite
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      eventsWithLocalImages.forEach(event => {
        tx.executeSql(
          `INSERT OR REPLACE INTO events 
           (id, title, date, location, description, image_path, category, attendees, is_saved, last_updated)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            event.id,
            event.title,
            event.date,
            event.location,
            event.description,
            event.image_path,
            event.category,
            event.attendees,
            event.saved ? 1 : 0,
            Date.now()
          ],
          () => {},
          (_, error) => reject(error)
        );
      });
      resolve();
    });
  });
};

// Get events from offline storage
export const getEventsFromOfflineStorage = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM events ORDER BY last_updated DESC',
        [],
        (_, { rows }) => {
          const events = rows._array.map(row => ({
            id: row.id,
            title: row.title,
            date: row.date,
            location: row.location,
            description: row.description,
            image: row.image_path,
            category: row.category,
            attendees: row.attendees,
            saved: row.is_saved === 1,
          }));
          resolve(events);
        },
        (_, error) => reject(error)
      );
    });
  });
};

// Save messages for offline use
export const saveMessagesToOfflineStorage = (messages) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      messages.forEach(message => {
        tx.executeSql(
          `INSERT OR REPLACE INTO messages 
           (id, conversation_id, sender_id, receiver_id, text, voice_note_path, timestamp, is_read, is_sent)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            message.id,
            message.conversationId,
            message.senderId,
            message.receiverId,
            message.text,
            message.voiceNotePath || null,
            message.timestamp,
            message.isRead ? 1 : 0,
            message.isSent ? 1 : 0
          ],
          () => {},
          (_, error) => reject(error)
        );
      });
      resolve();
    });
  });
};

// Get messages from offline storage
export const getMessagesFromOfflineStorage = (conversationId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC',
        [conversationId],
        (_, { rows }) => {
          const messages = rows._array.map(row => ({
            id: row.id,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            receiverId: row.receiver_id,
            text: row.text,
            voiceNotePath: row.voice_note_path,
            timestamp: row.timestamp,
            isRead: row.is_read === 1,
            isSent: row.is_sent === 1,
          }));
          resolve(messages);
        },
        (_, error) => reject(error)
      );
    });
  });
};

// Detect if device is online
export const isOnline = async () => {
  // In a real app, this would check actual network connectivity
  // For this demo, we'll just return true
  return true;
};

// Sync offline data when back online
export const syncOfflineData = async () => {
  // This would sync any offline data with the server when connection is restored
  console.log('Syncing offline data with server...');
  return true;
};

export default {
  initDatabase,
  saveProfilesToOfflineStorage,
  getProfilesFromOfflineStorage,
  saveEventsToOfflineStorage,
  getEventsFromOfflineStorage,
  saveMessagesToOfflineStorage,
  getMessagesFromOfflineStorage,
  isOnline,
  syncOfflineData,
}; 