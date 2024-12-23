import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Добавляем кэширование для часто используемых запросов
const cache = new Map();

export const postsAPI = {
  getAllPosts: async () => {
    const cacheKey = 'all-posts';
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    try {
      const response = await api.get('/posts');
      cache.set(cacheKey, response);
      return response;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },
  getPostById: (id, updateViews = false) => {
    return api.get(`/posts/${id}${updateViews ? '?update_views=true' : ''}`);
  },
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    cache.delete('all-posts');
    return response;
  },
  createComment: (postId, comment) => api.post(`/posts/${postId}/comments`, comment),
  getCategories: () => api.get('/categories'),
  getStats: () => api.get('/posts/stats'),
  getUserPosts: (userId) => api.get(`/users/${userId}/posts`),
};

export const userAPI = {
  getProfile: (userId) => api.get(`/users/${userId}/profile`),
  getCurrentUserProfile: () => api.get('/users/me/profile'),
};

export default api; 