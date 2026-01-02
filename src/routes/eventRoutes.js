import express from "express";

import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, registerUser, unregisterUser, getRegistrations } from "../controllers/eventController.js";

import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllEvents);

router.get("/:id", getEventById);

router.post("/", requireAdmin, createEvent);

router.put("/:id", requireAdmin, updateEvent);

router.delete("/:id", requireAdmin, deleteEvent);

router.post("/:id/register", authenticateToken, registerUser);

router.post("/:id/unregister", authenticateToken, unregisterUser);

router.get("/:id/registrations", getRegistrations);

export default router;