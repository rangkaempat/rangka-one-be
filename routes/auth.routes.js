import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const authRouter = Router();

// /api/auth
authRouter.post("/register", register); // Public
authRouter.post("/login", login); // Public
authRouter.post("/logout", authorize, logout); // All Users

export default authRouter;
