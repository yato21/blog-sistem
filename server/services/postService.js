const { Post, User, Comment } = require('../models');

class PostService {
  async createPost(userId, title, content) {
    return Post.create({
      userId,
      title,
      content
    });
  }

  async getAllPosts() {
    return Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['username']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['username']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }
}

module.exports = new PostService(); 