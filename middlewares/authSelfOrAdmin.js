// middlewares/authSelfOrAdmin.middleware.js

export default function authorizeSelfOrAdmin(req, res, next) {
  try {
    const loggedInUser = req.user; // populated by previous `authorize` middleware
    const targetUserId = req.params.id;

    if (!loggedInUser) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user found in request" });
    }

    const isAdmin = loggedInUser.role === "admin";
    const isSelf = loggedInUser._id?.toString() === targetUserId;

    if (!isAdmin && !isSelf) {
      return res
        .status(403)
        .json({ message: "Access denied: Must be admin or the user themself" });
    }

    next(); // Authorized
  } catch (error) {
    console.error("Authorization error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during authorization" });
  }
}
