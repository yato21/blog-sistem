const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('blog_db', 'postgres', '12345', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false // отключаем логи SQL запросов
});

module.exports = sequelize; 