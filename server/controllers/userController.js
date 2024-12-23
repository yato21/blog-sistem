const { User, Post, Comment, Category, Tag } = require('../models');

exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'createdAt'],
      include: [{
        model: Post,
        as: 'posts',
        include: [
          {
            model: Comment,
            as: 'comments',
            attributes: ['id']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          },
          {
            model: Tag,
            through: { attributes: [] },
            attributes: ['id', 'name']
          }
        ]
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Подсчитываем статистику
    const stats = {
      totalPosts: user.posts.length,
      totalViews: user.posts.reduce((acc, post) => acc + (post.views_count || 0), 0),
      totalComments: user.posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0)
    };

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      posts: user.posts,
      stats
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: error.message });
  }
}; 