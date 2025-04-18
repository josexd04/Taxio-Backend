const { configDotenv } = require("dotenv");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then((db) => console.log("database is connected"))
  .catch((err) => console.log("database is not connected \n" + err));
