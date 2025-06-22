import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const initialLayout = { width: Dimensions.get('window').width };

// Цветовая схема
const COLORS = {
  purple: '#6A0DAD', // фиолетовый
  gray: '#333333',   // темно-серый
  white: '#FFFFFF',  // белый
  black: '#000000',  // черный
  lightGray: '#222222', // светло-серый для фона
  accent: '#9370DB',  // светло-фиолетовый для акцентов
};

export default function SwipeableTabView({ homeComponent, newsComponent }: { homeComponent: React.ComponentType; newsComponent: React.ComponentType }) {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  
  const [routes] = useState([
    { key: 'home', title: 'Главная' },
    { key: 'news', title: 'Новости' },
  ]);

  const renderScene = SceneMap({
    home: homeComponent,
    news: newsComponent,
  });

  const renderTabBar = (props: any) => (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route: any, i: number) => {
        const isActive = index === i;
        
        return (
          <TouchableOpacity
            key={i}
            style={[styles.tabItem, isActive && styles.activeTabItem]}
            onPress={() => setIndex(i)}
          >
            {route.key === 'home' ? (
              <Ionicons name="home" size={24} color={isActive ? COLORS.accent : COLORS.white} />
            ) : (
              <MaterialCommunityIcons name="book-open-page-variant" size={24} color={isActive ? COLORS.accent : COLORS.white} />
            )}
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {route.title}
            </Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      swipeEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray,
    height: 60,    
    position: 'absolute',
    borderRadius: 20,
    bottom: 0,
    width: '100%',
    left: 0,
    right: 0,
    zIndex: 100,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  activeTabItem: {
    backgroundColor: 'rgba(106, 13, 173, 0)',
  },
  tabText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
  },
  activeTabText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: '20%',
    height: 3,
    backgroundColor: COLORS.accent,
    borderRadius: 1,
  },
});
