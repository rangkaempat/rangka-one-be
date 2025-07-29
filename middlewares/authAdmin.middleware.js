// Middleware authorization to check if user is Admin

const authorizeAdmin = (req, res, next) => {
  // Check if the user that is requesting is an admin
  if (req.user && req.user.role === "admin") {
    next(); // Allow access
  } else {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
};

export default authorizeAdmin;
