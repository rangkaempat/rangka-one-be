// models/serviceItem.model.js
import mongoose from "mongoose";

// List of all service items we offer
const serviceItemSchema = new mongoose.Schema(
  {
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
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const ServiceItem = mongoose.model("ServiceItem", serviceItemSchema);

export default ServiceItem;
