// import { Server } from 'socket.io';
// import { createMessage } from '../models/messageModel.js';

// const connectedUsers = new Map();

// export const initializeSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: process.env.CLIENT_URL || 'http://localhost:3000',
//       methods: ['GET', 'POST'],
//     },
//   });

//   io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     // Handle user joining
//     socket.on('join', (userId) => {
//       connectedUsers.set(userId, socket.id);
//       console.log(`User ${userId} joined with socket ${socket.id}`);
//     });

//     // Handle new message
//     socket.on('send_message', async (data) => {
//       try {
//         const { senderId, receiverId, content, isAnonymous } = data;
//         const message = await createMessage(senderId, receiverId, content, isAnonymous);

//         // Send to receiver if online
//         const receiverSocketId = connectedUsers.get(receiverId);
//         if (receiverSocketId) {
//           io.to(receiverSocketId).emit('receive_message', message);
//         }

//         // Send confirmation back to sender
//         socket.emit('message_sent', message);
//       } catch (error) {
//         console.error('Error handling message:', error);
//         socket.emit('message_error', { error: 'Failed to send message' });
//       }
//     });

//     // Handle typing status
//     socket.on('typing', ({ senderId, receiverId }) => {
//       const receiverSocketId = connectedUsers.get(receiverId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit('user_typing', { senderId });
//       }
//     });

//     // Handle user disconnection
//     socket.on('disconnect', () => {
//       // Remove user from connected users
//       for (const [userId, socketId] of connectedUsers.entries()) {
//         if (socketId === socket.id) {
//           connectedUsers.delete(userId);
//           console.log(`User ${userId} disconnected`);
//           break;
//         }
//       }
//     });
//   });

//   return io;
// }; 
import { Server } from 'socket.io';
import { createMessage } from '../models/messageModel.js';
import { verifyToken } from '../middleware/auth.js';

let ioInstance;

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173', // Use the correct client port
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Store io instance globally
  ioInstance = io;

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (token) {
        try {
          const decoded = await verifyToken(token);
          socket.userId = decoded.userId;
          socket.authenticated = true;
        } catch (err) {
          console.warn('Invalid token in socket connection:', err.message);
          socket.authenticated = false;
        }
      } else {
        console.log('No token provided for socket connection');
        socket.authenticated = false;
      }
      // Allow connection but mark as authenticated or not
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next();
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id, socket.authenticated ? '(authenticated)' : '(not authenticated)');
    
    // By default, join the anonymous chat room
    socket.join('anonymous-chat');
    console.log(`User ${socket.id} joined anonymous-chat room`);

    // Handle joining specific rooms
    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    });

    // Handle private messages - requires authentication
    socket.on('private-message', (data) => {
      if (!socket.authenticated) {
        socket.emit('error', { message: 'Authentication required for private messages' });
        return;
      }
      
      const room = [data.senderId, data.receiverId].sort().join('-');
      io.to(room).emit('private-message', data);
    });

    // Handle anonymous messages
    socket.on('anonymous-message', (message) => {
      io.to('anonymous-chat').emit('anonymous-message', message);
    });

    // Handle user joining
    socket.on('join', (userId) => {
      socket.join(userId);  // Join a room with the user's ID
      console.log(`User ${userId} joined with socket ${socket.id}`);
      io.to(userId).emit('user_joined');
    });

    // Handle new message - requires authentication
    socket.on('send_message', async (data) => {
      if (!socket.authenticated) {
        socket.emit('error', { message: 'Authentication required for sending messages' });
        return;
      }
      
      try {
        const { senderId, receiverId, content, isAnonymous } = data;
        const message = await createMessage(senderId, receiverId, content, isAnonymous);

        // Send to receiver if online
        io.to(receiverId).emit('receive_message', message);

        // Send confirmation back to sender
        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Handle typing status
    socket.on('typing', ({ senderId, receiverId }) => {
      io.to(receiverId).emit('user_typing', { senderId });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      socket.leave('anonymous-chat');
    });

    // Event listeners for real-time events
    socket.on('event:register', (data) => {
      io.emit('event:register', data);
    });
    socket.on('event:unregister', (data) => {
      io.emit('event:unregister', data);
    });
    socket.on('event:new', (event) => {
      io.emit('event:new', event);
    });
    socket.on('event:update', (event) => {
      io.emit('event:update', event);
    });
    socket.on('event:delete', (event) => {
      io.emit('event:delete', event);
    });
  });

  return io;
};

// Helper function to get io instance
export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized');
  }
  return ioInstance;
};

export default {
  initializeSocket,
  getIO
};