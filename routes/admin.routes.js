import { Router } from "express";
import { createUserAsAdmin } from "../controllers/admin.controller.js";
import authorizeAdmin from "../middlewares/authAdmin.middleware.js";
import authorize from "../middlewares/auth.middleware.js";

const adminRouter = Router();

// /api/admin
adminRouter.post("/create-user", authorize, authorizeAdmin, createUserAsAdmin); // Admin Only User Creation

export default adminRouter;
