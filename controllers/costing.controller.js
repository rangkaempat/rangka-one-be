import Costing from "../models/costing.model.js";
import ServiceItem from "../models/serviceItem.model.js";

// Get all costing
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

// Get a single costing by ID
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

// Get costing by user ID
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

// Create a new costing
export const createCosting = async (req, res) => {
  try {
    const {
      createdBy,
      projectName,
      clientName,
      notes = "",
      servicesUsed: rawServices,
    } = req.body;

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

    let totalAmount = 0;
    const servicesUsed = [];

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

      servicesUsed.push({
        service: item.service,
        hours: item.hours,
        hourlyRate,
        subtotal,
      });
    }

    const newCosting = new Costing({
      createdBy,
      projectName,
      clientName,
      notes,
      servicesUsed,
      totalAmount,
    });

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

// Update a costing
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

// Delete a costing
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
