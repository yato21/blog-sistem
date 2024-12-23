const { Category } = require('../models');

async function seedCategories() {
  try {
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

    for (const category of categories) {
      await Category.create(category);
    }

    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

seedCategories(); 