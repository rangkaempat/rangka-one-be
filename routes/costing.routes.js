import { Router } from "express";
import {
  getAllCostings,
  getCostingById,
  createCosting,
  updateCosting,
  deleteCosting,
  getCostingsByUserId,
} from "../controllers/costing.controller.js";

const costingRouter = Router();

costingRouter.get("/", getAllCostings);
costingRouter.get("/:id", getCostingById);
costingRouter.post("/", createCosting);
costingRouter.put("/:id", updateCosting);
costingRouter.delete("/:id", deleteCosting);
costingRouter.get("/user/:id", getCostingsByUserId); // Make sure this route comes after "/", to avoid route conflicts

export default costingRouter;
