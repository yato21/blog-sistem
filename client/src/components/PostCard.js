import { Link } from 'react-router-dom';
import './PostCard.css';
import { formatDate } from '../utils/dateFormat';

const PostMeta = ({ author, date, category, isProfilePage }) => (
  <div className="post-meta">
    <span>
      <i className="fas fa-user"></i>
      {isProfilePage ? (
        author.username
      ) : (
        <Link to={`/profile/${author.id}`} className="author-link">
          {author.username}
        </Link>
      )}
    </span>
    <span>
      <i className="fas fa-calendar"></i>
      {formatDate(date)}
    </span>
    {category && (
      <span className="post-category">
        <i className="fas fa-folder"></i>
        {category.name}
      </span>
    )}
  </div>
);

function PostCard({ post, profileUsername, isProfilePage }) {
  const authorData = post.author || { 
    username: profileUsername,
    id: post.userId
  };

  return (
    <article className="post-card">
      <header>
        <h2 className="post-title">
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h2>
        <PostMeta 
          author={authorData}
          date={post.createdAt}
          category={post.category}
          isProfilePage={isProfilePage}
        />
      </header>

      <p className="post-excerpt">
        {post.description || post.content}
      </p>

      {post.Tags && post.Tags.length > 0 && (
        <div className="post-tags">
          {post.Tags.map(tag => (
            <span key={tag.id} className="tag" title={tag.name}>#{tag.name}</span>
          ))}
        </div>
      )}

      <footer className="post-footer">
        <div className="post-stats">
          <span title="Просмотры">
            <i className="fas fa-eye"></i>
            {post.views_count || 0}
          </span>
          <span title="Комментарии">
            <i className="fas fa-comments"></i>
            {post.comments?.length || 0}
          </span>
        </div>
        <Link to={`/posts/${post.id}`} className="read-more">
          Читать далее
        </Link>
      </footer>
    </article>
  );
}

export default PostCard; 