const { Schema, models, model } = require("mongoose");

const userSchema = new Schema(
  {
    userName: String,
    password: String,
    name: String,
    phone: Number
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
 