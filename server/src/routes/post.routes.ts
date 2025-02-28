import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getFeedPosts,
  getPostById,
} from "../controllers/post.controller";
import { isAuthenticated } from "../middlewares/auth";
import { upload } from "../utils/cloudinaryConfig";

const router = express.Router();

router.route("/posts").post(isAuthenticated, upload.single("file"), createPost);
router.route("/posts").get(getAllPosts);
router.route("/posts/:id").get(getPostById);
router.route("/posts/:id").delete(isAuthenticated, deletePost);
router.route("/posts/feed").get(isAuthenticated, getFeedPosts);

export default router;
