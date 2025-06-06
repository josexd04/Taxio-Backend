// utils/verifyRestTime.js
const Driver = require("../models/Drivers");
const workingTimeService = require("../services/workingTime.service");

const verifyRestTime = async (req, res, next) => {
  try {
    const { driverID } = req.body;

    // 1) Cargar al conductor
    const foundDriver = await Driver.findOne({ driverID });
    if (!foundDriver) {
      return res.status(404).json("Conductor no registrado");
    }

    // 2) Validar descanso mínimo usando el servicio
    const canStart = await workingTimeService.canStartShift(foundDriver);
    if (!canStart) {
      return res
        .status(400)
        .json("El conductor debe descansar al menos 6 horas antes de iniciar un nuevo turno");
    }

    // 3) Si todo OK, continuar al siguiente middleware/controlador
    next();
  } catch (error) {
    console.error("Error en verifyRestTime:", error);
    res.status(500).json("Error al verificar el tiempo de descanso");
  }
};

module.exports = verifyRestTime;
