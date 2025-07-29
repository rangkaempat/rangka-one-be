import Costing from "../models/costing.model.js";

export default async function authorizeCostingOwnerOrAdmin(req, res, next) {
  try {
    const user = req.user; // already populated by `authorize` middleware
    const costingId = req.params.id;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user" });
    }

    // If Admin -> grant access
    if (user.role === "admin") return next();

    const costing = await Costing.findById(costingId);

    if (!costing) {
      return res.status(404).json({ message: "Costing not found" });
    }

    // Check if the logged-in user is the costing owner (the user that created that specific costing)
    const isOwner = costing.createdBy.toString() === user._id.toString();

    if (!isOwner) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this costing" });
    }

    // If Authorized -> next
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res
      .status(500)
      .json({ message: "Server error during costing authorization" });
  }
}
