// models/session.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./user.model.js";

const Session = sequelize.define(
  "Session",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    refreshToken: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "refresh_token",
    },
    ipAddress: {
      type: DataTypes.STRING(45), // IPv6 max length
      allowNull: true,
      field: "ip_address",
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "user_agent",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at",
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "revoked_at",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    tableName: "sessions",
    timestamps: false, // createdAt is handled manually
    underscored: true,
  }
);

// Association: 1 User → Many Sessions
User.hasMany(Session, { foreignKey: "userId", as: "sessions" });
Session.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Session;
