// Middleware authorization to check if user is Admin

const authorizeAdmin = (req, res, next) => {
  if (req.user?.role?.toLowerCase() === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Forbidden: Admins only" });
};

export default authorizeAdmin;
