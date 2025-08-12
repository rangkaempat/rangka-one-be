// models/feature.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Module from "./module.model.js";

const Feature = sequelize.define(
  "Feature",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    moduleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "module_id",
      references: {
        model: Module,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "features",
    timestamps: true,
    underscored: true,
  }
);

export default Feature;
