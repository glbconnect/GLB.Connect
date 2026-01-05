import express from "express";

import { registerUser, loginUser, getUser, getUsers, getCurrentUser, updateProfile, changePassword, uploadAvatar, uploadAvatarMiddleware } from "../controllers/userController.js";
import { sendFollowRequest, getConnectionStatus, listPendingRequests, respondToFollowRequest } from "../controllers/userController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "QNA Threads API is running",
        timestamp: (new Date).toISOString()
    });
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", verifyToken, getCurrentUser);

router.put("/profile", verifyToken, updateProfile);

router.put("/change-password", verifyToken, changePassword);

router.put("/avatar", verifyToken, uploadAvatarMiddleware, uploadAvatar);

router.get("/", getUsers);

router.get("/:id", getUser);

// Follow/connection requests
router.post("/:id/follow-request", verifyToken, sendFollowRequest);
router.get("/connection-status/:otherUserId", verifyToken, getConnectionStatus);
router.get("/connection-requests", verifyToken, listPendingRequests);
router.post("/connection-requests/:requestId/respond", verifyToken, respondToFollowRequest);

export default router;
