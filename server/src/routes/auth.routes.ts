import express from "express";
import {
  getMe,
  login,
  logout,
  register,
} from "../controllers/auth.controllers";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.route("/auth/register").post(register);
router.route("/auth/login").post(login);
router.route("/auth/logout").post(logout);
router.route("/auth/me").get(isAuthenticated, getMe);

export default router;
