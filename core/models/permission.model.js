// models/Permission.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Permission = sequelize.define(
  "Permission",
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
    moduleId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "module_id",
      references: {
        model: "modules",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    featureId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "feature_id",
      references: {
        model: "features",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    accessLevel: {
      type: DataTypes.JSON, // Stores ["create", "read", "update", "delete"]
      allowNull: false,
      field: "access_level",
      validate: {
        isValidAccess(value) {
          const validOps = ["create", "read", "update", "delete"];
          if (
            !Array.isArray(value) ||
            value.some((op) => !validOps.includes(op))
          ) {
            throw new Error(
              "accessLevel must be an array containing only create, read, update, delete"
            );
          }
        },
      },
    },
    scope: {
      type: DataTypes.ENUM("all", "department", "self"),
      allowNull: false,
      defaultValue: "self",
    },
    grantedBy: {
      type: DataTypes.UUID,
      allowNull: true, // Nullable so we can allow automated grants
      field: "granted_by",
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "permissions",
    timestamps: true,
    paranoid: true, // Soft deletes
    underscored: true, // snake_case in DB
  }
);

export default Permission;
