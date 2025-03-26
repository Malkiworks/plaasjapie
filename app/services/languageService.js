// Simple English-only language service (no translations)

// Function that just returns the last part of the key or a simple string
export const translate = (key, params = {}) => {
  try {
    // Extract the last part of the key as text
    const keyParts = key.split('.');
    const lastPart = keyParts[keyParts.length - 1] || key;
    
    // Convert camelCase to Title Case with spaces
    return lastPart
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  } catch (error) {
    console.error(`Error processing key "${key}":`, error);
    return key;
  }
};

// Export dummy language functions
export const availableLanguages = [
  { code: 'en', name: 'English' }
];

export const changeLanguage = () => true;
export const getCurrentLanguage = () => 'en';
export const initializeLanguage = async () => ({ success: true, language: 'en' });
export const detectLanguage = async () => ({ success: true, detectedLanguage: 'en', confidence: 1.0 });
export const translateText = async (text) => ({ success: true, translatedText: text, sourceLanguage: 'en', targetLanguage: 'en' });
export const getTranslationStatus = () => ({ en: 100 });

// Format dates in English
export const formatDate = (date, format = 'long') => {
  const options = 
    format === 'long' 
      ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      : format === 'short'
        ? { year: 'numeric', month: 'short', day: 'numeric' }
        : { month: 'numeric', day: 'numeric' };
  
  return new Date(date).toLocaleDateString('en-US', options);
};

// Format time in English
export const formatTime = (date, format = 'short') => {
  const options = 
    format === 'long'
      ? { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }
      : { hour: 'numeric', minute: 'numeric', hour12: true };
  
  return new Date(date).toLocaleTimeString('en-US', options);
};

export default {
  translate,
  availableLanguages,
  changeLanguage,
  getCurrentLanguage,
  initializeLanguage,
  detectLanguage,
  translateText,
  getTranslationStatus,
  formatDate,
  formatTime
}; 