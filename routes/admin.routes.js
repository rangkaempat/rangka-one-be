import { Router } from "express";
import {
  createUserAsAdmin,
  updateUserAsAdmin,
} from "../controllers/admin.controller.js";
import authorizeAdmin from "../middlewares/authAdmin.middleware.js";
import authorize from "../middlewares/auth.middleware.js";

const adminRouter = Router();

// /api/admin
adminRouter.post("/create-user", authorize, authorizeAdmin, createUserAsAdmin); // Admin Only User Creation
adminRouter.patch("/users/:id", authorize, authorizeAdmin, updateUserAsAdmin); // Admin Only User Update

export default adminRouter;
