import React from 'react';
import { View } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import SwipeableTabView from '@/components/SwipeableTabView';
import HomeScreen from './index';
import NewsFeedScreen from './news';

// Основной компонент навигации
export default function TabLayout() {
  const pathname = usePathname();
  
  // Если путь содержит [id], это детальная страница новости, рендерим Slot
  if (pathname.includes('[id]') || pathname.includes('/news/')) {
    return <Slot />;
  }

  // Иначе показываем основной SwipeableTabView с вкладками
  return (
    <View style={{ flex: 1 }}>
      <SwipeableTabView
        homeComponent={HomeScreen}
        newsComponent={NewsFeedScreen}
      />
    </View>
  );
}
