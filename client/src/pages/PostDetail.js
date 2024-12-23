import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './PostDetail.css';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const viewCountUpdated = useRef(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const fetchPost = async (shouldUpdateViews = false) => {
    try {
      setLoading(true);
      const response = await postsAPI.getPostById(id, shouldUpdateViews);
      console.log('Post data:', response.data);
      setPost(response.data);
    } catch (err) {
      setError('Не удалось загрузить публикацию');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!viewCountUpdated.current) {
      fetchPost(true);
      viewCountUpdated.current = true;
    } else {
      fetchPost(false);
    }
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await postsAPI.createComment(id, { content: comment });
      setComment('');
      fetchPost(); // Обновляем пост, чтобы получить новый комментарий
    } catch (err) {
      console.error('Error creating comment:', err);
    }
  };

  if (loading) return (
    <div className="post-detail-container">
      <div className="loading">
        <i className="fas fa-feather-alt fa-spin"></i>
        <p>Загружаем публикацию...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="post-detail-container">
      <div className="error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!post) return null;

  return (
    <div className="post-detail-container">
      <article className="post-detail">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span>
              <i className="fas fa-user"></i>
              {post.author && post.author.id ? (
                <Link to={`/profile/${post.author.id}`} className="author-link">
                  {post.author.username}
                </Link>
              ) : (
                'Неизвестный автор'
              )}
            </span>
            <span>
              <i className="fas fa-calendar"></i>
              {formatDate(post.createdAt)}
            </span>
            {post.category && (
              <span className="post-category">
                <i className="fas fa-folder"></i>
                {post.category.name}
              </span>
            )}
            <span>
              <i className="fas fa-eye"></i>
              {post.views_count || 0} просмотров
            </span>
          </div>

          {post.description && (
            <div className="post-description">
              {post.description}
            </div>
          )}

          {post.Tags && post.Tags.length > 0 && (
            <div className="post-tags">
              {post.Tags.map(tag => (
                <span key={tag.id} className="tag" title={tag.name}>
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="post-content">
          {post.content}
        </div>

        <footer className="post-footer">
          <div className="post-tags">
            {post.tags?.map(tag => (
              <span key={tag.id} className="tag">#{tag.name}</span>
            ))}
          </div>
        </footer>
      </article>

      <section className="comments-section">
        <h2>Комментарии</h2>
        
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={isAuthenticated ? "Оставьте комментарий..." : "Войдите, чтобы оставить комментарий"}
            disabled={!isAuthenticated}
          />
          <button type="submit" className="btn btn-primary" disabled={!isAuthenticated}>
            Отправить
          </button>
        </form>

        <div className="comments-list">
          {post.comments?.length > 0 ? (
            post.comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  {comment.author && comment.author.id ? (
                    <Link to={`/profile/${comment.author.id}`} className="author-link">
                      {comment.author.username}
                    </Link>
                  ) : (
                    <span className="comment-author">Неизвестный автор</span>
                  )}
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="no-comments">Будьте первым, кто оставит комментарий</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default PostDetail; 