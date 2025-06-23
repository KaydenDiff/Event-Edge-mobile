import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Цветовая схема
const COLORS = {
  purple: '#6A0DAD', // фиолетовый
  gray: '#333333',   // темно-серый
  white: '#FFFFFF',  // белый
  black: '#000000',  // черный
  lightGray: '#222222', // светло-серый для фона
  darkPurple: '#4B0082',
  accent: '#9370DB'
};

export default function BackBar() {
  const router = useRouter();

  const goBack = () => {
    router.navigate('/news');
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={goBack}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[COLORS.accent, COLORS.accent]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
              <Text style={styles.buttonText}>Назад</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    zIndex: 100,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  backButton: {
    width: 120,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  }
}); 