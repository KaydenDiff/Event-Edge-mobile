import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


const COLORS = {
  purple: '#6A0DAD',  // фиолетовый
  gray: '#333333',    // темно-серый
  lightGray: '#222222', // светло-серый фон
  white: '#FFFFFF',   // белый
  black: '#000000',   // черный
  accent: '#9370DB',  // светло-фиолетовый для акцентов
  darkPurple: '#4B0082' // темно-фиолетовый для градиентов
};

type PopularNewsCardProps = {
  title: string;
  description: string;
  onPress: () => void;
};

export default function PopularNewsCard({ title, description, onPress }: PopularNewsCardProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.popularCard,
        pressed && styles.cardPressed
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={[COLORS.lightGray, COLORS.gray]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <View style={styles.popularBadge}>
        <Ionicons name="flame" size={12} color={COLORS.white} />
        <Text style={styles.popularLabel}>Популярное</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.popularTitle} numberOfLines={2}>{title}</Text>
        <Text style={styles.popularDesc} numberOfLines={3}>{description}</Text>
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Подробнее</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.white} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  popularCard: { 
    position: 'relative',
    borderRadius: 16, 
    marginBottom: 24,
    overflow: 'hidden',
    minHeight: 180,
    elevation: 6,
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 16,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  popularLabel: { 
    color: COLORS.white, 
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,

  },
  contentContainer: {
    padding: 20,
    borderRadius: 16,
  },
  popularTitle: { 
    color: COLORS.white, 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  popularDesc: { 
    color: '#DDDDDD', 
    fontSize: 16, 
    marginBottom: 20,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  button: { 
    backgroundColor: COLORS.accent, 
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: { 
    color: COLORS.white, 
    fontWeight: 'bold',
    fontSize: 14,
  },
});
