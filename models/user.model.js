import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🧑 User Identity & Personalization
    name: {
      type: String,
      required: [true, "User Name is required"],
      trim: true, //Trim empty spaces in string
      minLength: 2,
      maxLength: 50,
    },

    // 🔐 Security & Authentication
    email: {
      type: String,
      required: [true, `User Email is required`],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, `Please fill a valid email address`],
    },
    password: {
      type: String,
      required: [true, `User password is required`],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model(`User`, userSchema);

export default User;
