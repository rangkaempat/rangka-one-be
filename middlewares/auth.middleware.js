import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Example scenario
// someone is making a get user details request -> authorize middleware -> verify -> if valid -> next -> get user details

const authorize = async (req, res, next) => {
  try {
    // Find the user based off of the token of the user that is trying to make the request
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Looks if it's there and decodes it and verifies that it is the user that is currently logged in
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Attach it to the request (We will know who exactly is making the request)
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export default authorize;
