import User from "./user.model.js";
import Permission from "./permission.model.js";

// User has many Permissions
User.hasMany(Permission, { foreignKey: "userId", as: "permissions" });
Permission.belongsTo(User, { foreignKey: "userId" });
