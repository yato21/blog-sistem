import { useState, useEffect, useReducer } from 'react';
import { postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import './Posts.css';
import { Link } from 'react-router-dom';

const initialState = {
  posts: [],
  loading: true,
  error: null,
  filters: {
    searchTerm: '',
    sortBy: 'newest',
    category: 'all',
    tag: ''
  }
};

function postsReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, posts: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_FILTER':
      return { 
        ...state, 
        filters: { ...state.filters, [action.field]: action.value }
      };
    default:
      return state;
  }
}

function Posts() {
  const [state, dispatch] = useReducer(postsReducer, initialState);
  const [categories, setCategories] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchPopularPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await postsAPI.getAllPosts();
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.response?.data?.message || 'Произошла ошибка при загрузке публикаций' });
      console.error('Error fetching posts:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await postsAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchPopularPosts = async () => {
    try {
      const response = await postsAPI.getAllPosts();
      const popular = [...response.data]
        .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
        .slice(0, 3);
      setPopularPosts(popular);
    } catch (err) {
      console.error('Error fetching popular posts:', err);
    }
  };

  const filteredPosts = state.posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(state.filters.searchTerm.toLowerCase());
      const matchesCategory = state.filters.category === 'all' || post.categoryId === parseInt(state.filters.category);
      const matchesTag = !state.filters.tag || 
                        (post.Tags && post.Tags.some(tag => 
                          tag.name.toLowerCase().includes(state.filters.tag.toLowerCase())
                        ));
      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      if (state.filters.sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (state.filters.sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (state.filters.sortBy === 'popular') return b.views_count - a.views_count;
      return 0;
    });

  if (state.loading) return (
    <div className="posts-container">
      <div className="loading">
        <i className="fas fa-feather-alt fa-spin"></i>
        <p>Загружаем публикации...</p>
      </div>
    </div>
  );

  if (state.error) return (
    <div className="posts-container">
      <div className="error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{state.error}</p>
      </div>
    </div>
  );

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1>Публикации</h1>
        <div className="posts-controls">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Поиск публикаций..."
              value={state.filters.searchTerm}
              onChange={(e) => dispatch({ type: 'UPDATE_FILTER', field: 'searchTerm', value: e.target.value })}
            />
          </div>
          
          <div className="filters">
            <select 
              value={state.filters.sortBy} 
              onChange={(e) => dispatch({ type: 'UPDATE_FILTER', field: 'sortBy', value: e.target.value })}
              className="sort-select"
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="popular">Популярные</option>
            </select>

            <select 
              value={state.filters.category} 
              onChange={(e) => dispatch({ type: 'UPDATE_FILTER', field: 'category', value: e.target.value })}
              className="category-select"
            >
              <option value="all">Все категории</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Фильтр по тегу"
              value={state.filters.tag}
              onChange={(e) => dispatch({ type: 'UPDATE_FILTER', field: 'tag', value: e.target.value })}
              className="tag-filter"
            />
          </div>
        </div>
      </div>

      <div className="posts-layout">
        <div className="posts-main">
          {filteredPosts.length === 0 ? (
            <div className="no-posts">
              <i className="fas fa-newspaper"></i>
              <p>Публикации не найдены</p>
            </div>
          ) : (
            <div className="posts-list">
              {filteredPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={{
                    ...post,
                    category: categories.find(cat => cat.id === post.categoryId)
                  }}
                  isProfilePage={false}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="posts-sidebar">
          <div className="popular-posts">
            <h3>Популярные публикации</h3>
            {popularPosts.map(post => (
              <div key={post.id} className="popular-post-card">
                <Link to={`/posts/${post.id}`}>
                  <h4>{post.title}</h4>
                  <div className="post-stats">
                    <span>
                      <i className="fas fa-eye"></i>
                      {post.views_count || 0}
                    </span>
                    <span>
                      <i className="fas fa-comments"></i>
                      {post.comments?.length || 0}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Posts; 