import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getComments,
  getBlogComments,
  createComment,
  toggleCommentApproval,
  deleteComment
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", getComments);

router.get("/blog/:blogId", getBlogComments);

router.post("/", createComment);

router.put("/:id", authMiddleware, toggleCommentApproval);

router.delete("/:id", authMiddleware, deleteComment);


export default router;
