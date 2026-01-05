import express from "express";

import { createAnonymousMessage, getAnonymousMessages } from "../models/AnonymousMessage.js";
import { createAnonymousMessageReport, countReportsForMessage } from "../models/AnonymousMessageReport.js";
import { PrismaClient } from "@prisma/client";

import { authenticateToken } from "../middleware/auth.js";

import { getIO } from "../sockets/chatSocket.js";

const router = express.Router();
const prisma = new PrismaClient();

const RATE_LIMIT_MS = 3000;
const MAX_MESSAGE_LENGTH = 300;
const REPORT_FLAG_THRESHOLD = 3;

const lastMessageAtByUser = new Map();

const PROFANE_WORDS = [
    "fuck","shit","bitch","asshole","bastard","dick","cunt","slut","whore",
    "fag","faggot","nigger","chink","spic","kike",
    "rape","rapist","cum","suck my","kill yourself","kys"
];

const hasAbusiveContent = (text) => {
    if (!text) return false;
    const normalized = text.toLowerCase();
    return PROFANE_WORDS.some(w => normalized.includes(w));
};

router.get("/", authenticateToken, async (req, res) => {
    try {
        const messages = await getAnonymousMessages();
        let reportCounts = [];
        try {
            reportCounts = await prisma.anonymousMessageReport.groupBy({
                by: ['messageId'],
                _count: { messageId: true }
            });
        } catch (err) {
            reportCounts = [];
        }
        const countMap = new Map(reportCounts.map(rc => [rc.messageId, rc._count.messageId]));
        const enriched = messages.map(m => ({
            ...m,
            flagged: (countMap.get(m.id) || 0) >= REPORT_FLAG_THRESHOLD
        }));
        res.json(enriched);
    } catch (error) {
        console.error("Error getting anonymous messages:", error);
        res.status(500).json({
            message: "Error getting anonymous messages"
        });
    }
});

router.post("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { content, guestId, timestamp } = req.body || {};

        if (!content || !guestId || !timestamp) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (content.length > MAX_MESSAGE_LENGTH) {
            return res.status(400).json({ message: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` });
        }

        const now = Date.now();
        const last = lastMessageAtByUser.get(userId) || 0;
        if (now - last < RATE_LIMIT_MS) {
            return res.status(429).json({ message: "Please wait before sending another message" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { muted: true, banned: true }
        });
        if (user?.banned) {
            return res.status(403).json({ message: "You are banned from posting anonymously" });
        }
        if (user?.muted) {
            return res.status(403).json({ message: "You are muted and cannot post anonymously" });
        }

        if (hasAbusiveContent(content)) {
            return res.status(400).json({ message: "Inappropriate language is not allowed" });
        }

        let message;
        try {
            message = await createAnonymousMessage({
                content,
                guestId,
                timestamp,
                posterUserId: userId
            });
        } catch (err) {
            message = await createAnonymousMessage({
                content,
                guestId,
                timestamp
            });
        }
        lastMessageAtByUser.set(userId, now);
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

router.post("/:id/report", authenticateToken, async (req, res) => {
    try {
        const messageId = req.params.id;
        const reporterUserId = req.user.id;
        const { reason, reportedGuestId } = req.body || {};

        if (!reason || !reportedGuestId) {
            return res.status(400).json({ message: "Reason and reportedGuestId are required" });
        }

        const message = await prisma.anonymousMessage.findUnique({
            where: { id: messageId },
            select: { id: true }
        });
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        const report = await createAnonymousMessageReport({
            messageId,
            reportedGuestId,
            reporterUserId,
            reason
        });

        const total = await countReportsForMessage(messageId);
        const flagged = total >= REPORT_FLAG_THRESHOLD;

        res.status(201).json({ report, flagged });
    } catch (error) {
        console.error("Error reporting anonymous message:", error);
        res.status(500).json({ message: "Error reporting anonymous message" });
    }
});

export default router;
