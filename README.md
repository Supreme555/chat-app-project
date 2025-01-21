# Приложение для чата в реальном времени

Это полнофункциональное приложение для чата, построенное с использованием Next.js, NestJS и технологии WebSocket. Приложение позволяет пользователям регистрироваться, входить в систему и общаться с другими пользователями в реальном времени.

## Возможности

- Аутентификация пользователей (Регистрация/Вход)
- Обмен сообщениями в реальном времени через WebSocket
- Список пользователей с отображением онлайн-статуса
- Адаптивный дизайн для мобильных устройств и компьютеров
- История сообщений
- Безопасная JWT аутентификация
- Современный интерфейс с использованием Tailwind CSS

## Структура проекта

Проект разделен на две основные части:

- `frontend/` - Приложение Next.js с TypeScript
- `backend/` - Приложение NestJS с TypeScript

## Требования

- Node.js (версия 14 или выше)
- SQL Server
- npm или yarn

## Настройка окружения

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=1700
DB_USERNAME=sa
DB_PASSWORD=your_password
DB_DATABASE=chat_db
JWT_SECRET=your_jwt_secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd chat-app-project
```

2. Установите зависимости для backend:
```bash
cd backend
npm install
```

3. Установите зависимости для frontend:
```bash
cd frontend
npm install
```

## Запуск приложения

1. Запустите backend сервер:
```bash
cd backend
npm run start:dev
```

2. Запустите frontend сервер разработки:
```bash
cd frontend
npm run dev
```

Приложение будет доступно по следующим адресам:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger документация: http://localhost:3001/api

## Используемые технологии

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Socket.io-client
- Zustand (Управление состоянием)
- Axios
- React Hot Toast

### Backend
- NestJS
- TypeScript
- TypeORM
- SQL Server
- Socket.io
- JWT аутентификация
- Swagger/OpenAPI

## API документация

Документация API доступна через Swagger UI по адресу `http://localhost:3001/api` при запущенном backend сервере.

### Основные эндпоинты

- Аутентификация:
  - POST `/api/auth/register` - Регистрация нового пользователя
  - POST `/api/auth/login` - Вход пользователя

- Пользователи:
  - GET `/api/users` - Получение списка всех пользователей
  - GET `/api/users/me` - Получение информации о текущем пользователе

- Чат:
  - GET `/api/chat/messages` - Получение сообщений чата
  - POST `/api/chat/messages` - Отправка нового сообщения

## WebSocket события

- `connection` - Подключение клиента к WebSocket серверу
- `disconnect` - Отключение клиента от WebSocket сервера
- `sendMessage` - Отправка нового сообщения
- `newMessage` - Получение нового сообщения

## Безопасность

- JWT-based аутентификация
- Хеширование паролей с использованием bcrypt
- Защищенные WebSocket соединения
- Настройка CORS
- Валидация входных данных с использованием class-validator

## Как внести свой вклад

1. Сделайте форк репозитория
2. Создайте ветку для новой функциональности (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Добавлена новая функциональность'`)
4. Отправьте изменения в репозиторий (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

## Лицензия

Этот проект распространяется под лицензией MIT. 