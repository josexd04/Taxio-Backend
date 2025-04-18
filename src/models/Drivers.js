const { Schema, model } = require("mongoose");

const Driver = new Schema(
  {
    name: String,
    taxiNumber: Number,
    driverID: String,
    phoneNumber: String,
    lastConnection:String,
    activeTime:String,
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