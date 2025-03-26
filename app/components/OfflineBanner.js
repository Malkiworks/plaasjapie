import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '../services/languageService';

const OfflineBanner = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Ionicons name="cloud-offline-outline" size={20} color="#FFFFFF" />
        <Text style={styles.text}>{translate('offline.offlineAlert')}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{translate('offline.syncNow')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FF6B6B',
  },
  container: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  text: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OfflineBanner; 