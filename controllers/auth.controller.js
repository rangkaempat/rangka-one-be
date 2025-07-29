import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// =============================
// REGISTER NEW USER
// =============================
export const register = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Receive request
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );

    // Create token
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Commit transaction to database
    await session.commitTransaction();
    session.endSession();

    // Return success message
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// =============================
// LOGIN USER
// =============================
export const login = async (req, res, next) => {
  try {
    // Receive request from client
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Compare entered password with user.password (user's actual password)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is not valid
    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    // If password is valid, Create token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Return success message
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// LOGOUT USER
// =============================
export const logout = async (req, res, next) => {
  try {
    // TODO:
    // Since JWT is stateless, the server doesn't store sessions.
    // To "logout", the client deletes the token from storage (e.g., localStorage/cookies).
    // Optionally, implement token blacklisting if needed for higher security.

    res.status(200).json({
      success: true,
      message:
        "User logged out successfully. Please clear your token from client-side storage.",
    });
  } catch (error) {
    next(error);
  }
};
