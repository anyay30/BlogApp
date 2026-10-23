import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
} from "../controllers/blogController.js";

const router = express.Router();

router.get("/", getBlogs);

router.get("/:id", getBlogById);

router.post("/", authMiddleware, createBlog);

router.put("/:id", authMiddleware, updateBlog);

router.delete("/:id", authMiddleware, deleteBlog);

// router.post("/", createBlog);

// router.put("/:id", updateBlog);

// router.delete("/:id", deleteBlog);

export default router;