import express from "express";
import {
  addComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controllers";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.route("/posts/:id/comments").post(isAuthenticated, addComment);
router.route("/posts/:id/comments").get(getComments);
router.route("/comments/:id").delete(isAuthenticated, deleteComment);

export default router;
