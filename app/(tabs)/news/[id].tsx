import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Share, Image } from 'react-native';
import { fetchNewsById } from '@/api/news';
import BackBar from '@/components/BackBar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

interface NewsDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  status: string;
  published_at: string;
  image: string;
  is_featured: boolean;
  views_count: number;
  meta_title: string | null;
  meta_description: string | null;
  author: {
    name: string;
    id: number;
  };
  category: {
    name: string;
    id: number;
  };
}

export default function NewsDetailScreen() {
  const params = useLocalSearchParams();
  const slug = params.id as string; // Для совместимости с текущей структурой путей
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    if (slug) {
      fetchNewsById(slug)
        .then(data => {
          setNews(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(`Ошибка загрузки новости: ${err.message || 'Неизвестная ошибка'}`);
          console.error('Ошибка при загрузке новости:', err);
          setLoading(false);
        });
    }
  }, [slug]);

  const shareNews = async () => {
    if (news) {
      try {
        await Share.share({
          message: `${news.title} - ${news.description}`,
          title: news.title,
        });
      } catch (error) {
        console.log('Ошибка при попытке поделиться:', error);
      }
    }
  };

  if (loading) return (
    <View style={[styles.centered, { backgroundColor: COLORS.black }]}>
      <ActivityIndicator color={COLORS.accent} size="large" />
    </View>
  );
  
  if (error) return (
    <View style={[styles.centered, { backgroundColor: COLORS.black }]}>
      <Text style={{ color: COLORS.white, fontSize: 16, marginBottom: 16 }}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={() => {
          setLoading(true);
          if (slug) {
            fetchNewsById(slug)
              .then(data => {
                setNews(data);
                setLoading(false);
                setError(null);
              })
              .catch((err) => {
                setError(`Ошибка загрузки новости: ${err.message || 'Неизвестная ошибка'}`);
                console.error('Ошибка при загрузке новости:', err);
                setLoading(false);
              });
          }
        }}
      >
        <Text style={styles.retryText}>Повторить</Text>
      </TouchableOpacity>
    </View>
  );
  
  if (!news) return (
    <View style={[styles.centered, { backgroundColor: COLORS.black }]}>
      <Text style={{ color: COLORS.white, fontSize: 16 }}>Новость не найдена</Text>
      <TouchableOpacity 
        style={[styles.retryButton, { marginTop: 16 }]}
        onPress={() => router.navigate('/news')}
      >
        <Text style={styles.retryText}>К списку новостей</Text>
      </TouchableOpacity>
    </View>
  );

  // Форматирование даты
  const formattedDate = news.published_at ? new Date(news.published_at).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Дата не указана';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          
          {news.image && (
            <Image 
              source={{ uri: news.image }} 
              style={styles.headerImage} 
              resizeMode="cover"
            />
          )}
          
          <View style={styles.content}>
            <View style={styles.categoryRow}>
              <View style={styles.category}>
                <Text style={styles.categoryText}>{news.category.name}</Text>
              </View>
              {(news.is_featured || news.views_count) && (
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={14} color={COLORS.white} />
                  <Text style={styles.featuredText}>Популярное</Text>
                </View>
              )}
              <View style={styles.viewsCount}>
                <Ionicons name="eye-outline" size={14} color={COLORS.white} />
                <Text style={styles.viewsText}>{news.views_count}</Text>
              </View>
            </View>
            
            <View style={styles.titleRow}>
              <Text style={styles.title}>{news.title}</Text>
              <TouchableOpacity style={styles.shareButton} onPress={shareNews}>
                <Ionicons name="share-social-outline" size={22} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.desc}>{news.description}</Text>
            
            <View style={styles.contentBlock}>
              <Text style={styles.contentText}>{news.content}</Text>
            </View>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={16} color={COLORS.accent} style={styles.metaIcon} />
                <Text style={styles.meta}>Автор: {news.author.name || 'Неизвестен'}</Text>
              </View>
              
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.accent} style={styles.metaIcon} />
                <Text style={styles.meta}>Опубликовано: {formattedDate}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <BackBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  container: { 
    flex: 1, 
    backgroundColor: COLORS.black,
  },
  headerImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#333',
  },
  content: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 80,
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: 12,
  },
  title: { 
    color: COLORS.white, 
    fontSize: 28, 
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 34,
    flex: 1,
    textShadowColor: 'rgba(106, 13, 173, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  desc: { 
    color: COLORS.white, 
    fontSize: 18, 
    marginBottom: 24,
    lineHeight: 26,
  },
  contentBlock: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  contentText: {
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 24,
  },
  metaContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaIcon: {
    marginRight: 8,
  },
  meta: { 
    color: '#CCCCCC', 
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: COLORS.purple,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  featuredText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  viewsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewsText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 4,
  },
});
