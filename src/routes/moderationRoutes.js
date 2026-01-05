import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/mute/:userId", requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const updated = await prisma.user.update({
            where: { id: userId },
            data: { muted: true }
        });
        res.json({ success: true, userId: updated.id, muted: updated.muted });
    } catch (error) {
        console.error("Error muting user:", error);
        res.status(500).json({ message: "Error muting user" });
    }
});

router.post("/unmute/:userId", requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const updated = await prisma.user.update({
            where: { id: userId },
            data: { muted: false }
        });
        res.json({ success: true, userId: updated.id, muted: updated.muted });
    } catch (error) {
        console.error("Error unmuting user:", error);
        res.status(500).json({ message: "Error unmuting user" });
    }
});

router.post("/ban/:userId", requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const updated = await prisma.user.update({
            where: { id: userId },
            data: { banned: true }
        });
        res.json({ success: true, userId: updated.id, banned: updated.banned });
    } catch (error) {
        console.error("Error banning user:", error);
        res.status(500).json({ message: "Error banning user" });
    }
});

router.post("/unban/:userId", requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const updated = await prisma.user.update({
            where: { id: userId },
            data: { banned: false }
        });
        res.json({ success: true, userId: updated.id, banned: updated.banned });
    } catch (error) {
        console.error("Error unbanning user:", error);
        res.status(500).json({ message: "Error unbanning user" });
    }
});

export default router;
