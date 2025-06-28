import express from "express";

import { registerUser, loginUser, getUser, getUsers, getCurrentUser, updateProfile, changePassword, uploadAvatar, uploadAvatarMiddleware } from "../controllers/userController.js";

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

export default router;