import { Router } from "express";
import {
  getAllServiceItems,
  createServiceItem,
  updateServiceItem,
  deleteServiceItem,
} from "../controllers/serviceItem.controller.js";

const serviceItemRouter = Router();

serviceItemRouter.get("/", getAllServiceItems);
serviceItemRouter.post("/", createServiceItem);
serviceItemRouter.put("/:id", updateServiceItem);
serviceItemRouter.delete("/:id", deleteServiceItem);

export default serviceItemRouter;
