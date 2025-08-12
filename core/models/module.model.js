// models/module.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Module = sequelize.define(
  "Module",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isCore: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_core",
    },
  },
  {
    tableName: "modules",
    timestamps: true,
    underscored: true,
  }
);

export default Module;
