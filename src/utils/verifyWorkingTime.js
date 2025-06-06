// src/utils/verifyWorkingTime.js
const workingTimeService = require("../services/workingTime.service");
const Driver = require("../models/Drivers");

async function verifyWorkingTime(req, res, next) {
  try {
    const { taxiNumber } = req.body;
    const driver = await Driver.findOne({ taxiNumber });
    if (!driver || !driver.status) {
      return res.status(400).json("El conductor no está activo o no existe");
    }

    const hoursWorked = await workingTimeService.getHoursWorked(driver);
    if (hoursWorked > 15) {
      return res
        .status(400)
        .json(`El conductor ha excedido las 15 horas de trabajo (${hoursWorked.toFixed(2)} h).`);
    }

    next();
  } catch (err) {
    console.error("Error en verifyWorkingTime:", err);
    res.status(500).json("Error al verificar las horas trabajadas");
  }
}

module.exports = verifyWorkingTime;
