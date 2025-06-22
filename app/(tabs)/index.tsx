import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchNewsList } from '@/api/news';
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

// Типы для новостей
interface NewsItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  status: string;
  published_at: string;
  image: string;
  is_featured: boolean;
  views_count: number;
  author_name: string;
  category_name: string;
}

export default function HomeScreen() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    fetchNewsList()
      .then(data => {
        if (Array.isArray(data)) {
          setNews(
            data
              .filter((n: NewsItem) => n.status === 'published')
              .sort((a: NewsItem, b: NewsItem) => {
                // Сортировка в первую очередь по количеству просмотров
                if (a.views_count > b.views_count) return -1;
                if (a.views_count < b.views_count) return 1;
                // Затем если равны, учитываем is_featured
                if (a.is_featured && !b.is_featured) return -1;
                if (!a.is_featured && b.is_featured) return 1;
                // Затем по дате
                if (!a.published_at) return 1;
                if (!b.published_at) return -1;
                return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
              })
          );
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
  }, []);

  if (loading) return (
    <View style={[styles.centered, { backgroundColor: COLORS.black }]}>
      <ActivityIndicator color={COLORS.purple} size="large" />
    </View>
  );
  
  if (error) return (
    <View style={[styles.centered, { backgroundColor: COLORS.black }]}>
      <Text style={{ color: COLORS.white, fontSize: 16, marginBottom: 16 }}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={() => {
          setLoading(true);
          fetchNewsList()
            .then(data => {
              if (Array.isArray(data)) {
                setNews(
                  data
                    .filter((n: NewsItem) => n.status === 'published')
                    .sort((a: NewsItem, b: NewsItem) => {
                      // Сортировка в первую очередь по количеству просмотров
                      if (a.views_count > b.views_count) return -1;
                      if (a.views_count < b.views_count) return 1;
                      // Затем если равны, учитываем is_featured
                      if (a.is_featured && !b.is_featured) return -1;
                      if (!a.is_featured && b.is_featured) return 1;
                      // Затем по дате
                      if (!a.published_at) return 1;
                      if (!b.published_at) return -1;
                      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
                    })
                );
              }
              setLoading(false);
              setError(null);
            })
            .catch((err) => {
              setError(`Ошибка загрузки новостей: ${err.message || 'Неизвестная ошибка'}`);
              console.error('Ошибка при загрузке новостей:', err);
              setLoading(false);
            });
        }}
      >
        <Text style={styles.retryText}>Повторить</Text>
      </TouchableOpacity>
    </View>
  );

  const popular = news[0];
  const rest = news.slice(1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <View style={styles.container}>
        
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Главная</Text>
          <Text style={styles.subheader}>Список последних новостей</Text>
        </View>
        
        <FlatList
          data={rest}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={styles.listItem}
              onPress={() => router.push(`/news/${item.slug}`)}
              activeOpacity={0.7}
            >
              <View style={styles.itemNumberContainer}>
                <Text style={styles.itemNumber}>{index + 2}</Text>
                {(item.is_featured || item.views_count > 0) && (
                  <Ionicons name="star" size={12} color={COLORS.accent} style={styles.starIcon} />
                )}
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.itemMeta}>
                  <Text style={styles.categoryText}>{item.category_name}</Text>
                  <Text style={styles.dateText}>
                    {new Date(item.published_at).toLocaleDateString('ru-RU')}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.accent} />
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            popular && (
              <TouchableOpacity 
                style={styles.featuredContainer}
                onPress={() => router.push(`/news/${popular.slug}`)}
                activeOpacity={0.9}
              >
                {popular.image && (
                  <Image 
                    source={{ uri: popular.image }} 
                    style={styles.featuredImage} 
                    resizeMode="cover"
                  />
                )}
                <View style={styles.featuredContent}>
                  {(popular.is_featured || popular.views_count) && (
                    <View style={styles.featuredBadge}>
                      <Ionicons name="star" size={12} color={COLORS.white} />
                      <Text style={styles.featuredText}>Популярное</Text>
                    </View>
                  )}
                  <Text style={styles.featuredTitle}>{popular.title}</Text>
                  <Text style={styles.featuredDescription} numberOfLines={2}>
                    {popular.description}
                  </Text>
                  <View style={styles.featuredMeta}>
                    <Text style={styles.categoryBadge}>{popular.category_name}</Text>
                    <Text style={styles.dateBadge}>
                      {new Date(popular.published_at).toLocaleDateString('ru-RU')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onRefresh={() => {
            setLoading(true);
            fetchNewsList()
              .then(data => {
                if (Array.isArray(data)) {
                  setNews(
                    data
                      .filter((n: NewsItem) => n.status === 'published')
                      .sort((a: NewsItem, b: NewsItem) => {
                        // Сортировка в первую очередь по количеству просмотров
                        if (a.views_count > b.views_count) return -1;
                        if (a.views_count < b.views_count) return 1;
                        // Затем если равны, учитываем is_featured
                        if (a.is_featured && !b.is_featured) return -1;
                        if (!a.is_featured && b.is_featured) return 1;
                        // Затем по дате
                        if (!a.published_at) return 1;
                        if (!b.published_at) return -1;
                        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
                      })
                  );
                }
                setLoading(false);
                setError(null);
              })
              .catch((err) => {
                setError(`Ошибка загрузки новостей: ${err.message || 'Неизвестная ошибка'}`);
                console.error('Ошибка при загрузке новостей:', err);
                setLoading(false);
              });
          }}
          refreshing={loading}
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
  subheader: { 
    color: COLORS.white, 
    fontSize: 18, 
    marginBottom: 16,
    opacity: 0.8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 12,
    padding: 14,
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemNumberContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  itemNumber: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
  },
  starIcon: {
    marginTop: 4,
  },
  itemContent: {
    flex: 1,
  },
  newsTitle: { 
    color: COLORS.white, 
    fontSize: 16,
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  categoryText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#999',
    fontSize: 12,
  },
  retryButton: {
    backgroundColor: COLORS.purple,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  featuredContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#333',
  },
  featuredContent: {
    padding: 16,
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
  featuredTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredDescription: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateBadge: {
    color: '#999',
    fontSize: 12,
  },
});
