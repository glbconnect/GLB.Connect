import express from "express";
import {
  getPosts,
  createPost,
  toggleLike,
  addComment,
  getComments,
  sharePost,
  getUserStats,
  getSuggestedStudents,
  getTopContributors,
  getTrendingPosts,
  getStories,
  createStory,
  toggleFollow,
  uploadPostImageMiddleware,
  uploadStoryImageMiddleware
} from "../controllers/buzzController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Posts
router.get("/posts", getPosts);
router.post("/posts", uploadPostImageMiddleware, createPost);
router.post("/posts/:postId/like", toggleLike);
router.post("/posts/:postId/comment", addComment);
router.get("/posts/:postId/comments", getComments);
router.post("/posts/:postId/share", sharePost);

// User stats
router.get("/stats", getUserStats);

// Suggestions
router.get("/suggestions", getSuggestedStudents);
router.get("/top-contributors", getTopContributors);
router.get("/trending", getTrendingPosts);

// Stories
router.get("/stories", getStories);
router.post("/stories", uploadStoryImageMiddleware, createStory);

// Follow/Unfollow
router.post("/users/:followingId/follow", toggleFollow);

export default router;

