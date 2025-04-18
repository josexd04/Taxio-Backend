const { Schema, model } = require("mongoose");

const Taxis = new Schema(
  {
    taxiNumber: Number,
    driverID: String,
    arrivalFolio: Number,
    folio: Number,
    arrivalTime:String,
    position: String,
    queue: Number,

  },
  {
    timestamps: true,
  }
);

module.exports = model("TaxisTPA", Taxis);
