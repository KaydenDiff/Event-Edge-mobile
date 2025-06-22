import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Цветовая схема
const COLORS = {
  purple: '#6A0DAD',  // фиолетовый
  gray: '#333333',    // темно-серый
  lightGray: '#222222', // светло-серый фон
  white: '#FFFFFF',   // белый
  black: '#000000',   // черный
  accent: '#9370DB',  // светло-фиолетовый для акцентов
  darkPurple: '#4B0082' // темно-фиолетовый для градиентов
};

type NewsCardProps = {
  title: string;
  description: string;
  onPress: () => void;
};

export default function NewsCard({ title, description, onPress }: NewsCardProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]} 
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        <View style={styles.accentBar} />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.desc} numberOfLines={3}>{description}</Text>
          
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>Подробнее</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: COLORS.lightGray, 
    borderRadius: 16, 
    marginBottom: 16,
    elevation: 4,
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  contentContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
  },
  accentBar: {
    width: 5,
    backgroundColor: COLORS.accent,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  textContainer: {
    flex: 1,
    padding: 16,
  },
  title: { 
    color: COLORS.white, 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  desc: { 
    color: '#CCCCCC', 
    fontSize: 15, 
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: { 
    backgroundColor: COLORS.accent,
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: { 
    color: COLORS.white, 
    fontWeight: 'bold',
    fontSize: 13,
  },
  icon: {
    marginLeft: 4,
  }
});
