const { Router } = require("express");
const jwt = require("jsonwebtoken");
const router = Router();
const User = require("../models/User");



router.post("/", async (req, res) => {
  const { userName, password } = req.body;

  const newUser = new User({ userName, password });
  console.log(newUser);
  await newUser.save();
  const token = jwt.sign({ id: newUser._id },process.env.JWT_SECRET);

  res.status(200).json(token);
});



module.exports = router;
