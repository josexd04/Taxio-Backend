const { Router } = require("express");
const verifyToken = require("../utils/verifyToken");
const verifyWorkingTime = require("../utils/verifyWorkingTime");
const Taxi = require("../models/Taxis");
const Driver = require("../models/Drivers");

const router = Router();

// Route to get all taxis
router.get("/", verifyToken, (req, res) => {
  Taxi.find()
    .then((taxis) => res.json(taxis))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Route to get a taxi by ID

router.get("/:_id", verifyToken, async (req, res) => {
  const { _id } = req.params;

  try {
    const taxi = await Taxi.findById(_id);
    if (!taxi) return res.status(404).json("Taxi no encontrado");

    res.json(taxi);
  } catch (error) {
    res.status(400).json("Error: " + error);
    console.log(error);
  }
});

// Route to add a new taxi
router.post("/add", verifyToken, verifyWorkingTime, async (req, res) => {
  const { taxiNumber, driverID, arrivalTime, arrivalFolio, position } =
    req.body;

  try {
    const foundTaxi = await Taxi.findOne({ taxiNumber });

    if (foundTaxi) return res.status(400).json("El taxi ya está formado");

    const foundDriver = await Driver.findOne({ taxiNumber });

    if (!foundDriver) return res.status(400).json("Conductor no registrado");

    const newTaxi = new Taxi({
      taxiNumber,
      driverID: foundDriver.driverID,
      arrivalTime: new Date(),
      arrivalFolio,
      position: "parking",
    });
    await newTaxi.save();

    res.status(200).json("Taxi agregado con éxito: " + newTaxi);
  } catch (error) {
    res.status(400).json("Error: " + error);
    console.log(error);
  }
});

// Delete a taxi
router.delete("/:_id", verifyToken, async (req, res) => {
  const { _id } = req.params;
  console.log(`Attempting to delete taxi with ID: ${_id}`);

  try {
    const taxi = await Taxi.findOneAndDelete({ _id });
    if (!taxi) return res.status(404).json("Taxi no encontrado");

    res.json("Taxi eliminado con éxito");
  } catch (error) {
    res.status(400).json("Error: " + error);
    console.log(error);
  }
});

// update position

router.put("/update-position", verifyToken, async (req, res) => {
  const { driverID, position } = req.body;

  if (!driverID | !position)
    return res.status(400).json("Debe proporcionar driverID y position");

  try {
    const updateTaxi = await Taxi.findOneAndUpdate(
      { driverID: driverID },
      { position: position },
      { new: true }
    );

    if (!updateTaxi) return res.status(404).json("Taxi no encontrado");

    res.status(200).json("posición actualizada");
  } catch (error) {
    res.status(400).json("Error: " + error);
    console.log(error);
  }
});

module.exports = router;
