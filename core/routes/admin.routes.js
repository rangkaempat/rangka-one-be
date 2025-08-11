import { Router } from "express";
import {
  createUserAsAdmin,
  updateUserAsAdmin,
} from "../controllers/admin.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import authorizeAdmin from "../middlewares/authAdmin.middleware.js";

const adminRouter = Router();

// /api/admin

// Admin Only User Creation
adminRouter.post(
  "/create-user",
  authenticateUser,
  authorizeAdmin,
  createUserAsAdmin
);

// Admin Only User Update
adminRouter.patch(
  "/users/:id",
  authenticateUser,
  authorizeAdmin,
  updateUserAsAdmin
);

export default adminRouter;
