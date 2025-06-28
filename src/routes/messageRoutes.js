import express from "express";

import { sendMessage, getChatHistory, markAsSeen, getUnseen, getAllConversations } from "../controllers/messageController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/send", sendMessage);

router.get("/history/:user1Id/:user2Id", getChatHistory);

router.put("/seen/:messageId", markAsSeen);

router.get("/unseen/:userId", getUnseen);

router.get("/conversations", getAllConversations);

export default router;