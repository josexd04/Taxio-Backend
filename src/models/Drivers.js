const { Schema, model } = require("mongoose");

const Driver = new Schema(
  { 
    driverRef: String,
    name: String,
    taxiNumber: Number,
    driverID: String,
    phoneNumber: String,
    license: String,
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Driver", Driver);