// Middleware authorization to check if user is Admin or has permitted access

const authorizeAccess = ({
  module,
  feature,
  requiredAccess = [],
  scope = "self",
}) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.permissions) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Always allow admin
    if (user.role?.toLowerCase() === "admin") return next();

    const match = user.permissions.find(
      (p) =>
        p.module === module &&
        p.feature === feature &&
        requiredAccess.every((action) => p.access.includes(action)) &&
        (p.scope === scope || p.scope === "all")
    );

    if (!match) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.accessScope = match.scope;
    next();
  };
};

export default authorizeAccess;
