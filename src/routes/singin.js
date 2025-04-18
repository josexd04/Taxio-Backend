require("dotenv").config();
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const router = Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });

  if (!user) return res.status(401).send("El nombre de usuario no existe");
  if (user.password != password) return res.status(401).send("Contraseña incorrecta");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  console.log(`User ${userName} signed`);

  return res.status(200).json({ token });
});

module.exports = router;
