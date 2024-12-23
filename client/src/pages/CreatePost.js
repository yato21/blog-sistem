import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './CreatePost.css';

function CreatePost() {
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    description: '',
    categoryId: '',
    tags: ''
  });
  const [isPreview, setIsPreview] = useState(false);
  const [categories, setCategories] = useState([]);
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Константы для ограничений
  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 200;

  // Обработчики изменений с проверкой длины
  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= TITLE_MAX_LENGTH) {
      setPostData({ ...postData, title: value });
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= DESCRIPTION_MAX_LENGTH) {
      setPostData({ ...postData, description: value });
    }
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!loading) {
      fetchCategories();
    }
  }, [isAuthenticated, loading, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await postsAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault(); // Предотвращаем отправку формы только если это событие формы
    }
    try {
      await postsAPI.createPost(postData);
      navigate('/posts');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-feather-alt fa-spin"></i>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <h2>Создать новый пост</h2>
      
      {isPreview ? (
        <article className="post-detail">
          <header className="post-header">
            <h1 className="post-title">{postData.title}</h1>
            <div className="post-meta">
              <span>
                <i className="fas fa-user"></i>
                {user?.username || 'Неизвестный автор'}
              </span>
              <span>
                <i className="fas fa-calendar"></i>
                {formatDate(new Date())}
              </span>
              {postData.categoryId && (
                <span className="post-category">
                  <i className="fas fa-folder"></i>
                  {categories.find(cat => cat.id === parseInt(postData.categoryId))?.name}
                </span>
              )}
              <span>
                <i className="fas fa-eye"></i>
                0 просмотров
              </span>
            </div>

            {postData.description && (
              <div className="post-description">
                {postData.description}
              </div>
            )}

            {postData.tags && (
              <div className="post-tags">
                {postData.tags.split(',').map((tag, index) => (
                  <span key={index} className="tag" title={tag.trim()}>
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="post-content">
            {postData.content}
          </div>

          <div className="form-actions">
            <button onClick={togglePreview} className="btn btn-secondary">
              Редактировать
            </button>
            <button 
              onClick={handleSubmit} 
              className="btn btn-primary"
            >
              Опубликовать
            </button>
          </div>
        </article>
      ) : (
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>
              Заголовок 
              <span className="char-counter">
                {postData.title.length}/{TITLE_MAX_LENGTH}
              </span>
            </label>
            <input
              type="text"
              value={postData.title}
              onChange={handleTitleChange}
              required
              maxLength={TITLE_MAX_LENGTH}
            />
          </div>

          <div className="form-group">
            <label>
              Краткое описание
              <span className="char-counter">
                {postData.description.length}/{DESCRIPTION_MAX_LENGTH}
              </span>
            </label>
            <textarea
              value={postData.description}
              onChange={handleDescriptionChange}
              rows="3"
              maxLength={DESCRIPTION_MAX_LENGTH}
            />
          </div>

          <div className="form-group">
            <label>Категория</label>
            <select
              value={postData.categoryId}
              onChange={(e) => setPostData({...postData, categoryId: e.target.value})}
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Теги (через запятую)</label>
            <input
              type="text"
              placeholder="Например: новости, технологии, обзор"
              value={postData.tags}
              onChange={(e) => setPostData({...postData, tags: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Содержание</label>
            <textarea
              value={postData.content}
              onChange={(e) => setPostData({...postData, content: e.target.value})}
              rows="15"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={togglePreview} className="btn btn-secondary">
              Предпросмотр
            </button>
            <button type="submit" className="btn btn-primary">
              Опубликовать
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CreatePost; 