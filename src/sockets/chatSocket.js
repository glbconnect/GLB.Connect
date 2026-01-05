import { Server } from "socket.io";

import { createMessage } from "../models/messageModel.js";

import { verifyToken } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

let ioInstance;

export const initializeSocket = httpServer => {
    const io = new Server(httpServer, {
        cors: {
            origin: [
                process.env.CLIENT_URL || "http://localhost:5173",
                "https://glb-connect-frontend.onrender.com",
                "https://glb-connect.vercel.app"
            ],
            methods: [ "GET", "POST", "OPTIONS" ],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        },
        transports: ['polling', 'websocket']
    });
    ioInstance = io;
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (token) {
                try {
                    const decoded = await verifyToken(token);
                    socket.userId = decoded.userId;
                    socket.authenticated = true;
                } catch (err) {
                    console.warn("Invalid token in socket connection:", err.message);
                    socket.authenticated = false;
                }
            } else {
                console.log("No token provided for socket connection");
                socket.authenticated = false;
            }
            next();
        } catch (error) {
            console.error("Socket authentication error:", error);
            next();
        }
    });
    io.on("connection", socket => {
        console.log("User connected:", socket.id, socket.authenticated ? "(authenticated)" : "(not authenticated)");
        socket.join("anonymous-chat");
        console.log(`User ${socket.id} joined anonymous-chat room`);
        socket.on("join-room", room => {
            socket.join(room);
            console.log(`User ${socket.id} joined room: ${room}`);
        });
        socket.on("private-message", data => {
            if (!socket.authenticated) {
                socket.emit("error", {
                    message: "Authentication required for private messages"
                });
                return;
            }
            const room = [ data.senderId, data.receiverId ].sort().join("-");
            io.to(room).emit("private-message", data);
        });
        socket.on("anonymous-message", message => {
            io.to("anonymous-chat").emit("anonymous-message", message);
        });
        socket.on("join", userId => {
            socket.join(userId);
            console.log(`User ${userId} joined with socket ${socket.id}`);
            io.to(userId).emit("user_joined");
        });
        socket.on("send_message", async data => {
            if (!socket.authenticated) {
                socket.emit("error", {
                    message: "Authentication required for sending messages"
                });
                return;
            }
            try {
                const {senderId: senderId, receiverId: receiverId, content: content, isAnonymous: isAnonymous} = data;
                const accepted = await prisma.connectionRequest.findFirst({
                    where: {
                        status: "accepted",
                        OR: [
                            { senderId: senderId, receiverId: receiverId },
                            { senderId: receiverId, receiverId: senderId }
                        ]
                    }
                });
                if (!accepted) {
                    socket.emit("message_error", { error: "Messaging disabled until follow request is accepted" });
                    return;
                }
                const message = await createMessage(senderId, receiverId, content, isAnonymous);
                io.to(receiverId).emit("receive_message", message);
                socket.emit("message_sent", message);
            } catch (error) {
                console.error("Error handling message:", error);
                socket.emit("message_error", {
                    error: "Failed to send message"
                });
            }
        });
        socket.on("typing", ({senderId: senderId, receiverId: receiverId}) => {
            io.to(receiverId).emit("user_typing", {
                senderId: senderId
            });
        });
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            socket.leave("anonymous-chat");
        });
        socket.on("event:register", data => {
            io.emit("event:register", data);
        });
        socket.on("event:unregister", data => {
            io.emit("event:unregister", data);
        });
        socket.on("event:new", event => {
            io.emit("event:new", event);
        });
        socket.on("event:update", event => {
            io.emit("event:update", event);
        });
        socket.on("event:delete", event => {
            io.emit("event:delete", event);
        });
        // Session-related socket events
        socket.on("session:join", sessionId => {
            socket.join(`session:${sessionId}`);
            console.log(`User ${socket.id} joined session ${sessionId}`);
            io.to(`session:${sessionId}`).emit("session:user_joined", {
                userId: socket.userId,
                socketId: socket.id
            });
        });
        socket.on("session:leave", sessionId => {
            socket.leave(`session:${sessionId}`);
            console.log(`User ${socket.id} left session ${sessionId}`);
            io.to(`session:${sessionId}`).emit("session:user_left", {
                userId: socket.userId,
                socketId: socket.id
            });
        });
    });
    return io;
};

export const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.io not initialized");
    }
    return ioInstance;
};

export default {
    initializeSocket: initializeSocket,
    getIO: getIO
};
