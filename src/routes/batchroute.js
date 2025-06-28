import express from "express";

import { getAllUsers, getUsersByBatch, getUserById } from "../controllers/batchusercontroller.js";

const router = express.Router();

router.get("/users", getAllUsers);

router.get("/users/batch/:batch", getUsersByBatch);

router.get("/users/:id", getUserById);

export default router;