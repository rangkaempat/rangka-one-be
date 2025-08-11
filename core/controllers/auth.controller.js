import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ms from "ms";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model.js";
import { Op } from "sequelize"; // For optional session queries
import Session from "../models/sessions.model.js";
import sequelize from "../../config/db.js";

const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

// =============================
// COOKIE CONFIG
// =============================
const cookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: maxAgeMs,
});

// =============================
// REGISTER NEW USER
// =============================
// [POST] /api/auth/register
export const register = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, username, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email and password are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const newUser = await User.create(
      {
        id: userId,
        name,
        username: username || null,
        email,
        password_hash: hashedPassword,
        role: "user",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction }
    );

    // --- Create tokens with session id (sessionId) ---
    const sessionId = uuidv4();
    const accessPayload = { userId, sessionId };
    const accessToken = jwt.sign(accessPayload, JWT_SECRET_ACCESS, {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    });

    const refreshPayload = { userId, sessionId };
    const refreshToken = jwt.sign(refreshPayload, JWT_SECRET_REFRESH, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    // Hash refresh token for DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Compute expiries (use ms for flexible env values)
    const accessExpiryMs = ms(JWT_ACCESS_EXPIRES_IN) || 15 * 60 * 1000;
    const refreshExpiryMs =
      ms(JWT_REFRESH_EXPIRES_IN) || 7 * 24 * 60 * 60 * 1000;

    // Save session row using sessionId
    await Session.create(
      {
        id: sessionId,
        userId,
        refreshToken: hashedRefreshToken,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] || null,
        expiresAt: new Date(Date.now() + refreshExpiryMs),
        createdAt: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    // Set cookies matching token expiries
    res.cookie("accessToken", accessToken, cookieOptions(accessExpiryMs));
    res.cookie("refreshToken", refreshToken, cookieOptions(refreshExpiryMs));

    const { password_hash, ...userWithoutPassword } = newUser.toJSON();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// =============================
// LOGIN USER (email, password)
// =============================
// [POST] /api/auth/login
export const login = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "email and password required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // ✅ Create DB session
    const sessionId = uuidv4();

    // ✅ Access token contains BOTH userId + sessionId (no sensitive info like email)
    const accessToken = jwt.sign(
      { userId: user.id, sessionId },
      JWT_SECRET_ACCESS,
      { expiresIn: JWT_ACCESS_EXPIRES_IN }
    );

    // ✅ Refresh token also contains BOTH
    const refreshToken = jwt.sign(
      { userId: user.id, sessionId },
      JWT_SECRET_REFRESH,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    // ✅ Hash refresh token for DB storage
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // ✅ Expiry times
    const accessExpiryMs = ms(JWT_ACCESS_EXPIRES_IN) || 15 * 60 * 1000;
    const refreshExpiryMs =
      ms(JWT_REFRESH_EXPIRES_IN) || 7 * 24 * 60 * 60 * 1000;

    // ✅ Save session in DB
    await Session.create(
      {
        id: sessionId,
        userId: user.id,
        refreshToken: hashedRefreshToken,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] || null,
        expiresAt: new Date(Date.now() + refreshExpiryMs),
        createdAt: new Date(),
      },
      { transaction }
    );

    // ✅ Update last login
    user.last_login_at = new Date();
    await user.save({ transaction });

    await transaction.commit();

    // ✅ Set secure cookies
    res.cookie("accessToken", accessToken, cookieOptions(accessExpiryMs));
    res.cookie("refreshToken", refreshToken, cookieOptions(refreshExpiryMs));

    const { password_hash, ...userWithoutPassword } = user.toJSON();
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// =============================
// LOGOUT USER (clear cookie & revoke session)
// =============================
// [POST] /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    // idempotent: if no token present, just clear cookies and return success
    if (!refreshToken) {
      res.clearCookie("accessToken", cookieOptions(0));
      res.clearCookie("refreshToken", cookieOptions(0));
      return res
        .status(200)
        .json({ success: true, message: "User logged out" });
    }

    // Try to decode refresh JWT to get sessionId (and userId as fallback)
    let decoded = null;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET_REFRESH);
    } catch (err) {
      // Token invalid / expired -> just clear cookies (no DB action)
      res.clearCookie("accessToken", cookieOptions(0));
      res.clearCookie("refreshToken", cookieOptions(0));
      return res
        .status(200)
        .json({ success: true, message: "User logged out" });
    }

    // Preferred path: revoke specific session by sessionId
    if (decoded?.sessionId) {
      const session = await Session.findOne({
        where: {
          id: decoded.sessionId,
          revokedAt: null,
          expiresAt: { [Op.gt]: new Date() },
        },
      });

      if (session) {
        const matches = await bcrypt.compare(
          refreshToken,
          session.refreshToken
        );
        if (matches) {
          await session.update({
            revokedAt: new Date(),
            revokedReason: "User logout",
          });
          console.log(`Session ${session.id} revoked.`);
        } else {
          // possible token mismatch -> revoke as precaution
          await session.update({
            revokedAt: new Date(),
            revokedReason: "Token mismatch on logout",
          });
          console.warn(
            `Session ${session.id} token mismatch on logout; revoked.`
          );
        }
      } else {
        // No matching session found (already revoked/expired) - ok
        console.warn("No active session found for provided sessionId.");
      }
    } else if (decoded?.userId) {
      // Fallback for legacy tokens: limit candidate sessions to user's recent active sessions
      const candidates = await Session.findAll({
        where: {
          userId: decoded.userId,
          revokedAt: null,
          expiresAt: { [Op.gt]: new Date() },
        },
        order: [["created_at", "DESC"]],
        limit: 10, // limit scan to avoid DB-wide scan
      });

      for (const s of candidates) {
        if (await bcrypt.compare(refreshToken, s.refreshToken)) {
          await s.update({
            revokedAt: new Date(),
            revokedReason: "User logout (fallback)",
          });
          console.log(`Session ${s.id} revoked (fallback).`);
          break;
        }
      }
    } else {
      // No sessionId and no userId in token (very unexpected) - just clear cookies
      console.warn(
        "Refresh token missing sessionId and userId; cannot target session."
      );
    }

    // Clear cookies (ensure same base options used to set cookies)
    res.clearCookie("accessToken", cookieOptions(0));
    res.clearCookie("refreshToken", cookieOptions(0));

    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// =============================
// REFRESH ACCESS TOKEN (Rotation)
// =============================
// [POST] /api/auth/refresh-token
export const refreshAccessToken = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const rawRefreshToken = req.cookies?.refreshToken;

    if (!rawRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    // Verify JWT signature
    let decoded;
    try {
      decoded = jwt.verify(rawRefreshToken, JWT_SECRET_REFRESH);
    } catch {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const { userId, sessionId } = decoded;
    if (!userId || !sessionId) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token payload",
      });
    }

    // Look up session & lock row to avoid race conditions
    const session = await Session.findOne({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
        expiresAt: { [Op.gt]: new Date() },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "role"],
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE, // Prevent concurrent refreshes
    });

    if (!session || !session.user) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Session not found or expired",
      });
    }

    // Verify refresh token matches stored hash
    const tokenMatches = await bcrypt.compare(
      rawRefreshToken,
      session.refreshToken
    );
    if (!tokenMatches) {
      // Mark stolen session
      await session.update(
        {
          revokedAt: new Date(),
          revokedReason: "Refresh token mismatch - possible theft",
        },
        { transaction }
      );
      await transaction.commit();
      return res.status(403).json({
        success: false,
        message: "Refresh token mismatch",
      });
    }

    // Create new session ID
    const newSessionId = uuidv4();
    const accessPayload = {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      sessionId: newSessionId, // Always consistent
    };
    const refreshPayload = {
      userId: session.user.id,
      sessionId: newSessionId,
    };

    const newAccessToken = jwt.sign(accessPayload, JWT_SECRET_ACCESS, {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    });
    const newRefreshToken = jwt.sign(refreshPayload, JWT_SECRET_REFRESH, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    const refreshExpiryMs =
      ms(JWT_REFRESH_EXPIRES_IN) || 7 * 24 * 60 * 60 * 1000;
    const accessExpiryMs = ms(JWT_ACCESS_EXPIRES_IN) || 15 * 60 * 1000;

    // Save new session first
    await Session.create(
      {
        id: newSessionId,
        userId: session.user.id,
        refreshToken: hashedNewRefreshToken,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] || null,
        expiresAt: new Date(Date.now() + refreshExpiryMs),
        createdAt: new Date(),
      },
      { transaction }
    );

    // Revoke old session after creating new one
    await session.update(
      {
        revokedAt: new Date(),
        revokedReason: "Rotated refresh token",
      },
      { transaction }
    );

    await transaction.commit();

    // Set cookies with stronger defaults
    const prod = process.env.NODE_ENV === "production";
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: prod,
      sameSite: prod ? "strict" : "lax",
      maxAge: accessExpiryMs,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: prod,
      sameSite: prod ? "strict" : "lax",
      maxAge: refreshExpiryMs,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
