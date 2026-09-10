import AsyncStorage from '@react-native-async-storage/async-storage';

const HOST = '127.0.0.1';
export const BASE_URL = `https://rankcine.rankcine.com/api/v1`;

export const resolveMediaUrl = (url) => {
  if (!url) return null;
  console.log('Resolving media URL:', url);
  if (url.includes('localhost')) {
    return url.replace('localhost', '127.0.0.1');
  }
  
  if (HOST !== '127.0.0.1' && url.includes('127.0.0.1')) {
    return url.replace('127.0.0.1', HOST);
  }
  
  return url;
};

export const getYouTubeInfo = (url) => {
  if (!url) return { isYoutube: false };
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    const videoId = match[2];
    return {
      isYoutube: true,
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }
  return { isYoutube: false };
};

let inMemoryToken = null;
let inMemoryUser = null;
const memoryCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 1000;

export const mobileApi = {
  async getToken() {
    if (inMemoryToken) return inMemoryToken;
    try {
      inMemoryToken = await AsyncStorage.getItem('rankcine_mobile_token');
      return inMemoryToken;
    } catch { return null; }
  },

  async getUser() {
    if (inMemoryUser) return inMemoryUser;
    try {
      const userStr = await AsyncStorage.getItem('rankcine_mobile_user');
      inMemoryUser = userStr ? JSON.parse(userStr) : null;
      return inMemoryUser;
    } catch { return null; }
  },

  async setAuth(token, user) {
    inMemoryToken = token;
    inMemoryUser = user;
    this.clearCache();
    try {
      await AsyncStorage.setItem('rankcine_mobile_token', token);
      await AsyncStorage.setItem('rankcine_mobile_user', JSON.stringify(user));
    } catch (e) { console.error('Failed to save auth:', e); }
  },

  async clearAuth() {
    inMemoryToken = null;
    inMemoryUser = null;
    this.clearCache();
    try {
      await AsyncStorage.removeItem('rankcine_mobile_token');
      await AsyncStorage.removeItem('rankcine_mobile_user');
    } catch (e) { console.error('Failed to clear auth:', e); }
  },

  clearCache() {
    memoryCache.clear();
  },

  async request(endpoint, method = 'GET', body = null, isFormData = false) {
    const token = await this.getToken();
    const headers = {};

    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isFormData && body) headers['Content-Type'] = 'application/json';

    const isGet = method === 'GET';
    const cacheKey = `${token || 'anon'}_${endpoint}`;

    if (isGet) {
      const cached = memoryCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
      }
    }

    const config = {
      method,
      headers,
      body: isFormData ? body : (body ? JSON.stringify(body) : null),
    };

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, config);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error?.message || 'API request failed.');

      if (isGet) {
        memoryCache.set(cacheKey, { data: data.data, timestamp: Date.now() });
      } else {
        this.clearCache();
      }

      return data.data;
    } catch (err) {
      console.error(`Mobile API Error [${method} ${endpoint}]:`, err.message);
      throw err;
    }
  },

  get(endpoint) { return this.request(endpoint, 'GET'); },
  post(endpoint, body) { return this.request(endpoint, 'POST', body); },
  patch(endpoint, body) { return this.request(endpoint, 'PATCH', body); },
  delete(endpoint) { return this.request(endpoint, 'DELETE'); },
  upload(endpoint, formData) { return this.request(endpoint, 'POST', formData, true); }
};