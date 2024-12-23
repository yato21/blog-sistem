const { Post, User, Category, Tag, Comment } = require('../models');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'title', 'content', 'description', 'createdAt', 'views_count', 'categoryId', 'status'],
      include: [
        { 
          model: User, 
          as: 'author', 
          attributes: ['username', 'id']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id']
        },
        {
          model: Tag,
          through: { attributes: [] }
        }
      ],
      where: {
        status: 'published'
      },
      order: [['createdAt', 'DESC']]
    });
    
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'Публикации не найдены' });
    }

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      message: 'Произошла ошибка при загрузке публикаций',
      error: error.message 
    });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, categoryId, tags, description } = req.body;
    
    console.log('Received tags:', tags, 'Type:', typeof tags);
    
    // Преобразуем строку тегов в массив и очищаем от пробелов
    let tagArray = [];
    if (typeof tags === 'string' && tags.trim()) {
      tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
    } else if (Array.isArray(tags)) {
      tagArray = tags.map(tag => tag.trim().toLowerCase());
    }
    
    console.log('Processed tagArray:', tagArray);
    
    // Проверяем существование категории
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Категория не найдена' });
    }

    const post = await Post.create({
      title,
      content,
      userId: req.user.id,
      categoryId,
      description,
      status: 'published'
    });

    // Обработка тегов
    if (tagArray.length > 0) {
      const createdTags = await Promise.all(
        tagArray.map(async (tagName) => {
          const [tag] = await Tag.findOrCreate({
            where: { name: tagName },
            defaults: { 
              slug: tagName.replace(/\s+/g, '-')
            }
          });
          return tag;
        })
      );
      await post.setTags(createdTags);
    }

    const postWithDetails = await Post.findByPk(post.id, {
      include: [
        { 
          model: User, 
          as: 'author', 
          attributes: ['username'] 
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Tag,
          through: { attributes: [] }
        }
      ]
    });

    res.status(201).json(postWithDetails);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }
    
    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав на редактирование' });
    }

    await post.update(req.body);
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }
    
    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }

    await post.destroy();
    res.json({ message: 'Пост удален' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const { update_views } = req.query;

    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
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
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username']
            }
          ]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    if (update_views === 'true') {
      post.views_count = (post.views_count || 0) + 1;
      await post.save();
    }

    res.json(post);
  } catch (error) {
    console.error('Error in getPostById:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Публикация не найдена' });
    }

    const comment = await Comment.create({
      content,
      postId: id,
      userId
    });

    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['username']
        }
      ]
    });

    res.status(201).json(commentWithAuthor);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalPosts = await Post.count({
      where: {
        status: 'published'
      }
    });
    
    const totalUsers = await User.count();
    
    const totalComments = await Comment.count();
    
    res.json({
      totalPosts,
      totalUsers,
      totalComments
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      message: 'Произошла ошибка при получении статистики',
      error: error.message 
    });
  }
};