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
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
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

    // 🏢 Company/Organization Info
    companyId: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      enum: [
        "Business Development & Sales",
        "Accounting & Finance",
        "Human Resource",
        "Production & Operations",
        "Group Executive Chairman's (GEC's) Office",
        "Strategic Planning & Corporate Affairs",
        "Corporate Communications",
      ],
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model(`User`, userSchema);

export default User;
