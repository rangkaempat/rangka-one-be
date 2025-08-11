import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL database!");

    // await sequelize.sync({ force: true }); // !!! ONLY FOR DROPPING EXISTING TABLES AND DATA, CREATING NEW TABLES
    // await sequelize.sync({ alter: true }); // !!! ONLY IN DEVELOPMENT TO ALTER EXISTING TABLE FIELDS

    await sequelize.sync();

    console.log("✅ Models synchronized");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

export default sequelize;
