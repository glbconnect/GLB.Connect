import express from "express";

import { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs } from "../controllers/jobController.js";

import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getJobs);

router.get("/:id", getJobById);

router.get("/my-jobs", verifyToken, getMyJobs);

router.post("/", requireAdmin, createJob);

router.put("/:id", requireAdmin, updateJob);

router.delete("/:id", requireAdmin, deleteJob);

export default router;