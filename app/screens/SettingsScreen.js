import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SettingsScreen() {
  const [offlineMode, setOfflineMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  const languages = [
    'English', 'Afrikaans', 'Zulu', 'Xhosa', 'Sotho', 
    'Tswana', 'Venda', 'Tsonga', 'Swati', 'Ndebele', 'Sepedi'
  ];

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const renderSettingsItem = (icon, title, description, value, onPress) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemIcon}>
        <Ionicons name={icon} size={22} color="#555" />
      </View>
      <View style={styles.settingsItemContent}>
        <Text style={styles.settingsItemTitle}>{title}</Text>
        {description && <Text style={styles.settingsItemDescription}>{description}</Text>}
      </View>
      {typeof value === 'boolean' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#e0e0e0', true: '#c4e0c9' }}
          thumbColor={value ? '#4CD964' : '#f5f5f5'}
        />
      ) : (
        <View style={styles.settingsItemValue}>
          <Text style={styles.settingsItemValueText}>{value}</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView>
        {renderSectionHeader('Account')}
        
        {renderSettingsItem(
          'person-outline',
          'Profile Information',
          'Edit your personal details',
          '',
          () => {}
        )}
        
        {renderSettingsItem(
          'shield-checkmark-outline',
          'Verification Status',
          'Your account is verified',
          'Verified',
          () => {}
        )}
        
        {renderSettingsItem(
          'card-outline',
          'Subscription',
          'Manage your premium subscription',
          'Free',
          () => {}
        )}

        {renderSectionHeader('App Preferences')}
        
        {renderSettingsItem(
          'globe-outline',
          'Language',
          'Choose your preferred language',
          selectedLanguage,
          () => {
            // In a real app, this would open a language selector
            const nextIndex = (languages.indexOf(selectedLanguage) + 1) % languages.length;
            setSelectedLanguage(languages[nextIndex]);
          }
        )}
        
        {renderSettingsItem(
          'moon-outline',
          'Dark Mode',
          'Change app appearance',
          darkMode,
          () => setDarkMode(!darkMode)
        )}
        
        {renderSettingsItem(
          'cloud-offline-outline',
          'Offline Mode',
          'Use app without internet connection',
          offlineMode,
          () => setOfflineMode(!offlineMode)
        )}

        {renderSectionHeader('Privacy & Security')}
        
        {renderSettingsItem(
          'notifications-outline',
          'Notifications',
          'Manage push notifications',
          notificationsEnabled,
          () => setNotificationsEnabled(!notificationsEnabled)
        )}
        
        {renderSettingsItem(
          'location-outline',
          'Location Services',
          'Allow app to access your location',
          locationEnabled,
          () => setLocationEnabled(!locationEnabled)
        )}
        
        {renderSettingsItem(
          'lock-closed-outline',
          'Privacy Settings',
          'Manage who can see your profile',
          '',
          () => {}
        )}
        
        {renderSettingsItem(
          'eye-off-outline',
          'Blocked Users',
          'Manage users you\'ve blocked',
          '',
          () => {}
        )}

        {renderSectionHeader('Support & About')}
        
        {renderSettingsItem(
          'help-circle-outline',
          'Help Center',
          'Get assistance with app features',
          '',
          () => {}
        )}
        
        {renderSettingsItem(
          'information-circle-outline',
          'About Plaasjapie',
          'App version and information',
          'v1.0.0',
          () => {}
        )}
        
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  sectionHeaderText: {
    fontSize: 14,
    color: '#999',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsItemIcon: {
    width: 30,
    alignItems: 'center',
    marginRight: 16,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingsItemDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  settingsItemValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemValueText: {
    fontSize: 14,
    color: '#999',
    marginRight: 4,
  },
  logoutButton: {
    margin: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#E63946',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 