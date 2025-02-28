import express from "express";
import {
  toggleDislikePost,
  toggleLikePost,
} from "../controllers/like.controller";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.route("/posts/:id/toggle-like").post(isAuthenticated, toggleLikePost);
router
  .route("/posts/:id/toggle-dislike")
  .post(isAuthenticated, toggleDislikePost);

export default router;
