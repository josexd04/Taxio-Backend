// src/routes/folios.js
const { Router }         = require("express");
const verifyToken        = require("../utils/verifyToken");
const verifyWorkingTime  = require("../utils/verifyWorkingTime"); // Debe exportar la función directamente
const Driver             = require("../models/Drivers");
const Taxi               = require("../models/Taxis");
const Folio              = require("../models/Folios");
const workingTimeService = require("../services/workingTime.service");

const router = Router();

// ── GET /folios ──────────────────────────────────────────────────────────────
router.get("/", verifyToken, async (req, res) => {
  try {
    const folios = await Folio.find();
    res.json(folios);
  } catch (err) {
    console.error("Error en GET /folios:", err);
    res.status(500).json("Error al obtener folios");
  }
});

// ── POST /folios ─────────────────────────────────────────────────────────────
router.post(
  "/",
  verifyToken,
  verifyWorkingTime,  // middleware que valida horas trabajadas
  async (req, res) => {
    const { taxiNumber, folio, user } = req.body;

    try {
      // 1) Verificar taxi en la fila
      const foundTaxi = await Taxi.findOne({ taxiNumber });
      if (!foundTaxi) {
        return res.status(400).json("El taxi no está en la fila");
      }

      // 2) Cargar conductor para cerrar turno
      const driver = await Driver.findOne({ driverID: foundTaxi.driverID });
      if (!driver) {
        return res.status(400).json("Conductor no encontrado");
      }

      // 3) Crear y guardar el folio
      const newFolio = await new Folio({
        taxiNumber,
        driverID: foundTaxi.driverID,
        folio,
        date: new Date(),
        user,
      }).save();


      // 4) Eliminar taxi de la fila
      await Taxi.deleteOne({ taxiNumber });

      // 5) Responder con el folio creado
      res.json(newFolio);
    } catch (err) {
      console.error("Error en POST /folios:", err);
      res.status(500).json("Error al guardar el folio");
    }
  }
);

module.exports = router;
