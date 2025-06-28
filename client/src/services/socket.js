import { io } from "socket.io-client";

let socket;

const messageCache = new Set;

const MAX_CACHE_SIZE = 100;

export const initializeSocket = userId => {
    if (socket?.connected) {
        return socket;
    }
    if (socket) {
        socket.close();
    }
    const authData = localStorage.getItem("auth");
    let token = null;
    if (authData) {
        try {
            const parsedAuth = JSON.parse(authData);
            token = parsedAuth.token;
        } catch (error) {
            console.error("Error parsing auth data:", error);
            localStorage.removeItem("auth");
            return null;
        }
    }
    if (!token) {
        console.warn("No authentication token available for socket connection");
        return null;
    }
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    socket = io(socketUrl, {
        withCredentials: false,
        auth: {
            token: token
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1e3
    });
    socket.on("connect", () => {
        console.log("Socket connected successfully");
        socket.emit("join", userId);
    });
    socket.on("connect_error", error => {
        console.error("Socket connection error:", error);
    });
    socket.on("error", error => {
        console.error("Socket error:", error);
        if (error.message === "Authentication required" || error.message === "Invalid token") {
            socket.close();
        }
    });
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

export const sendMessage = data => {
    if (socket) {
        socket.emit("send_message", data);
    }
};

const addToMessageCache = messageId => {
    messageCache.add(messageId);
    if (messageCache.size > MAX_CACHE_SIZE) {
        const iterator = messageCache.values();
        messageCache.delete(iterator.next().value);
    }
};

const isMessageCached = messageId => messageCache.has(messageId);

export const listenForMessages = callback => {
    if (socket) {
        socket.off("receive_message");
        socket.on("receive_message", message => {
            if (message.id && !isMessageCached(message.id)) {
                addToMessageCache(message.id);
                callback(message);
            }
        });
    }
};

export const listenForTyping = callback => {
    if (socket) {
        socket.off("user_typing");
        socket.on("user_typing", data => {
            callback(data);
        });
    }
};

export const emitTyping = data => {
    if (socket) {
        socket.emit("typing", data);
    }
};

export const removeAllListeners = () => {
    if (socket) {
        socket.off();
    }
};

export const clearMessageCache = () => {
    messageCache.clear();
};

export const getSocket = () => socket;

export function subscribeToEventUpdates(callbacks) {
    if (!socket) return;
    socket.on("event:new", callbacks.onNewEvent);
    socket.on("event:update", callbacks.onUpdateEvent);
    socket.on("event:delete", callbacks.onDeleteEvent);
    socket.on("event:register", callbacks.onRegister);
    socket.on("event:unregister", callbacks.onUnregister);
}

export function emitEventRegister(data) {
    if (socket) socket.emit("event:register", data);
}

export function emitEventUnregister(data) {
    if (socket) socket.emit("event:unregister", data);
}

export function emitEventNew(event) {
    if (socket) socket.emit("event:new", event);
}

export function emitEventUpdate(event) {
    if (socket) socket.emit("event:update", event);
}

export function emitEventDelete(event) {
    if (socket) socket.emit("event:delete", event);
}

export default {
    initializeSocket: initializeSocket,
    disconnectSocket: disconnectSocket,
    sendMessage: sendMessage,
    listenForMessages: listenForMessages,
    listenForTyping: listenForTyping,
    emitTyping: emitTyping,
    removeAllListeners: removeAllListeners,
    clearMessageCache: clearMessageCache,
    getSocket: getSocket
};