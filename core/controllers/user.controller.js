import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

// =============================
// GET ALL USERS (Exclude passwordHash)
// [GET] /api/users/
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["passwordHash"] },
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// =============================
// GET USER BY ID (Exclude passwordHash)
// [GET] /api/users/:id
export const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// =============================
// GET CURRENT AUTHENTICATED USER
// [GET] /api/users/me
export const getCurrentUser = async (req, res, next) => {
  try {
    // req.user is set by your auth middleware after verifying access token
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// =============================
// UPDATE USER BY ID (PATCH)
// [PATCH] /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, username, email, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Prepare update payload
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;
    if (password !== undefined) {
      updates.passwordHash = await bcrypt.hash(password, 10);
    }

    // Check for duplicates on username or email (if changed)
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({
        where: {
          username,
          id: { [Op.ne]: id },
        },
      });
      if (usernameExists) {
        return res
          .status(409)
          .json({ success: false, message: "Username already in use" });
      }
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: id },
        },
      });
      if (emailExists) {
        return res
          .status(409)
          .json({ success: false, message: "Email already in use" });
      }
    }

    await user.update(updates);

    // Return updated user excluding passwordHash
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["passwordHash"] },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// DELETE USER BY ID
// [DELETE] /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
