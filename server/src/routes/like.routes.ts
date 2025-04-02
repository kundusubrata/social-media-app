import express from "express";
import {
  getLikeStatus,
  toggleDislikePost,
  toggleLikePost,
} from "../controllers/like.controller";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.route("/posts/:id/toggle-like").post(isAuthenticated, toggleLikePost);
router
  .route("/posts/:id/toggle-dislike")
  .post(isAuthenticated, toggleDislikePost);
router.route("/posts/:id/like-status").get(isAuthenticated, getLikeStatus);

export default router;
