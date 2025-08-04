import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import authorizeAdmin from "../middlewares/authAdmin.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authSelfOrAdmin.js";

const userRouter = Router();

// /api/users
userRouter.get("/", authorize, authorizeAdmin, getUsers); // Admin Only
userRouter.get("/:id", authorize, authorizeSelfOrAdmin, getUser); // Self or Admin Only
userRouter.patch("/:id", authorize, authorizeSelfOrAdmin, updateUser); // Self or Admin Only
userRouter.delete("/:id", authorize, authorizeSelfOrAdmin, deleteUser); // Self or Admin Only

export default userRouter;
