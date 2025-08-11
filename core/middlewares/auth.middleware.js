// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../models/user.model.js";
import Session from "../models/sessions.model.js";

const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS;

/**
 * authenticateUser
 * - Verifies an access JWT (from cookie or Authorization header)
 * - Ensures the referenced session exists, is not revoked and not expired
 * - Loads basic user info and attaches to req.user
 *
 * Notes:
 * - Access token must include { userId, sessionId } in its payload.
 * - Session table must be authoritative source of truth for session validity.
 */
const authenticateUser = async (req, res, next) => {
  try {
    let token = null;

    // 1) Prefer cookie (httpOnly)
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 2) Fallback: Authorization header "Bearer <token>"
    if (!token && req.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 3) Verify token signature and expiration
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET_ACCESS);
    } catch (err) {
      // could be TokenExpiredError or JsonWebTokenError
      return res
        .status(401)
        .json({ message: "Unauthorized", error: err.message });
    }

    // 4) Expect consistent payload keys
    const { userId, sessionId } = decoded;
    if (!userId || !sessionId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // 5) Check session in DB (authoritative)
    const session = await Session.findOne({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!session) {
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    // 6) Load user
    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "name", "role", "status"],
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 7) Attach minimal safe user object to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // 8) Optionally attach session id if downstream needs it
    req.sessionId = sessionId;

    next();
  } catch (error) {
    // Generic fallback - don't leak sensitive info
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};

export default authenticateUser;
