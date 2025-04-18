const { Schema, model } = require("mongoose");

const Folio = new Schema(
  {
    taxiNumber: Number,
    driverID: String,
    arrivalFolio: Number,
    folio: String,
    date: String,
    user: String

  },
  {
    timestamps: true,
  }
);

module.exports = model("Folio", Folio);
