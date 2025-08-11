import { Router } from "express";
import {
  deleteUser,
  getCurrentUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import authorizeAccess from "../middlewares/authAccess.middleware.js";
import authorizeAdmin from "../middlewares/authAdmin.middleware.js";

const userRouter = Router();

// Self: Get current user
userRouter.get("/me", authenticateUser, getCurrentUser);

// Admin Only: Get list of all users
userRouter.get("/", authenticateUser, authorizeAdmin, getUsers);

// Self or Admin: View user details
userRouter.get("/:id", authenticateUser, authorizeAdmin, getUser);

// Self or Admin: Update user
userRouter.patch("/:id", authenticateUser, updateUser);

// Self or Admin: Delete user
userRouter.delete("/:id", authenticateUser, deleteUser);

// ===================

// Self: Update current user
// userRouter.patch("/me", authenticateUser, updateCurrentUser);

// Self: Delete current user
// userRouter.delete("/me", authenticateUser, deleteCurrentUser);

export default userRouter;
