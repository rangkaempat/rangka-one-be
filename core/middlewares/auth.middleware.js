import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS;

const authenticateUser = async (req, res, next) => {
  try {
    let token;

    // 1. Check cookie
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    // 2. Fallback: Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET_ACCESS);

    const user = await User.findOne({
      where: { id: decoded.userId },
    });

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Attach only basic user info
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};

export default authenticateUser;
