import { Router } from "express";
import {
  getAllCostings,
  getCostingById,
  createCosting,
  updateCosting,
  deleteCosting,
  getCostingsByUserId,
} from "../controllers/costing.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import authorizeAdmin from "../middlewares/authAdmin.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authSelfOrAdmin.js";
import authorizeCostingOwnerOrAdmin from "../middlewares/authCostingOwnerOrAdmin.middleware.js";

const costingRouter = Router();

// /api/costing
costingRouter.get("/", authorize, authorizeAdmin, getAllCostings); // Admin Only

costingRouter.get(
  "/:id",
  authorize,
  authorizeCostingOwnerOrAdmin,
  getCostingById
); // Costing Owner or Admin Only

costingRouter.post("/", authorize, createCosting); // All users

costingRouter.put(
  "/:id",
  authorize,
  authorizeCostingOwnerOrAdmin,
  updateCosting
); // Costing Owner or Admin Only

costingRouter.delete(
  "/:id",
  authorize,
  authorizeCostingOwnerOrAdmin,
  deleteCosting
); // Costing Owner or Admin Only

costingRouter.get(
  "/users/:id",
  authorize,
  authorizeSelfOrAdmin,
  getCostingsByUserId
); // Self or Admin Only

export default costingRouter;
