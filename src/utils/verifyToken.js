const jwt = require("jsonwebtoken");
require("dotenv").config;

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorize Request, wrong token");
  }

  const token = req.headers.authorization.split(" ")[1];

  if (token == "null") {
    return res.status(401).send("Unauthorize Request, Null token");
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  console.log(payload);

  req.userId = payload._id;
  next();
}

module.exports = verifyToken;
