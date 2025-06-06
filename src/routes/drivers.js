const { Router } = require("express");
const verifyToken = require("../utils/verifyToken");
const verifyRestTime = require("../utils/verifyRestTime");
const Driver = require("../models/Drivers");
const Taxi = require("../models/Taxis");
const workingTimeService = require("../services/workingTime.service");
const crypto = require("crypto")

const router = Router();

// Registrar conductor y arrancar turno
router.post("/register", verifyToken, async (req, res) => {
  const { taxiNumber, driverID, name, phoneNumber, license } = req.body;
  try {
    if (await Driver.findOne({ driverID })) {
      return res.status(400).json("El conductor ya existe");
    }
    const newDriver = new Driver({
      taxiNumber,
      driverID,
      name,
      phoneNumber,
      license,
    });
    newDriver.status = true;
    await newDriver.save();
    await workingTimeService.startShift(newDriver);
    res.status(200).json("Conductor registrado y turno iniciado con éxito");
  } catch (err) {
    console.error("Error en POST /register:", err);
    res.status(500).json("Error al registrar conductor");
  }
});

// Listar conductores
router.get("/", verifyToken, async (req, res) => {
  try {
    const drivers = await Driver.find({});
    res.json(drivers);
  } catch (err) {
    console.error("Error en GET /drivers:", err);
    res.status(500).json("Error al obtener conductores");
  }
});

// Activar conductor (requiere descanso)
router.patch("/activate", verifyToken, verifyRestTime, async (req, res) => {
  const { driverID } = req.body;
  try {
    const driver = await Driver.findOne({ driverID });
    if (!driver) return res.status(404).json("El conductor no existe");
    if (driver.status)
      return res.status(400).json("El conductor ya está activo");
    driver.status = true;
    await driver.save();
    await workingTimeService.startShift(driver);
    res.json("Conductor activado y turno iniciado");
  } catch (err) {
    console.error("Error en PATCH /activate:", err);
    res.status(500).json("Error al activar conductor");
  }
});

// Desactivar conductor y cerrar turno
router.patch("/deactivate", verifyToken, async (req, res) => {
  const { driverID } = req.body;
  try {
    const driver = await Driver.findOne({ driverID });
    const inQueue = await Taxi.findOne({ driverID });
    const errors = [];
    if (!driver) errors.push("El conductor no existe");
    if (driver && !driver.status) errors.push("El conductor ya está inactivo");
    if (inQueue) errors.push("El conductor se encuentra en la fila");
    if (errors.length) return res.status(400).json(errors.join(", "));
    const closed = await workingTimeService.endShift(driver);
    if (!closed)
      return res.status(400).json("No hay un turno abierto para cerrar");
    driver.status = false;
    await driver.save();
    res.json("Conductor desactivado y turno finalizado");
  } catch (err) {
    console.error("Error en PATCH /deactivate:", err);
    res.status(500).json("Error al desactivar conductor");
  }
});

module.exports = router;
