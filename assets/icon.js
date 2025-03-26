import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AppIcon = ({ size, color }) => {
  const iconSize = size || 80;
  const iconColor = color || '#E63946';
  
  return (
    <View style={[
      styles.container, 
      { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }
    ]}>
      <Ionicons name="leaf" size={iconSize * 0.6} color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E63946',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppIcon; 