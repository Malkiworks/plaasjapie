import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import { userService } from './userService';
import { messageService } from './messageService';
import { eventService } from './eventService';

// Open the database with proper error handling
export const getDatabase = () => {
  try {
    if (!SQLite || typeof SQLite.openDatabase !== 'function') {
      console.error('SQLite or openDatabase function not available');
      return null;
    }
    
    const db = SQLite.openDatabase('plaasjapie.db');
    return db;
  } catch (error) {
    console.error('Error opening SQLite database:', error);
    return null;
  }
};

// Check if database is available
export const isDatabaseAvailable = () => {
  return SQLite && typeof SQLite.openDatabase === 'function';
};

// Initialize database tables with safe fallback
export const initializeDatabase = async () => {
  try {
    // First check if SQLite is available
    if (!isDatabaseAvailable()) {
      console.warn('SQLite is not available in this environment');
      return Promise.resolve({ success: false, offline: false });
    }
    
    const db = getDatabase();
    
    if (!db) {
      console.error('Failed to open SQLite database');
      return Promise.resolve({ success: false, offline: true });
    }
    
    return new Promise((resolve, reject) => {
      // Create the necessary tables if they don't exist
      db.transaction(
        tx => {
          // User profiles table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS user_profiles (
              uid TEXT PRIMARY KEY,
              profile TEXT NOT NULL,
              updated_at INTEGER NOT NULL
            );`
          );
          
          // Messages table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS messages (
              id TEXT PRIMARY KEY,
              match_id TEXT NOT NULL,
              data TEXT NOT NULL,
              is_sent INTEGER NOT NULL DEFAULT 0,
              created_at INTEGER NOT NULL
            );`
          );
          
          // Matches table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS matches (
              id TEXT PRIMARY KEY,
              data TEXT NOT NULL,
              updated_at INTEGER NOT NULL
            );`
          );
          
          // Events table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS events (
              id TEXT PRIMARY KEY,
              data TEXT NOT NULL,
              updated_at INTEGER NOT NULL
            );`
          );
          
          // Sync status table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS sync_status (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              type TEXT NOT NULL,
              last_sync INTEGER
            );`
          );
          
          // Set up initial sync status records if they don't exist
          tx.executeSql(
            `INSERT OR IGNORE INTO sync_status (type, last_sync) VALUES (?, ?)`,
            ['profiles', 0]
          );
          tx.executeSql(
            `INSERT OR IGNORE INTO sync_status (type, last_sync) VALUES (?, ?)`,
            ['messages', 0]
          );
          tx.executeSql(
            `INSERT OR IGNORE INTO sync_status (type, last_sync) VALUES (?, ?)`,
            ['matches', 0]
          );
          tx.executeSql(
            `INSERT OR IGNORE INTO sync_status (type, last_sync) VALUES (?, ?)`,
            ['events', 0]
          );
        },
        error => {
          console.error('SQLite transaction error:', error);
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return Promise.reject(error);
  }
};

// Check if the device is online
export const isOnline = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected && netInfo.isInternetReachable;
};

// Store an unsent message locally
export const storeUnsentMessage = (messageData) => {
  const db = getDatabase();
  const now = Date.now();
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `INSERT OR REPLACE INTO messages (id, match_id, data, is_sent, created_at)
           VALUES (?, ?, ?, ?, ?)`,
          [
            messageData.id,
            messageData.matchId,
            JSON.stringify(messageData),
            0, // not sent
            now
          ],
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      }
    );
  });
};

// Get all unsent messages
export const getUnsentMessages = () => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `SELECT * FROM messages WHERE is_sent = 0 ORDER BY created_at ASC`,
          [],
          (_, { rows }) => {
            const messages = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              messages.push({
                ...JSON.parse(row.data),
                _localId: row.id
              });
            }
            resolve(messages);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      }
    );
  });
};

// Mark a message as sent
export const markMessageAsSent = (messageId) => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `UPDATE messages SET is_sent = 1 WHERE id = ?`,
          [messageId],
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      }
    );
  });
};

// Store user profile in local database
export const storeUserProfile = (uid, profileData) => {
  const db = getDatabase();
  const now = Date.now();
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `INSERT OR REPLACE INTO user_profiles (uid, profile, updated_at)
           VALUES (?, ?, ?)`,
          [
            uid,
            JSON.stringify(profileData),
            now
          ],
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      }
    );
  });
};

// Get a user profile from local database
export const getUserProfile = (uid) => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `SELECT * FROM user_profiles WHERE uid = ?`,
          [uid],
          (_, { rows }) => {
            if (rows.length > 0) {
              const row = rows.item(0);
              resolve({
                profile: JSON.parse(row.profile),
                updated_at: row.updated_at
              });
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      }
    );
  });
};

// Store match data locally
export const storeMatch = (matchId, matchData) => {
  const db = getDatabase();
  const now = Date.now();
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `INSERT OR REPLACE INTO matches (id, data, updated_at)
           VALUES (?, ?, ?)`,
          [
            matchId,
            JSON.stringify(matchData),
            now
          ],
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      }
    );
  });
};

// Get all matches from local database
export const getLocalMatches = () => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `SELECT * FROM matches ORDER BY updated_at DESC`,
          [],
          (_, { rows }) => {
            const matches = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              matches.push({
                ...JSON.parse(row.data),
                _localUpdatedAt: row.updated_at
              });
            }
            resolve(matches);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      }
    );
  });
};

// Store event data locally
export const storeEvent = (eventId, eventData) => {
  const db = getDatabase();
  const now = Date.now();
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `INSERT OR REPLACE INTO events (id, data, updated_at)
           VALUES (?, ?, ?)`,
          [
            eventId,
            JSON.stringify(eventData),
            now
          ],
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      }
    );
  });
};

// Get all events from local database
export const getLocalEvents = () => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `SELECT * FROM events ORDER BY updated_at DESC`,
          [],
          (_, { rows }) => {
            const events = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              events.push({
                ...JSON.parse(row.data),
                _localUpdatedAt: row.updated_at
              });
            }
            resolve(events);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      }
    );
  });
};

// Update last sync time
export const updateLastSyncTime = (type) => {
  const db = getDatabase();
  const now = Date.now();
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `UPDATE sync_status SET last_sync = ? WHERE type = ?`,
          [now, type],
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      }
    );
  });
};

// Get last sync time
export const getLastSyncTime = (type) => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `SELECT last_sync FROM sync_status WHERE type = ?`,
          [type],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(rows.item(0).last_sync);
            } else {
              resolve(0);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      }
    );
  });
};

// Synchronize unsent messages with server
export const syncUnsentMessages = async () => {
  try {
    const online = await isOnline();
    if (!online) {
      return { success: false, error: 'Device is offline' };
    }
    
    const unsentMessages = await getUnsentMessages();
    
    let successes = 0;
    let failures = 0;
    
    for (const message of unsentMessages) {
      try {
        // Determine message type and send accordingly
        if (message.type === 'text') {
          await messageService.sendTextMessage(
            message.matchId,
            message.senderId,
            message.text
          );
        } else if (message.type === 'voice') {
          await messageService.sendVoiceNote(
            message.matchId,
            message.senderId,
            message.localUri
          );
        }
        
        // Mark as sent in local DB
        await markMessageAsSent(message._localId);
        successes++;
      } catch (error) {
        failures++;
      }
    }
    
    // Update sync time
    await updateLastSyncTime('messages');
    
    return { 
      success: true, 
      stats: {
        total: unsentMessages.length,
        successes,
        failures
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sync all data, performing a full sync
export const performFullSync = async (userId) => {
  try {
    const online = await isOnline();
    if (!online) {
      return { success: false, error: 'Device is offline' };
    }
    
    // Sync unsent messages first
    await syncUnsentMessages();
    
    // Sync user profile
    const profileResult = await userService.getUserProfile(userId);
    if (profileResult.success) {
      await storeUserProfile(userId, profileResult.profile);
    }
    
    // Sync matches
    const matchesResult = await userService.getUserMatches(userId);
    if (matchesResult.success) {
      for (const match of matchesResult.matches) {
        await storeMatch(match.id, match);
      }
    }
    
    // Sync events (get upcoming events)
    const eventsResult = await eventService.getEvents();
    if (eventsResult.success) {
      for (const event of eventsResult.events) {
        await storeEvent(event.id, event);
      }
    }
    
    // Update all sync times
    await updateLastSyncTime('profiles');
    await updateLastSyncTime('matches');
    await updateLastSyncTime('events');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  getDatabase,
  initializeDatabase,
  isDatabaseAvailable,
  isOnline,
  storeUnsentMessage,
  getUnsentMessages,
  markMessageAsSent,
  storeUserProfile,
  getUserProfile,
  storeMatch,
  getLocalMatches,
  storeEvent,
  getLocalEvents,
  updateLastSyncTime,
  getLastSyncTime,
  syncUnsentMessages,
  performFullSync
}; 