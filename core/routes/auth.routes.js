import { Router } from "express";
import {
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/auth.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";

const authRouter = Router();

// /api/auth
authRouter.post("/register", register); // Public
authRouter.post("/login", login); // Public
authRouter.post("/logout", authenticateUser, logout); // All Users
authRouter.post("/refresh-token", refreshAccessToken); // Public route

export default authRouter;
