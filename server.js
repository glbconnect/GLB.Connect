import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { createServer } from 'http';
import messageRouter from './src/routes/messageRoutes.js';
import userRouter from './src/routes/userRoutes.js';
import batchRouter from './src/routes/batchroute.js';
import { initializeSocket } from './src/sockets/chatSocket.js';
import anonymousMessageRouter from './src/routes/anonymousMessageRoutes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

//Attach app to httpServer for socket.io
httpServer.app = app;

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/messages', messageRouter);
app.use('/api/users', userRouter);
app.use('/api/batch', batchRouter);
app.use('/api/anonymous-messages', anonymousMessageRouter);

const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});






