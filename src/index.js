require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");

require("./database");

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/routers.js"));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
  
});
