<div className="comment-author">
  <Link to={`/profile/${comment.author.id}`} className="author-link">
    {comment.author.username}
  </Link>
  <span className="comment-date">{formatDate(comment.createdAt)}</span>
</div> 