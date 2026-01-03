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
    
    // Get socket URL from environment or construct from API URL
    let socketUrl = import.meta.env.VITE_SOCKET_URL;
    if (!socketUrl) {
        // Fallback: construct from API URL
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        socketUrl = apiUrl.replace('/api', '');
    }
    
    console.log("Connecting to socket at:", socketUrl);
    
    socket = io(socketUrl, {
        withCredentials: false,
        auth: {
            token: token
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1e3,
        timeout: 10000, // 10 second timeout
        forceNew: true
    });
    
    socket.on("connect", () => {
        console.log("Socket connected successfully");
        socket.emit("join", userId);
    });
    
    socket.on("connect_error", error => {
        console.error("Socket connection error:", error);
        // Don't show error to user if it's just a connection issue
        if (error.message.includes('CORS') || error.message.includes('timeout')) {
            console.warn("Socket connection failed due to CORS or timeout - this is expected in some environments");
        }
    });
    
    socket.on("error", error => {
        console.error("Socket error:", error);
        if (error.message === "Authentication required" || error.message === "Invalid token") {
            socket.close();
        }
    });
    
    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
    });
    
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

export const sendMessage = data => {
    if (socket && socket.connected) {
        socket.emit("send_message", data);
    } else {
        console.warn("Socket not connected, cannot send message");
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
    if (socket && socket.connected) {
        socket.off("receive_message");
        socket.on("receive_message", message => {
            if (message.id && !isMessageCached(message.id)) {
                addToMessageCache(message.id);
                callback(message);
            }
        });
    } else {
        console.warn("Socket not connected, cannot listen for messages");
    }
};

export const listenForTyping = callback => {
    if (socket && socket.connected) {
        socket.off("user_typing");
        socket.on("user_typing", data => {
            callback(data);
        });
    }
};

export const emitTyping = data => {
    if (socket && socket.connected) {
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
    if (!socket || !socket.connected) {
        console.warn("Socket not connected, cannot subscribe to event updates");
        return;
    }
    socket.on("event:new", callbacks.onNewEvent);
    socket.on("event:update", callbacks.onUpdateEvent);
    socket.on("event:delete", callbacks.onDeleteEvent);
    socket.on("event:register", callbacks.onRegister);
    socket.on("event:unregister", callbacks.onUnregister);
}

export function emitEventRegister(data) {
    if (socket && socket.connected) socket.emit("event:register", data);
}

export function emitEventUnregister(data) {
    if (socket && socket.connected) socket.emit("event:unregister", data);
}

export function emitEventNew(event) {
    if (socket && socket.connected) socket.emit("event:new", event);
}

export function emitEventUpdate(event) {
    if (socket && socket.connected) socket.emit("event:update", event);
}

export function emitEventDelete(event) {
    if (socket && socket.connected) socket.emit("event:delete", event);
}

export function subscribeToSessionUpdates(callbacks) {
    if (!socket || !socket.connected) {
        console.warn("Socket not connected, initializing...");
        const authData = localStorage.getItem("auth");
        if (authData) {
            try {
                const { user } = JSON.parse(authData);
                if (user && user.id) {
                    initializeSocket(user.id);
                    // Wait a bit for connection, then subscribe
                    setTimeout(() => {
                        if (socket && socket.connected) {
                            socket.on("session:new", callbacks.onNewSession);
                            socket.on("session:update", callbacks.onUpdateSession);
                            socket.on("session:delete", callbacks.onDeleteSession);
                            socket.on("session:start", callbacks.onStartSession);
                            socket.on("session:end", callbacks.onEndSession);
                        }
                    }, 500);
                    return () => {
                        if (socket) {
                            socket.off("session:new");
                            socket.off("session:update");
                            socket.off("session:delete");
                            socket.off("session:start");
                            socket.off("session:end");
                        }
                    };
                }
            } catch (error) {
                console.error("Error initializing socket for sessions:", error);
            }
        }
        return () => {}; // Return empty cleanup function
    }
    
    socket.on("session:new", callbacks.onNewSession);
    socket.on("session:update", callbacks.onUpdateSession);
    socket.on("session:delete", callbacks.onDeleteSession);
    socket.on("session:start", callbacks.onStartSession);
    socket.on("session:end", callbacks.onEndSession);
    
    // Return cleanup function
    return () => {
        if (socket) {
            socket.off("session:new");
            socket.off("session:update");
            socket.off("session:delete");
            socket.off("session:start");
            socket.off("session:end");
        }
    };
}

export function joinSession(sessionId) {
    if (socket && socket.connected) {
        socket.emit("session:join", sessionId);
    }
}

export function leaveSession(sessionId) {
    if (socket && socket.connected) {
        socket.emit("session:leave", sessionId);
    }
}

export default {
    initializeSocket: initializeSocket,
    disconnectSocket: disconnectSocket,
    sendMessage: sendMessage,
    listenForMessages: listenForMessages,
    listenForNotifications: listenForNotifications,
    listenForTyping: listenForTyping,
    emitTyping: emitTyping,
    removeAllListeners: removeAllListeners,
    clearMessageCache: clearMessageCache,
    getSocket: getSocket
};