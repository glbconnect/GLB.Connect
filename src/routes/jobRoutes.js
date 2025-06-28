import express from "express";

import { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs } from "../controllers/jobController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getJobs);

router.get("/:id", getJobById);

router.get("/my-jobs", verifyToken, getMyJobs);

router.post("/", verifyToken, createJob);

router.put("/:id", verifyToken, updateJob);

router.delete("/:id", verifyToken, deleteJob);

export default router;