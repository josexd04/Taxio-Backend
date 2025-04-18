const verifyRestTime = require("../utils/verifyRestTime");
const verifyToken = require("../utils/verifyToken");
const Driver = require("../models/Drivers");
const Taxi = require("../models/Taxis");
const Folio = require("../models/Folios");

const { Router } = require("express");
const verifyWorkingTime = require("../utils/verifyWorkingTime");
const router = Router();

// get folios
router.get("/", verifyToken, async (req, res) => {
  try {
    const folios = await Folio.find();
    res.json(folios);
  } catch (error) {
    res.status(400).json("Error: " + error);
    console.log(error);
  }
});

// post folio

router.post("/", verifyToken, verifyWorkingTime, async (req, res) => {
  const { taxiNumber, driverID, folio, date, user } = req.body;

  const foundTaxi = await Taxi.findOne({ taxiNumber });

  if (!foundTaxi) {
    console.log("taxi no found");
    return res.status(400).json("El taxi no está formado");
  }

  const folioData = new Folio({
    taxiNumber,
    driverID: foundTaxi.driverID,
    folio,
    date: new Date(),
    user,
  });

  try {
    const newFolio = await folioData.save();
    const taxi = await Taxi.findOneAndDelete({ taxiNumber });
    res.json(newFolio);
    console.log("Folio guardado");
  } catch (error) {
    res.status(400).json("Error: " + error);
    console.log(error);
  }
});

module.exports = router;
