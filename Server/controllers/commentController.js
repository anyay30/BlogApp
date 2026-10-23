import Comment from "../models/Comment.js";

// GET all comments
export const getComments = async (req, res) => {
  try {

    const comments = await Comment.find()
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
// GET approved comments for a particular blog
export const getBlogComments = async (req, res) => {
  try {

    const comments = await Comment.find({
      blog: req.params.blogId,
      isApproved: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// CREATE comment
export const createComment = async (req, res) => {
  try {

    const { blog, name, content } = req.body;

    const comment = await Comment.create({
      blog,
      name,
      content
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// APPROVE / UNAPPROVE comment
export const toggleCommentApproval = async (req, res) => {
  try {

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    comment.isApproved = !comment.isApproved;

    await comment.save();

    res.status(200).json({
      success: true,
      message: "Comment status updated",
      comment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// DELETE comment
export const deleteComment = async (req, res) => {
  try {

    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
