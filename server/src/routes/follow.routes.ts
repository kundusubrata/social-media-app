import express from "express";
import { followUser, unfollowUser } from "../controllers/follow.controller";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.route("/users/:id/follow").post(isAuthenticated, followUser);
router.route("/users/:id/unfollow").delete(isAuthenticated, unfollowUser);

export default router;
