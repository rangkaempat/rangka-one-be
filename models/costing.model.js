// models/costing.model.js
import mongoose from "mongoose";

// Service Items Used in the project
const serviceUsedSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceItem",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  hours: {
    type: Number,
    required: true,
    min: 0,
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Project Costing
const costingSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    servicesUsed: [serviceUsedSchema], // Referencing another model in the database
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// Auto-calculate total before saving
costingSchema.pre("save", async function (next) {
  let total = 0;
  for (const item of this.servicesUsed) {
    const service = await mongoose.model("ServiceItem").findById(item.service);
    if (!service) throw new Error("Invalid Service Item");
    total += service.hourlyRate * item.hours;
  }
  this.totalAmount = total;
  next();
});

const Costing = mongoose.model("Costing", costingSchema);

export default Costing;
