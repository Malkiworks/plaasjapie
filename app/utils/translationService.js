import { I18n } from 'i18n-js';

// Translation object structured by language code
const translations = {
  // English 
  en: {
    // General
    appName: 'Plaasjapie',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    search: 'Search',
    
    // Authentication
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    createAccount: 'Create a new account',
    
    // Navigation 
    home: 'Home',
    profile: 'Profile',
    messages: 'Messages',
    events: 'Events',
    settings: 'Settings',
    
    // Home screen
    noMoreMatches: 'No more matches at the moment',
    refreshMatches: 'Refresh to find more',
    like: 'Like',
    pass: 'Pass',
    
    // Profile screen
    aboutMe: 'About Me',
    myInterests: 'My Interests',
    languages: 'Languages',
    myPhotos: 'My Photos',
    addPhoto: 'Add Photo',
    editProfile: 'Edit Profile',
    verificationStatus: 'Verification Status',
    verified: 'Verified',
    notVerified: 'Not Verified',
    upgradeAccount: 'Upgrade to Premium',
    
    // Messages screen
    allMessages: 'All Messages',
    offlineAvailable: 'Offline Available',
    noMessages: 'No messages yet',
    startConversation: 'Start a conversation',
    voiceNote: 'Voice Note',
    sendMessage: 'Send Message',
    
    // Events screen
    localEvents: 'Local Events',
    downloadEvents: 'Download events for offline viewing',
    download: 'Download',
    allEvents: 'All Events',
    rural: 'Rural',
    urban: 'Urban',
    cultural: 'Cultural',
    saved: 'Saved',
    attending: 'attending',
    interested: 'I\'m interested',
    
    // Settings screen
    accountSettings: 'Account',
    appPreferences: 'App Preferences',
    privacySecurity: 'Privacy & Security',
    supportAbout: 'Support & About',
    language: 'Language',
    darkMode: 'Dark Mode',
    offlineMode: 'Offline Mode',
    notifications: 'Notifications',
    locationServices: 'Location Services',
    privacySettings: 'Privacy Settings',
    blockedUsers: 'Blocked Users',
    helpCenter: 'Help Center',
    about: 'About Plaasjapie',
    version: 'v1.0.0',
    logOut: 'Log Out',
    
    // Offline mode
    offlineModeActive: 'You\'re offline. Using cached data.',
    reconnect: 'Reconnect',
  },
  
  // Afrikaans
  af: {
    // General
    appName: 'Plaasjapie',
    loading: 'Laai...',
    save: 'Stoor',
    cancel: 'Kanselleer',
    delete: 'Verwyder',
    edit: 'Wysig',
    confirm: 'Bevestig',
    search: 'Soek',
    
    // Authentication
    signIn: 'Teken In',
    signUp: 'Registreer',
    email: 'E-pos',
    password: 'Wagwoord',
    forgotPassword: 'Wagwoord vergeet?',
    createAccount: 'Skep \'n nuwe rekening',
    
    // Navigation 
    home: 'Tuis',
    profile: 'Profiel',
    messages: 'Boodskappe',
    events: 'Gebeure',
    settings: 'Instellings',
    
    // Home screen
    noMoreMatches: 'Geen meer passings op die oomblik',
    refreshMatches: 'Verfris om meer te vind',
    like: 'Hou van',
    pass: 'Slaan oor',
    
    // Profile screen
    aboutMe: 'Oor My',
    myInterests: 'My Belangstellings',
    languages: 'Tale',
    myPhotos: 'My Foto\'s',
    addPhoto: 'Voeg Foto by',
    editProfile: 'Wysig Profiel',
    verificationStatus: 'Verifikasie Status',
    verified: 'Geverifieer',
    notVerified: 'Nie Geverifieer',
    upgradeAccount: 'Opgradeer na Premium',
    
    // Messages screen
    allMessages: 'Alle Boodskappe',
    offlineAvailable: 'Aflyn Beskikbaar',
    noMessages: 'Nog geen boodskappe nie',
    startConversation: 'Begin \'n gesprek',
    voiceNote: 'Stemnota',
    sendMessage: 'Stuur Boodskap',
    
    // Events screen
    localEvents: 'Plaaslike Gebeure',
    downloadEvents: 'Laai gebeure af vir aflyn besigtiging',
    download: 'Aflaai',
    allEvents: 'Alle Gebeure',
    rural: 'Landelik',
    urban: 'Stedelik',
    cultural: 'Kultureel',
    saved: 'Gestoor',
    attending: 'bywoon',
    interested: 'Ek stel belang',
    
    // Settings screen
    accountSettings: 'Rekening',
    appPreferences: 'App Voorkeure',
    privacySecurity: 'Privaatheid & Sekuriteit',
    supportAbout: 'Ondersteuning & Oor',
    language: 'Taal',
    darkMode: 'Donker Modus',
    offlineMode: 'Aflyn Modus',
    notifications: 'Kennisgewings',
    locationServices: 'Liggingdienste',
    privacySettings: 'Privaatheid Instellings',
    blockedUsers: 'Geblokkeerde Gebruikers',
    helpCenter: 'Hulpsentrum',
    about: 'Oor Plaasjapie',
    version: 'v1.0.0',
    logOut: 'Teken Uit',
    
    // Offline mode
    offlineModeActive: 'Jy is aflyn. Gebruik gekasde data.',
    reconnect: 'Herverbind',
  },
  
  // Zulu (basic common phrases only)
  zu: {
    // General
    appName: 'Plaasjapie',
    loading: 'Iyalayisha...',
    save: 'Londoloza',
    cancel: 'Khansela',
    delete: 'Susa',
    edit: 'Hlela',
    confirm: 'Qinisekisa',
    search: 'Sesha',
    
    // Navigation 
    home: 'Ikhaya',
    profile: 'Iphrofayela',
    messages: 'Imiyalezo',
    events: 'Imicimbi',
    settings: 'Izilungiselelo',
    
    // Home screen
    like: 'Ngiyathanda',
    pass: 'Dlula',
    
    // Profile screen
    aboutMe: 'Ngami',
    myPhotos: 'Izithombe Zami',
    
    // Offline mode
    offlineModeActive: 'Awuxhunyiwe. Usebenzisa idatha elondoloziwe.',
    reconnect: 'Xhuma futhi',
  }
};

// Create i18n instance
const i18n = new I18n(translations);

// Default to English
i18n.defaultLocale = 'en';
i18n.locale = 'en';

// Enable fallbacks to default language if translation missing
i18n.enableFallback = true;

/**
 * Change the current language
 * @param {string} languageCode - The language code to switch to (e.g., 'en', 'af', 'zu')
 */
export const changeLanguage = (languageCode) => {
  if (translations[languageCode]) {
    i18n.locale = languageCode;
    return true;
  }
  return false;
};

/**
 * Get the current language code
 * @returns {string} The current language code
 */
export const getCurrentLanguage = () => {
  return i18n.locale;
};

/**
 * Get list of supported languages
 * @returns {Array} Array of supported language codes
 */
export const getSupportedLanguages = () => {
  return Object.keys(translations);
};

/**
 * Get language name from code
 * @param {string} code - The language code
 * @returns {string} The language name
 */
export const getLanguageName = (code) => {
  const languageNames = {
    en: 'English',
    af: 'Afrikaans',
    zu: 'isiZulu',
    xh: 'isiXhosa',
    st: 'Sesotho',
    tn: 'Setswana',
    ve: 'Tshivenda',
    ts: 'Xitsonga',
    ss: 'siSwati',
    nr: 'isiNdebele',
    nso: 'Sepedi',
  };
  
  return languageNames[code] || code;
};

/**
 * Translate text using on-device ML (mock implementation)
 * @param {string} text - Text to translate
 * @param {string} fromLang - Source language code
 * @param {string} toLang - Target language code
 * @returns {Promise<string>} Translated text
 */
export const translateText = async (text, fromLang, toLang) => {
  // This is a mock implementation
  // In a real app, this would use on-device ML for translation
  
  // Just to demonstrate, we'll return a mock translation for a few phrases
  if (fromLang === 'en' && toLang === 'af') {
    const mockTranslations = {
      'Hello': 'Hallo',
      'How are you?': 'Hoe gaan dit met jou?',
      'I like your profile': 'Ek hou van jou profiel',
      'Would you like to meet?': 'Wil jy ontmoet?',
    };
    
    return mockTranslations[text] || text;
  }
  
  // Default to returning the original text
  return text;
};

export default i18n; 