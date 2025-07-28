import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const authRouter = Router();

// Register Route
authRouter.post("/register", register);

// Login Route
authRouter.post("/login", login);

// Logout Route
authRouter.post("/logout", logout);

export default authRouter;
