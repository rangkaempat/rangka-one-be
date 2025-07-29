import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

// CREATE USER (Admin Only)
export const createUserAsAdmin = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password, role } = req.body;

    // Basic Validation
    if (!name || !email || !password || !role) {
      const error = new Error(
        "All fields (name, email, password, role) are required."
      );
      error.statusCode = 400;
      throw error;
    }

    // Optional: Validate role is one of the allowed values
    const allowedRoles = ["user", "admin"];
    if (!allowedRoles.includes(role)) {
      const error = new Error("Invalid role specified.");
      error.statusCode = 400;
      throw error;
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists with this email.");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with role
    const newUser = await User.create(
      [{ name, email, password: hashedPassword, role }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully by admin.",
      data: {
        user: {
          _id: newUser[0]._id,
          name: newUser[0].name,
          email: newUser[0].email,
          role: newUser[0].role,
        },
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
