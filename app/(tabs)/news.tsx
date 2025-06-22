import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchNewsList } from '@/api/news';
import NewsCard from '@/components/NewsCard';
import { LinearGradient } from 'expo-linear-gradient';
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

// Типы для новостей
interface NewsItem {
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
  author_name: string;
  category_name: string;
}

export default function NewsFeedScreen() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const loadNews = () => {
    try {
      setLoading(true);
      fetchNewsList()
        .then(data => {
          if (Array.isArray(data)) {
            setNews(
              data
                .filter((n: NewsItem) => n.status === 'published')
                .sort((a: NewsItem, b: NewsItem) => {
                  if (!a.published_at) return 1;
                  if (!b.published_at) return -1;
                  return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
                })
            );
            setError(null);
          } else {
            console.error('Данные не являются массивом:', data);
            setError('Некорректный формат данных');
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(`Ошибка загрузки новостей: ${err.message || 'Неизвестная ошибка'}`);
          console.error('Ошибка при загрузке новостей:', err);
          setLoading(false);
        });
    } catch (e) {
      console.error('Неожиданная ошибка:', e);
      setError(`Непредвиденная ошибка: ${e instanceof Error ? e.message : 'Неизвестная ошибка'}`);
      setLoading(false);
    }
  };

  // Получение уникальных категорий
  const getCategories = () => {
    const categories = news.map(item => item.category_name);
    return ['Все', ...new Set(categories)];
  };

  // Фильтрация новостей по категории
  const getFilteredNews = () => {
    if (!selectedCategory || selectedCategory === 'Все') {
      return news;
    }
    return news.filter(item => item.category_name === selectedCategory);
  };

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    // Загружаем новости при монтировании компонента
    loadNews();
    
    // Используем безопасную версию интервала
    let interval: NodeJS.Timeout | null = null;
    try {
      interval = setInterval(() => {
        loadNews();
      }, 60000); // 60 секунд
    } catch (e) {
      console.error('Ошибка при создании интервала:', e);
    }
    
    // Очищаем интервал при размонтировании компонента
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  if (loading && news.length === 0) return (
    <View style={[styles.centered, { backgroundColor: COLORS.black }]}>
      <ActivityIndicator color={COLORS.purple} size="large" />
    </View>
  );
  
  if (error && news.length === 0) return (
    <View style={[styles.centered, { backgroundColor: COLORS.black }]}>
      <Text style={{ color: COLORS.white, fontSize: 16, marginBottom: 16 }}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={loadNews}
      >
        <Text style={styles.retryText}>Повторить</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredNews = getFilteredNews();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <View style={styles.container}>
        
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Новости</Text>
          <Text style={styles.subheader}>Свежие новости и события</Text>
        </View>
        
        {error && (
          <Text style={styles.errorText}>
            {error}
          </Text>
        )}

        {/* Категории */}
        <View>
          <FlatList
            horizontal
            data={getCategories()}
            keyExtractor={(item, index) => `category-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === item ? styles.selectedCategory : null
                ]}
                onPress={() => setSelectedCategory(item === 'Все' ? null : item)}
              >
                <Text 
                  style={[
                    styles.categoryText,
                    selectedCategory === item ? styles.selectedCategoryText : null
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>
        
        {loading && news.length > 0 && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={COLORS.purple} size="small" />
            <Text style={styles.loadingText}>Обновление...</Text>
          </View>
        )}
        
        <FlatList
          data={filteredNews}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.newsItem}>
              {item.image && (
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.newsImage} 
                  resizeMode="cover"
                />
              )}
              <View style={styles.newsContent}>
                {(item.is_featured || item.views_count) && (
                  <View style={styles.featuredBadge}>
                    <Ionicons name="star" size={12} color={COLORS.white} />
                    <Text style={styles.featuredText}>Популярное</Text>
                  </View>
                )}
                <TouchableOpacity 
                  onPress={() => router.push(`/news/${item.slug}`)}
                >
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <Text style={styles.newsDescription} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.newsFooter}>
                    <Text style={styles.categoryLabel}>{item.category_name}</Text>
                    <Text style={styles.dateLabel}>
                      {new Date(item.published_at).toLocaleDateString('ru-RU')}
                    </Text>
                    <Text style={styles.authorLabel}>{item.author_name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={loadNews}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {loading ? 'Загрузка новостей...' : 'Нет новостей'}
              </Text>
            </View>
          }
        />
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
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 60,
    marginBottom: 20,
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: { 
    color: COLORS.accent, 
    fontSize: 34, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    textAlign: 'left',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(106, 13, 173, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 10,
  },
  subheader: {
    color: COLORS.white,
    fontSize: 18,
    opacity: 0.8,
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: COLORS.white,
    fontSize: 16,
    opacity: 0.6,
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF4444',
    margin: 16,
    fontSize: 14,
  },
  loadingOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  loadingText: {
    color: COLORS.white,
    marginLeft: 8,
    fontSize: 14,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  newsItem: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#333',
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  newsDescription: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  categoryLabel: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateLabel: {
    color: '#999',
    fontSize: 12,
  },
  authorLabel: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featuredText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
