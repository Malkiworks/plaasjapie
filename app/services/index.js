import { firestore, auth, storage } from './firebase';
import authService from './authService';
import userService from './userService';
import messageService from './messageService';
import eventService from './eventService';
import storageService from './storageService';
import offlineService from './offlineService';
import * as languageService from './languageService';

// Export all services with named exports
export {
  firestore,
  auth,
  storage,
  authService,
  userService,
  messageService,
  eventService,
  storageService,
  offlineService,
  languageService
};

// Export a default object with all services
export default {
  firestore,
  auth,
  storage,
  authService,
  userService,
  messageService,
  eventService,
  storageService,
  offlineService,
  languageService
}; 