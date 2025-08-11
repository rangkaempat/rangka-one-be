import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import authorizeAdmin from "../middlewares/authAdmin.middleware.js";
import {
  createModule,
  deleteModule,
  getModuleById,
  getModules,
  updateModule,
} from "../controllers/module.controller.js";

const moduleRouter = Router();

// /api/modules

// Get all modules
moduleRouter.get("/", authenticateUser, authorizeAdmin, getModules);

// Get module by ID
moduleRouter.get("/:id", authenticateUser, authorizeAdmin, getModuleById);

// Create new module
moduleRouter.post("/", authenticateUser, authorizeAdmin, createModule);

// Update module by ID
moduleRouter.patch("/:id", authenticateUser, authorizeAdmin, updateModule);

// Delete module by ID
moduleRouter.delete("/:id", authenticateUser, authorizeAdmin, deleteModule);

export default moduleRouter;
