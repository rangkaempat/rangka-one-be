import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

// ADMIN ONLY

// =============================
// CREATE USER (name, email, password, role)
// =============================
// [POST] /api/admin/create-user
export const createUserAsAdmin = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password, role, companyId, department, position } =
      req.body;

    // Basic Validation
    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !companyId ||
      !department ||
      !position
    ) {
      const error = new Error("All fields are required.");
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

    // Validate department is one of the allowed values
    const allowedDepartments = [
      "Business Development & Sales",
      "Accounting & Finance",
      "Human Resource",
      "Production & Operations",
      "Group Executive Chairman's (GEC's) Office",
      "Strategic Planning & Corporate Affairs",
      "Corporate Communications",
    ];
    if (!allowedDepartments.includes(department)) {
      const error = new Error("Invalid department specified.");
      error.statusCode = 400;
      throw error;
    }

    // Check for existing user email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists with this email.");
      error.statusCode = 409;
      throw error;
    }

    // Check for existing company ID
    const existingCompanyId = await User.findOne({ companyId });
    if (existingCompanyId) {
      const error = new Error("User already exists with this company ID.");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with role
    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
          role,
          companyId,
          department,
          position,
        },
      ],
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
          companyId: newUser[0].companyId,
          department: newUser[0].department,
          position: newUser[0].position,
        },
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// =============================
// UPDATE USER BY ID (name, username, email, password, role, companyId, department, position)
// =============================
// [PATCH] /api/admin/users/:id
export const updateUserAsAdmin = async (req, res, next) => {
  try {
    const {
      name,
      username,
      email,
      password,
      companyId,
      department,
      position,
      role,
    } = req.body;

    // Handle updates
    const updates = {};
    if (name) updates.name = name;
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (companyId) updates.companyId = companyId;
    if (department) updates.department = department;
    if (position) updates.position = position;
    if (role) updates.role = role; // Optional: if you're allowing admin to change roles

    // Update
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    // If user not found
    if (!updatedUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "User updated by admin successfully",
      data: updatedUser,
    });
  } catch (error) {
    // If field has duplicate value from database
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const duplicateError = new Error(`${field} already in use`);
      duplicateError.statusCode = 400;
      return next(duplicateError);
    }

    next(error);
  }
};
