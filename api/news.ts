const API_URL = 'http://your-api.ru/api/guest/news-feeds';


export async function fetchNewsList() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function fetchNewsById(slug: string) {
  const res = await fetch(`${API_URL}/${slug}`);
  return await res.json();
}
