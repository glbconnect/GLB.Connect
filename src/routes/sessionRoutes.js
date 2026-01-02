import express from "express";
import {
    getSessions,
    getSession,
    createNewSession,
    updateSessionDetails,
    removeSession,
    startLiveSession,
    endLiveSession,
    getUpcoming,
    getLive
} from "../controllers/sessionController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes - all authenticated users can view
router.get("/", getSessions);
router.get("/upcoming", getUpcoming);
router.get("/live", getLive);
router.get("/:id", getSession);

// Admin only routes
router.post("/", requireAdmin, createNewSession);
router.put("/:id", requireAdmin, updateSessionDetails);
router.delete("/:id", requireAdmin, removeSession);
router.post("/:id/start", requireAdmin, startLiveSession);
router.post("/:id/end", requireAdmin, endLiveSession);

export default router;

