import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import messageRouter from './src/routes/messageRoutes.js';
import userRouter from './src/routes/userRoutes.js';
import batchRouter from './src/routes/batchroute.js';
import { initializeSocket } from './src/sockets/chatSocket.js';
import anonymousMessageRouter from './src/routes/anonymousMessageRoutes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Attach app to httpServer for socket.io
httpServer.app = app;

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// API Routes - MUST come before static file serving
app.use('/api/messages', messageRouter);
app.use('/api/users', userRouter);
app.use('/api/batch', batchRouter);
app.use('/api/anonymous-messages', anonymousMessageRouter);

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  
  // Catch-all route for React app - MUST be last
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});






