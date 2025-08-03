import ServiceItem from "../models/serviceItem.model.js";

// =============================
// GET ALL SERVICE ITEMS (All service item details)
// =============================
// [GET] /api/services
export const getAllServiceItems = async (req, res, next) => {
  try {
    const serviceItems = await ServiceItem.find().sort({ createdAt: -1 });

    // Fetch successful
    res.status(200).json({
      success: true,
      message: "All service items retrieved successfully",
      data: serviceItems,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// CREATE NEW SERVICE ITEM
// =============================
// [POST] /api/services
export const createServiceItem = async (req, res, next) => {
  try {
    const { name, description, hourlyRate } = req.body;

    // Validate input
    if (!name || !description || typeof hourlyRate !== "number") {
      const error = new Error(
        "All fields (name, description, hourlyRate) are required and must be valid"
      );
      error.statusCode = 400;
      throw error;
    }

    const newItem = await ServiceItem.create({ name, description, hourlyRate });

    res.status(201).json({
      success: true,
      message: "Service item created successfully",
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// UPDATE SERVICE ITEM BY ID
// =============================
// [PUT] /api/services/:id
export const updateServiceItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedItem = await ServiceItem.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      const error = new Error("Service item not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Service item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// DELETE SERVICE ITEM BY ID
// =============================
// [DELETE] /api/services/:id
export const deleteServiceItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedItem = await ServiceItem.findByIdAndDelete(id);

    if (!deletedItem) {
      const error = new Error("Service item not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Service item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
