import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import PostCard from '../components/PostCard';
import './Profile.css';
import { AuthContext } from '../context/AuthContext';

function UserProfile() {
  const { user: currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0
  });
  const [profileData, setProfileData] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
    tag: '',
    sortBy: 'newest'
  });

  const isOwnProfile = currentUser && currentUser.id === parseInt(id);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProfile(id);
        setProfileData(response.data.user);
        setUserPosts(response.data.posts);
        setFilteredPosts(response.data.posts);
        setStats(response.data.stats);

        const uniqueCategories = response.data.posts.reduce((acc, post) => {
          if (post.category && !acc.some(cat => cat.id === post.category.id)) {
            acc.push(post.category);
          }
          return acc;
        }, []);
        setCategories(uniqueCategories);

        const popular = [...response.data.posts]
          .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
          .slice(0, 3);
        setPopularPosts(popular);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Не удалось загрузить профиль');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  useEffect(() => {
    let result = [...userPosts];

    if (filters.searchTerm) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      result = result.filter(post => 
        post.category && post.category.id === parseInt(filters.category)
      );
    }

    if (filters.tag) {
      result = result.filter(post =>
        post.Tags && post.Tags.some(tag => 
          tag.name.toLowerCase().includes(filters.tag.toLowerCase())
        )
      );
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return (b.views_count || 0) - (a.views_count || 0);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredPosts(result);
  }, [userPosts, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="profile-container container">
      <header className="profile-header">
        <div className="profile-info">
          <h1>{profileData.username}</h1>
          <div className="profile-meta">
            {isOwnProfile && (
              <span>
                <i className="fas fa-envelope"></i>
                {profileData.email}
              </span>
            )}
            <span>
              <i className="fas fa-calendar"></i>
              Дата регистрации: {new Date(profileData.createdAt).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat-card">
            <i className="fas fa-file-alt"></i>
            <h3>{stats.totalPosts}</h3>
            <p>Публикаций</p>
          </div>
          <div className="profile-stat-card">
            <i className="fas fa-eye"></i>
            <h3>{stats.totalViews}</h3>
            <p>Просмотров</p>
          </div>
          <div className="profile-stat-card">
            <i className="fas fa-comments"></i>
            <h3>{stats.totalComments}</h3>
            <p>Комментариев</p>
          </div>
        </div>
      </header>

      <div className="profile-content">
        <div className="posts-main">
          <section className="posts-section">
            <div className="posts-header">
              <h2>Публикации</h2>
              
              <div className="posts-controls">
                <div className="search-box">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Поиск публикаций..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  />
                </div>
                
                <div className="filters">
                  <select 
                    value={filters.sortBy} 
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="sort-select"
                  >
                    <option value="newest">Сначала новые</option>
                    <option value="oldest">Сначала старые</option>
                    <option value="popular">Популярные</option>
                  </select>

                  <select 
                    value={filters.category} 
                    onChange={(e) => handleFilterChange('category', e.target.value)}
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
                    value={filters.tag}
                    onChange={(e) => handleFilterChange('tag', e.target.value)}
                    className="tag-filter"
                  />
                </div>
              </div>
            </div>

            <div className="posts-divider"></div>

            <div className="posts-list">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    profileUsername={profileData.username}
                    isProfilePage={true}
                  />
                ))
              ) : (
                <div className="no-posts">
                  <i className="fas fa-pen-fancy"></i>
                  <p>Публикации не найдены</p>
                </div>
              )}
            </div>
          </section>
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

export default UserProfile; 