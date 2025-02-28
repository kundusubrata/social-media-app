import express from "express";
import {
  deleteUserAccount,
  getAllUsers,
  getUserFollowers,
  getUserFollowing,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.route("/users").get(getAllUsers);
router.route("/users/:id").get(getUserProfile);
router.route("/users/:id").put(isAuthenticated, updateUserProfile);
router.route("/users/:id").delete(isAuthenticated, deleteUserAccount);
router.route("/users/:id/followers").get(getUserFollowers);
router.route("/users/:id/following").get(getUserFollowing);

export default router;
