import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { translate, availableLanguages, getCurrentLanguage, changeLanguage } from '../../services/languageService';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const currentLanguage = getCurrentLanguage();
  
  // Settings sections
  const accountSettings = [
    {
      id: 'profile',
      title: translate('settings.editProfile'),
      icon: 'person-outline',
      action: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'preferences',
      title: translate('settings.preferences'),
      icon: 'options-outline',
      action: () => navigation.navigate('EditPreferences'),
    },
    {
      id: 'notifications',
      title: translate('settings.notifications'),
      icon: 'notifications-outline',
      action: () => navigation.navigate('NotificationSettings'),
      toggle: true,
      value: true,
    },
  ];
  
  const appSettings = [
    {
      id: 'language',
      title: translate('settings.language'),
      icon: 'globe-outline',
      action: () => navigation.navigate('LanguageSettings'),
      detail: getLanguageName(currentLanguage),
    },
    {
      id: 'privacy',
      title: translate('settings.privacy'),
      icon: 'lock-closed-outline',
      action: () => navigation.navigate('PrivacySettings'),
    },
  ];
  
  const aboutSettings = [
    {
      id: 'about',
      title: translate('settings.about'),
      icon: 'information-circle-outline',
      action: () => navigation.navigate('About'),
    },
    {
      id: 'contact',
      title: translate('settings.contact'),
      icon: 'mail-outline',
      action: () => navigation.navigate('Contact'),
    },
    {
      id: 'terms',
      title: translate('settings.termsOfService'),
      icon: 'document-text-outline',
      action: () => navigation.navigate('Terms'),
    },
    {
      id: 'privacy-policy',
      title: translate('settings.privacyPolicy'),
      icon: 'shield-outline',
      action: () => navigation.navigate('PrivacyPolicy'),
    },
  ];
  
  // Get language name from code
  function getLanguageName(code) {
    const language = availableLanguages.find(lang => lang.code === code);
    return language ? language.name : code;
  }
  
  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      translate('settings.logout'),
      translate('settings.confirmLogout'),
      [
        {
          text: translate('common.cancel'),
          style: 'cancel',
        },
        {
          text: translate('settings.logout'),
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    Alert.alert(
      translate('settings.deleteAccount'),
      translate('settings.confirmDelete'),
      [
        {
          text: translate('common.cancel'),
          style: 'cancel',
        },
        {
          text: translate('settings.deleteAccount'),
          style: 'destructive',
          onPress: () => {
            // Add account deletion logic here
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };
  
  // Render a settings section
  const renderSection = (title, items) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.settingItem,
              index === items.length - 1 && styles.lastSettingItem
            ]}
            onPress={item.action}
          >
            <View style={styles.settingLeft}>
              <Ionicons name={item.icon} size={22} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingTitle}>{item.title}</Text>
            </View>
            
            <View style={styles.settingRight}>
              {item.toggle ? (
                <Switch
                  value={item.value}
                  onValueChange={(value) => {
                    // Handle toggle change
                    console.log(`${item.id} toggled:`, value);
                  }}
                  trackColor={{ false: '#ccc', true: '#A8DADC' }}
                  thumbColor={item.value ? '#E63946' : '#f4f3f4'}
                />
              ) : item.detail ? (
                <View style={styles.settingDetail}>
                  <Text style={styles.settingDetailText}>{item.detail}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{translate('settings.title')}</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderSection(translate('settings.account'), accountSettings)}
        {renderSection(translate('common.app'), appSettings)}
        {renderSection(translate('settings.about'), aboutSettings)}
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            {translate('settings.version')} 1.0.0
          </Text>
        </View>
        
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#E63946" />
            <Text style={styles.logoutText}>{translate('settings.logout')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteAccountButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteAccountText}>
              {translate('settings.deleteAccount')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  scrollView: {
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingDetailText: {
    marginRight: 8,
    fontSize: 14,
    color: '#999',
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  logoutSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E63946',
    marginBottom: 16,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#E63946',
  },
  deleteAccountButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  deleteAccountText: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'underline',
  },
});

export default SettingsScreen; 