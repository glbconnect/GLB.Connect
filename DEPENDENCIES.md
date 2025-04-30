# Dependencies for GLB.Connect

This document lists all the dependencies required to run the GLB.Connect application, including both frontend and backend dependencies.

## Backend Dependencies

### Production Dependencies

| Package Name | Version | Purpose |
|-------------|---------|---------|
| @prisma/client | ^6.6.0 | ORM for database operations |
| bcrypt | ^5.1.1 | Password hashing and security |
| cors | ^2.8.5 | Enable Cross-Origin Resource Sharing |
| dotenv | ^16.5.0 | Environment variable management |
| express | ^4.21.2 | Web application framework |
| jsonwebtoken | ^9.0.2 | JWT authentication |
| prisma | ^6.5.0 | Database schema and migration tool |
| socket.io | ^4.8.1 | Real-time bidirectional communication |

### Development Dependencies

| Package Name | Version | Purpose |
|-------------|---------|---------|
| nodemon | ^3.1.9 | Auto-restart server during development |

## Frontend Dependencies

### Production Dependencies

| Package Name | Version | Purpose |
|-------------|---------|---------|
| react | ^18.2.0 | UI library |
| react-dom | ^18.2.0 | React rendering for web |
| react-router-dom | ^6.22.3 | Routing and navigation |
| socket.io-client | ^4.7.4 | Client-side socket connection |
| @heroicons/react | ^2.1.1 | Icon components |
| axios | ^1.6.7 | HTTP client |
| tailwindcss | ^3.4.1 | CSS framework |
| postcss | ^8.4.35 | CSS processing |
| autoprefixer | ^10.4.17 | CSS vendor prefixing |

### Development Dependencies

| Package Name | Version | Purpose |
|-------------|---------|---------|
| @types/react | ^18.2.56 | React type definitions |
| @types/react-dom | ^18.2.19 | React DOM type definitions |
| @vitejs/plugin-react | ^4.2.1 | Vite plugin for React |
| eslint | ^8.56.0 | Code linting |
| eslint-plugin-react | ^7.33.2 | React specific linting |
| eslint-plugin-react-hooks | ^4.6.0 | React hooks linting |
| eslint-plugin-react-refresh | ^0.4.5 | React refresh support |
| vite | ^5.1.4 | Development server and bundler |

## Database

- PostgreSQL (Version 14 or higher recommended)

## Environment Setup

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
PORT=5000
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:5000"
VITE_SOCKET_URL="http://localhost:5000"
```

## Installation Commands

### Backend
```bash
cd QNA\ Threads
npm install
npx prisma generate
npx prisma migrate dev
```

### Frontend
```bash
cd QNA\ Threads/client
npm install
```

## Version Requirements

- Node.js: v14.0.0 or higher
- npm: v6.0.0 or higher
- PostgreSQL: v14.0 or higher

## Notes

1. All versions listed use semantic versioning (^) to allow compatible updates
2. Make sure to install all dependencies using `npm install` in both frontend and backend directories
3. Development dependencies are only needed for development/building and not for production
4. Some dependencies might require additional system-level installations (like PostgreSQL) 