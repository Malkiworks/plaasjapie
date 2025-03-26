import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function OfflineModeBanner() {
  // In a real app, this would check actual network connectivity
  const [isOffline, setIsOffline] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    // For demo purposes, toggle online/offline every 10 seconds
    const interval = setInterval(() => {
      setIsOffline(prev => !prev);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOffline) {
      // Animate banner in
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Animate banner out
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOffline, animation]);

  if (!isOffline) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
          opacity: animation,
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="cloud-offline-outline" size={18} color="white" />
        <Text style={styles.text}>You're offline. Using cached data.</Text>
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => {
          // In a real app, this would attempt to reconnect
          setIsOffline(false);
        }}
      >
        <Text style={styles.buttonText}>Reconnect</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#555',
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#E63946',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 