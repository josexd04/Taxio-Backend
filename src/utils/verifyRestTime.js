const Driver = require("../models/Drivers");

const verifyRestTime = async (req, res, next) => {
  try {
    const { taxiNumber, driverID } = req.body;

    const now = new Date();
    const foundDriver = await Driver.findOne({ driverID });


    if (foundDriver.lastConnection) {
      const lastConnectionDate = new Date(foundDriver.lastConnection);
      const timeSinceLastShift = (now - lastConnectionDate) / (1000 * 60 * 60);
      if (timeSinceLastShift < 6) {
        return res
          .status(400)
          .json("El conductor debe descansar al menos 6 horas");
      }
    }

    next();
  } catch (error) {
    res.status(400).json("Error: " + error);
    console.log("Error en middleware: " + error);
  }
};

module.exports = verifyRestTime;
