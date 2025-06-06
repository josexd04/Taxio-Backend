const { Router } = require("express");
const router = Router();
const register = require("../routes/registerUser");
const singin = require("../routes/singin");
const folios = require("../routes/folios");

const taxi = require("../routes/taxi");
const drivers = require("../routes/drivers");
const WorkingTime = require("../models/WorkingTime");

router.get("/", (req, res) => res.send("hello world"));

router.use("/register", register);
router.use("/singin", singin);
router.use("/taxi", taxi);
router.use("/drivers", drivers);
router.use("/folios", folios);
router.use("/workingTime", WorkingTime)

module.exports = router;
