
const Driver = require("../models/Drivers");


const verifyWorkingTime = async (req, res, next) => {
    try {
      const { taxiNumber } = req.body;
  
      const now = new Date();
      const foundDriver = await Driver.findOne({ taxiNumber });

      if (!foundDriver || !foundDriver.status)
        return res.status(400).json("El conductor no está activo o el taxi no existe");

      if (!foundDriver) {
        return res.status(400).json("Conductor no registrado");
      }
  
      if (foundDriver && foundDriver.activeTime) {
        const activeTimeDate = new Date(foundDriver.activeTime);
        const timeOnShift = (now - activeTimeDate) / (1000 * 60 * 60);
        if (timeOnShift > 15) {
          console.log(timeOnShift);
          
          return res
            .status(400)
            .json("El conductor ha excedido las 15 horas de trabajo");
   
        }
      }
  
      next();
    } catch (error) {
      res.status(400).json("Error: " + error);
      console.log(error);
    }
  };
  
  module.exports = verifyWorkingTime;
  