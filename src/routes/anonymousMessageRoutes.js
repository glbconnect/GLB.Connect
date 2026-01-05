import express from "express";

import { createAnonymousMessage, getAnonymousMessages } from "../models/AnonymousMessage.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { authenticateToken } from "../middleware/auth.js";

import { getIO } from "../sockets/chatSocket.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
    try {
        const messages = await getAnonymousMessages();
        res.json(messages);
    } catch (error) {
        console.error("Error getting anonymous messages:", error);
        res.status(500).json({
            message: "Error getting anonymous messages"
        });
    }
});

router.post("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id || null;
        // Check user moderation
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (user?.isBanned) {
                return res.status(403).json({ message: "You are banned from posting." });
            }
            if (user?.isMuted) {
                return res.status(403).json({ message: "You are muted and cannot post." });
            }
        }
        // Rate limiting: max 10 messages per minute per user
        if (userId) {
            const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
            const recentCount = await prisma.anonymousMessage.count({
                where: { userId, timestamp: { gte: oneMinuteAgo } }
            });
            if (recentCount >= 10) {
                return res.status(429).json({ message: "Rate limit exceeded. Try again later." });
            }
        }
        // Length limits
        const content = (req.body.content || "").trim();
        if (!content) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }
        if (content.length > 500) {
            return res.status(400).json({ message: "Message too long (max 500 characters)" });
        }
        // Moderation check
        const isAbusive = checkAbusive(content);
        if (isAbusive) {
            return res.status(400).json({ message: "Message contains abusive content" });
        }
        const messageData = {
            content,
            guestId: req.body.guestId,
            timestamp: new Date().toISOString()
        };
        const message = await createAnonymousMessage(messageData);
        const io = getIO();
        io.to("anonymous-chat").emit("anonymous-message", message);
        res.status(201).json(message);
    } catch (error) {
        console.error("Error creating anonymous message:", error);
        res.status(500).json({
            message: "Error creating anonymous message"
        });
    }
});

// Report message
router.post("/:id/report", authenticateToken, async (req, res) => {
    try {
        const reporterId = req.user.id;
        const { reason } = req.body;
        const { id } = req.params;
        if (!reason || reason.trim().length < 3) {
            return res.status(400).json({ message: "Provide a valid reason" });
        }
        const message = await prisma.anonymousMessage.findUnique({ where: { id } });
        if (!message) return res.status(404).json({ message: "Message not found" });
        const report = await prisma.anonymousReport.create({
            data: {
                messageId: id,
                reporterId,
                reason
            }
        });
        await prisma.anonymousMessage.update({
            where: { id },
            data: { flagged: true, moderationStatus: "APPROVED" }
        });
        res.status(201).json({ success: true, report });
    } catch (error) {
        console.error("Error reporting message:", error);
        res.status(500).json({ message: "Error reporting message" });
    }
});

// Admin: mute user
import { requireAdmin } from "../middleware/authMiddleware.js";
router.post("/admin/users/:userId/mute", requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        await prisma.user.update({ where: { id: userId }, data: { isMuted: true } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Failed to mute user" });
    }
});
// Admin: ban user
router.post("/admin/users/:userId/ban", requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        await prisma.user.update({ where: { id: userId }, data: { isBanned: true } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Failed to ban user" });
    }
});

// Simple moderation checker (open-source wordlist approach)
const WORDS = {
    profanity: ["fuck","shit","bitch","asshole","dick","cunt","bastard","slut","whore"],
    hate: ["kill yourself","kys","retard","fag","nigger","chink","spic","terrorist","dirty immigrant"],
    sexual: ["porn","sex","nude","rape","incest","blowjob","handjob","anal","cum"]
};
function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function checkAbusive(text) {
    const t = normalize(text);
    const patterns = [
        ...WORDS.profanity,
        ...WORDS.hate,
        ...WORDS.sexual
    ];
    return patterns.some(w => t.includes(w));
}

export default router;
