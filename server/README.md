# Серверная часть блог-системы

## Установка

1. Установите зависимости:

```bash
npm install
```
2. Создайте файл `.env` и настройте переменные окружения:

```env
PORT=5000
JWT_SECRET=ваш_секретный_ключ
DB_NAME=blog_db
DB_USER=postgres
DB_PASSWORD=12345
DB_HOST=localhost
```

## Доступные скрипты

- `npm start` - запуск сервера
- `npm run dev` - запуск сервера в режиме разработки
- `npm run sync-db` - синхронизация базы данных
- `npm run seed` - заполнение базы данных тестовыми данными

## API Endpoints

### Аутентификация
- POST `/api/auth/login` - вход в систему
- POST `/api/auth/register` - регистрация

### Посты
- GET `/api/posts` - получение всех постов
- POST `/api/posts` - создание нового поста
- GET `/api/posts/:id` - получение поста по ID