import Costing from "../models/costing.model.js";
import ServiceItem from "../models/serviceItem.model.js";

// =============================
//  GET ALL COSTINGS
// =============================
// [GET] /api/costing
export const getAllCostings = async (req, res, next) => {
  try {
    const costing = await Costing.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All costing retrieved successfully",
      data: costing,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
//  GET COSTING BY ID
// =============================
// [GET] /api/costing/:ID
export const getCostingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const costing = await Costing.findById(id);

    if (!costing) {
      const error = new Error("Costing not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Costing retrieved successfully",
      data: costing,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
//  GET COSTING BY USER ID
// =============================
// [GET] /api/costing/users/:ID
export const getCostingsByUserId = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const costing = await Costing.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: `Costings for user ${userId} retrieved successfully`,
      data: costing,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
//  CREATE NEW COSTING
// =============================
// [POST] /api/costing
export const createCosting = async (req, res) => {
  try {
    // Initialize with data from request body
    const {
      projectName,
      clientName,
      notes = "",
      servicesUsed: rawServices,
    } = req.body;

    const createdBy = req.user._id;

    // Validate presence of essential fields
    if (
      !createdBy ||
      !projectName ||
      !clientName ||
      !rawServices ||
      !Array.isArray(rawServices)
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields or invalid servicesUsed format.",
      });
    }

    // Initialize totalAmount and servicesUsed array
    let totalAmount = 0;
    const servicesUsed = [];

    // Validate each servicesUsed item
    for (const item of rawServices) {
      if (!item.service || typeof item.hours !== "number") {
        return res.status(400).json({
          success: false,
          message:
            "Each item in servicesUsed must include service (ID) and hours (Number).",
        });
      }

      const serviceData = await ServiceItem.findById(item.service);
      if (!serviceData) {
        return res.status(400).json({
          success: false,
          message: `ServiceItem not found for ID: ${item.service}`,
        });
      }

      if (typeof serviceData.hourlyRate !== "number") {
        return res.status(400).json({
          success: false,
          message: `Hourly rate not defined for service ID: ${item.service}`,
        });
      }

      const hourlyRate = serviceData.hourlyRate;
      const subtotal = hourlyRate * item.hours;

      totalAmount += subtotal;

      // Insert servicesUsed fields with new data
      servicesUsed.push({
        service: item.service,
        name: serviceData.name,
        description: serviceData.description,
        hours: item.hours,
        hourlyRate,
        subtotal,
      });
    }

    // Insert costing fields to new data
    const newCosting = new Costing({
      createdBy,
      projectName,
      clientName,
      notes,
      servicesUsed,
      totalAmount,
    });

    // Save to database
    await newCosting.save();

    res.status(201).json({
      success: true,
      message: "Costing created successfully",
      data: newCosting,
    });
  } catch (error) {
    console.error("Error creating costing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create costing",
      error: error.message,
    });
  }
};

// =============================
//  UPDATE COSTING BY ID
// =============================
// [PUT] /api/costing/:ID
export const updateCosting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCosting = await Costing.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCosting) {
      const error = new Error("Costing not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Costing updated successfully",
      data: updatedCosting,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
//  DELETE COSTING BY ID
// =============================
// [DELETE] /api/costing/:ID
export const deleteCosting = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCosting = await Costing.findByIdAndDelete(id);

    if (!deletedCosting) {
      const error = new Error("Costing not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Costing deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
