import express from "express";

import {
  getComments,
  createComment,
  toggleCommentApproval,
  deleteComment
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", getComments);

router.post("/", createComment);

router.put("/:id", toggleCommentApproval);

router.delete("/:id", deleteComment);

export default router;