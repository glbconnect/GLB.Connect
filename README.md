# GLB.Connect

GLB.Connect is a real-time platform designed to bridge the gap between junior and senior college students, facilitating knowledge sharing and mentorship within the academic community.

## 🌟 Features

### 1. Real-time Messaging
- Direct messaging between students
- Instant notifications
- Message history and chat persistence
- Rich text support

### 2. Anonymous Chat
- Post questions anonymously
- Get honest feedback and advice
- Safe space for sensitive queries
- Moderated environment

### 3. User Profiles
- Customizable student profiles
- Academic background display
- Areas of expertise
- Contact information

### 4. Authentication & Security
- Secure JWT-based authentication
- Protected routes
- Password encryption
- Session management

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Socket.io-client
- React Router DOM

### Backend
- Node.js
- Express.js
- Socket.io
- Prisma ORM
- JSON Web Tokens

### Database
- PostgreSQL

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/Kshitij2145/GLB.CONNECT.git
cd GLB.CONNECT
```

2. Install backend dependencies
```bash
cd QNA\ Threads
npm install
```

3. Install frontend dependencies
```bash
cd client
npm install
```

4. Set up environment variables
Create a `.env` file in the root directory with:
```env
DATABASE_URL="your-postgresql-url"
JWT_SECRET="your-jwt-secret"
```

5. Run database migrations
```bash
npx prisma migrate dev
```

6. Start the development servers

Backend:
```bash
npm run server
```

Frontend:
```bash
cd client
npm run dev
```

## 🏫 Supported Institutions
- GL Bajaj
- Galgotia
- NIET
- Jamia
- Bennett

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the ISC License.

## 👥 Authors
- Kshitij Dwivedi - Initial work - [Kshitij2145](https://github.com/Kshitij2145)

## 🙏 Acknowledgments
- Special thanks to all contributors and testers
- Inspired by the need for better academic mentorship
- Built with ❤️ for the student community 