import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    // Identity
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },

    // Auth
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },

    // Company Info
    companyId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    department: {
      type: DataTypes.ENUM(
        "Business Development & Sales",
        "Accounting & Finance",
        "Human Resource",
        "Production & Operations",
        "Group Executive Chairman's (GEC's) Office",
        "Strategic Planning & Corporate Affairs",
        "Corporate Communications"
      ),
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default User;
