import {
    getAllSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
    startSession,
    endSession,
    getLiveSessions,
    getUpcomingSessions
} from "../models/sessionModel.js";
import { getIO } from "../sockets/chatSocket.js";

export const getSessions = async (req, res) => {
    try {
        const sessions = await getAllSessions();
        res.json({
            success: true,
            data: sessions
        });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch sessions",
            error: error.message
        });
    }
};

export const getUpcoming = async (req, res) => {
    try {
        const sessions = await getUpcomingSessions();
        res.json({
            success: true,
            data: sessions
        });
    } catch (error) {
        console.error("Error fetching upcoming sessions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch upcoming sessions",
            error: error.message
        });
    }
};

export const getLive = async (req, res) => {
    try {
        const sessions = await getLiveSessions();
        res.json({
            success: true,
            data: sessions
        });
    } catch (error) {
        console.error("Error fetching live sessions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch live sessions",
            error: error.message
        });
    }
};

export const getSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await getSessionById(id);
        
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }
        
        res.json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error("Error fetching session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch session",
            error: error.message
        });
    }
};

export const createNewSession = async (req, res) => {
    try {
        const { title, description, scheduledAt } = req.body;
        const userId = req.user.id;

        if (!title || !scheduledAt) {
            return res.status(400).json({
                success: false,
                message: "Title and scheduled date/time are required"
            });
        }

        const sessionData = {
            title,
            description: description || null,
            scheduledAt: new Date(scheduledAt),
            createdBy: userId,
            status: 'SCHEDULED'
        };

        const session = await createSession(sessionData);
        
        // Emit socket event for new session
        const io = getIO();
        if (io) {
            io.emit("session:new", session);
        }

        res.status(201).json({
            success: true,
            data: session,
            message: "Session created successfully"
        });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create session",
            error: error.message
        });
    }
};

export const updateSessionDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, scheduledAt } = req.body;
        const userId = req.user.id;

        // Check if session exists and belongs to user
        const existingSession = await getSessionById(id);
        if (!existingSession) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        if (existingSession.createdBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this session"
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);

        const session = await updateSession(id, updateData);
        
        // Emit socket event for session update
        const io = getIO();
        if (io) {
            io.emit("session:update", session);
        }

        res.json({
            success: true,
            data: session,
            message: "Session updated successfully"
        });
    } catch (error) {
        console.error("Error updating session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update session",
            error: error.message
        });
    }
};

export const startLiveSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { joinUrl } = req.body;
        const userId = req.user.id;

        // Check if session exists and belongs to user
        const existingSession = await getSessionById(id);
        if (!existingSession) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        if (existingSession.createdBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to start this session"
            });
        }

        if (existingSession.status === 'LIVE') {
            return res.status(400).json({
                success: false,
                message: "Session is already live"
            });
        }

        if (existingSession.status === 'ENDED') {
            return res.status(400).json({
                success: false,
                message: "Cannot start an ended session"
            });
        }

        const session = await startSession(id, joinUrl);
        
        // Emit socket event for session start
        const io = getIO();
        if (io) {
            io.emit("session:start", session);
            io.emit("session:update", session);
        }

        res.json({
            success: true,
            data: session,
            message: "Session started successfully"
        });
    } catch (error) {
        console.error("Error starting session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to start session",
            error: error.message
        });
    }
};

export const endLiveSession = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if session exists and belongs to user
        const existingSession = await getSessionById(id);
        if (!existingSession) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        if (existingSession.createdBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to end this session"
            });
        }

        const session = await endSession(id);
        
        // Emit socket event for session end
        const io = getIO();
        if (io) {
            io.emit("session:end", session);
            io.emit("session:update", session);
        }

        res.json({
            success: true,
            data: session,
            message: "Session ended successfully"
        });
    } catch (error) {
        console.error("Error ending session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to end session",
            error: error.message
        });
    }
};

export const removeSession = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if session exists and belongs to user
        const existingSession = await getSessionById(id);
        if (!existingSession) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        if (existingSession.createdBy !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this session"
            });
        }

        await deleteSession(id);
        
        // Emit socket event for session deletion
        const io = getIO();
        if (io) {
            io.emit("session:delete", { id });
        }

        res.json({
            success: true,
            message: "Session deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete session",
            error: error.message
        });
    }
};

