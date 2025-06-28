import express from "express";

import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, registerUser, unregisterUser, getRegistrations } from "../controllers/eventController.js";

import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllEvents);

router.get("/:id", getEventById);

router.post("/", authenticateToken, createEvent);

router.put("/:id", authenticateToken, updateEvent);

router.delete("/:id", authenticateToken, deleteEvent);

router.post("/:id/register", authenticateToken, registerUser);

router.post("/:id/unregister", authenticateToken, unregisterUser);

router.get("/:id/registrations", getRegistrations);

export default router;