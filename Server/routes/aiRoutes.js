import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateBlogContent } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateBlogContent);

export default router;
