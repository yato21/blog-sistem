const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Импортируем модели
const UserModel = require('./user');
const PostModel = require('./post');
const CommentModel = require('./comment');
const CategoryModel = require('./category');
const TagModel = require('./tag');

// Инициализируем модели
const User = UserModel(sequelize);
const Post = PostModel(sequelize);
const Comment = CommentModel(sequelize);
const Category = CategoryModel(sequelize);
const Tag = TagModel(sequelize);

// Определяем связи
User.hasMany(Post, {
  foreignKey: 'userId',
  as: 'posts'
});
Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
});

User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments'
});
Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
});

Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments'
});
Comment.belongsTo(Post, {
  foreignKey: 'postId'
});

Post.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

Category.hasMany(Post, {
  foreignKey: 'categoryId',
  as: 'posts'
});

// Многие-ко-многим для постов и тегов
Post.belongsToMany(Tag, { through: 'PostTags' });
Tag.belongsToMany(Post, { through: 'PostTags' });

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Category,
  Tag
}; 