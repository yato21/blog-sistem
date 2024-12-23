const { User, Category, Post, Tag } = require('../models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    // Создаем категории
    const categories = [
      {
        name: 'Технологии',
        description: 'Статьи о технологиях и инновациях',
        slug: 'technology'
      },
      {
        name: 'Наука',
        description: 'Научные открытия и исследования',
        slug: 'science'
      },
      {
        name: 'Культура',
        description: 'Искусство, литература и культурные события',
        slug: 'culture'
      },
      {
        name: 'Путешествия',
        description: 'Путешествия и приключения',
        slug: 'travel'
      },
      {
        name: 'Образование',
        description: 'Обучение и развитие',
        slug: 'education'
      }
    ];

    console.log('Creating categories...');
    const createdCategories = await Category.bulkCreate(categories);

    // Создаем тестовых пользователей
    console.log('Creating test users...');
    const passwordHash = await bcrypt.hash('password123', 10);
    const users = await User.bulkCreate([
      {
        username: 'admin',
        email: 'admin@example.com',
        password_hash: passwordHash,
        is_admin: true
      },
      {
        username: 'writer',
        email: 'writer@example.com',
        password_hash: passwordHash
      },
      {
        username: 'blogger',
        email: 'blogger@example.com',
        password_hash: passwordHash
      }
    ]);

    // Создаем теги
    console.log('Creating tags...');
    const tags = await Tag.bulkCreate([
      { name: 'программирование', slug: 'programming' },
      { name: 'веб-разработка', slug: 'web-development' },
      { name: 'искусственный интеллект', slug: 'ai' },
      { name: 'путешествия', slug: 'travel' },
      { name: 'образование', slug: 'education' },
      { name: 'наука', slug: 'science' },
      { name: 'технологии', slug: 'tech' },
      { name: 'искусство', slug: 'art' },
      { name: 'литература', slug: 'literature' },
      { name: 'история', slug: 'history' }
    ]);

    // Создаем тестовые посты
    console.log('Creating test posts...');
    const posts = [
      {
        title: 'Введение в искусственный интеллект',
        content: 'Подробное описание основ искусственного интеллекта и его применения в современном мире...',
        description: 'Краткий обзор основных концепций искусственного интеллекта и его влияния на современные технологии',
        userId: users[0].id,
        categoryId: createdCategories[0].id,
        status: 'published'
      },
      {
        title: 'Путешествие по Европе',
        content: 'Делюсь впечатлениями от путешествия по странам Европы...',
        description: 'Интересные места, советы путешественникам и личные впечатления от поездки по европейским странам',
        userId: users[1].id,
        categoryId: createdCategories[3].id,
        status: 'published'
      },
      {
        title: 'Современные методы обучения',
        content: 'Обзор эффективных методик обучения в цифровую эпоху...',
        description: 'Анализ современных подходов к образованию и их эффективности в цифровом мире',
        userId: users[2].id,
        categoryId: createdCategories[4].id,
        status: 'published'
      },
      {
        title: 'Новости квантовой физики',
        content: 'Последние открытия в области квантовой физики...',
        description: 'Обзор последних достижений и открытий в области квантовой физики',
        userId: users[0].id,
        categoryId: createdCategories[1].id,
        status: 'published'
      },
      {
        title: 'Современное искусство',
        content: 'Тенденции в современном искусстве и их влияние на общество...',
        description: 'Анализ современных направлений в искусстве и их социального значения',
        userId: users[1].id,
        categoryId: createdCategories[2].id,
        status: 'published'
      }
    ];

    const createdPosts = await Post.bulkCreate(posts);

    // Привязываем теги к постам
    await createdPosts[0].setTags([tags[0], tags[2], tags[6]]); // AI пост
    await createdPosts[1].setTags([tags[3], tags[7]]); // Путешествия
    await createdPosts[2].setTags([tags[4], tags[6]]); // Образование
    await createdPosts[3].setTags([tags[5], tags[6]]); // Физика
    await createdPosts[4].setTags([tags[7], tags[8]]); // Искусство

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
}

seedDatabase(); 