const verifyRestTime = require("../utils/verifyRestTime");
const verifyToken = require("../utils/verifyToken");
const Driver = require("../models/Drivers");
const Taxi = require("../models/Taxis");

const { Router } = require("express");
const router = Router();

// register driver

router.post("/register", verifyToken, async (req, res) => {
  const { taxiNumber, driverID, name, phoneNumber, license } = req.body;

  try {
    const foundDriver = await Driver.findOne({ driverID });
    if (foundDriver) return res.status(400).json("El conductor ya existe");

    const newDriver = new Driver({
      taxiNumber,
      driverID,
      name,
      phoneNumber,
      license,
    });
    newDriver.status = true;
    newDriver.activeTime = new Date();
    newDriver.lastConnection = new Date();
    await newDriver.save();

    res.status(200).json("Conductor registrado con éxito");
    console.log("conductor registrado" + newDriver);
  } catch (error) {
    res.status(400).json("Error: " + error);
    console.log(error);
  }
});

//get driver

router.get("/", verifyToken, async (req, res) => {
  try {
    const drivers = await Driver.find({});
    res.json(drivers);
  } catch (error) {
    res.status(400).json("Error: " + error);
    console.log(error);
  }
});

//activate driver

router.patch("/activate", verifyToken, verifyRestTime, async (req, res) => {
  const { driverID } = req.body;

  try {
    const taxi = await Taxi.findOne({ driverID });
    const foundDriver = await Driver.findOne({ driverID });
    if (!foundDriver) return res.status(400).json("El conductor no existe");
    if (foundDriver.status)
      return res.status(400).json("El conductor ya esta activo");

    foundDriver.status = true;
    foundDriver.activeTime = new Date();
    await foundDriver.save();

    res.status(200).json("Conductor activado con éxito");
  } catch (error) {
    res.status(400).json("Error: " + error);
    console.log(error);
  }
});

//deactivate driver

router.patch("/deactivate", verifyToken, async (req, res) => {
  const { taxi, driverID } = req.body;

  try {
    const foundDriver = await Driver.findOne({ taxi, driverID });
    const foundTaxi = await Taxi.findOne({ taxi, driverID });

    const errorMessages = [];

    if (!foundDriver) errorMessages.push("El conductor no existe");
    if (foundDriver && !foundDriver.status) errorMessages.push("El conductor ya está inactivo");
    if (foundTaxi) errorMessages.push("El conductor se encuentra en la fila");

    if (errorMessages.length > 0) {
      return res.status(400).json(errorMessages.join(", "));
    }

    foundDriver.status = false;
    foundDriver.lastConnection = new Date();
    await foundDriver.save();

    res.status(200).json("Conductor desactivado con éxito");
  } catch (error) {
    res.status(400).json("Error: " + error);
    console.log(error);
  }
});





module.exports = router;
