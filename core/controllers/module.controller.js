import Module from "../models/module.model.js";
import { Op } from "sequelize";

// GET all modules
export const getModules = async (req, res, next) => {
  try {
    // Extract query params from URL like /api/modules?code=HR&name=Human
    const { code, name, isCore } = req.query;

    // Build dynamic 'where' object for filtering
    const where = {};

    if (code) {
      // Partial match (case insensitive)
      where.code = { [Op.like]: `%${code}%` };
    }
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (isCore !== undefined) {
      // Because query params are strings, convert to boolean
      where.isCore = isCore === "true";
    }

    // Query with or without filters
    const modules = await Module.findAll({ where });

    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    next(error);
  }
};

// GET module by ID
export const getModuleById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const module = await Module.findByPk(id);
    if (!module) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }
    res.status(200).json({ success: true, data: module });
  } catch (error) {
    next(error);
  }
};

// CREATE new module
export const createModule = async (req, res, next) => {
  try {
    const { name, code, description, isCore } = req.body;

    if (!name || !code) {
      return res
        .status(400)
        .json({ success: false, message: "Name and code are required" });
    }

    // Optional: Check for duplicate code to avoid unique constraint error
    const existingModule = await Module.findOne({ where: { code } });
    if (existingModule) {
      return res
        .status(409)
        .json({ success: false, message: "Module code already exists" });
    }

    const newModule = await Module.create({
      name,
      code,
      description: description || null,
      isCore: isCore || false,
    });

    res.status(201).json({ success: true, data: newModule });
  } catch (error) {
    next(error);
  }
};

// UPDATE module by ID
export const updateModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, description, isCore } = req.body;

    const module = await Module.findByPk(id);
    if (!module) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }

    if (code && code !== module.code) {
      const codeExists = await Module.findOne({
        where: { code, id: { [Op.ne]: id } },
      });
      if (codeExists) {
        return res
          .status(409)
          .json({ success: false, message: "Module code already exists" });
      }
    }

    await module.update({
      name: name !== undefined ? name : module.name,
      code: code !== undefined ? code : module.code,
      description: description !== undefined ? description : module.description,
      isCore: isCore !== undefined ? isCore : module.isCore,
    });

    res.status(200).json({ success: true, data: module });
  } catch (error) {
    next(error);
  }
};

// DELETE module by ID
export const deleteModule = async (req, res, next) => {
  try {
    const id = req.params.id;
    const module = await Module.findByPk(id);
    if (!module) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }

    await module.destroy();

    res
      .status(200)
      .json({ success: true, message: "Module deleted successfully" });
  } catch (error) {
    next(error);
  }
};
