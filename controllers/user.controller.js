// controllers/user.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

// =============================
//  GET ALL USERS (All Data Excluding Password)
// =============================
// [GET] /api/users/
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// =============================
//  GET USER BY ID (All Data Excluding Password)
// =============================
// [GET] /api/users/:id
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Get all user details excluding password

    // If user not found
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // User found
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// =============================
// EDIT USER DETAILS (name, username, email, password)
//
// Normal users will only be able to edit:
// - Name
// - Username
// - Email
// - Password
// =============================
// [PATCH] /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    // Update user details
    const updates = {};
    if (name) updates.name = name;
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    // Find user by ID and update details
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    // If user doesn't exist
    if (!updatedUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Update successful
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    // Handle duplicate key error (email, username, etc.)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]; // e.g. 'email'
      const duplicateError = new Error(`${field} already in use`);
      duplicateError.statusCode = 400;
      return next(duplicateError);
    }

    next(error);
  }
};

// =============================
//  DELETE USER BY ID
// =============================
// [DELETE] /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    // If user doesn't exist
    if (!deletedUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Delete successful
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
