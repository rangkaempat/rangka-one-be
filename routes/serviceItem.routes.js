import { Router } from "express";
import {
  getAllServiceItems,
  createServiceItem,
  updateServiceItem,
  deleteServiceItem,
} from "../controllers/serviceItem.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import authorizeAdmin from "../middlewares/authAdmin.middleware.js";

const serviceItemRouter = Router();

// /api/services
serviceItemRouter.get("/", authorize, getAllServiceItems); // All users
serviceItemRouter.post("/", authorize, authorizeAdmin, createServiceItem); // Admin Only
serviceItemRouter.put("/:id", authorize, authorizeAdmin, updateServiceItem); // Admin Only
serviceItemRouter.delete("/:id", authorize, authorizeAdmin, deleteServiceItem); // Admin Only

export default serviceItemRouter;
