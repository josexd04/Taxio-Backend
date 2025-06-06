// src/services/workingTime.service.js
const WorkingTime = require("../models/WorkingTime");

class WorkingTimeService {
  /**
   * Inicia un nuevo turno para un conductor.
   * @param {Object} driver  Documento Driver, que contiene driver.driverID (string) y driver.name.
   * @returns {Promise<Document>}  El documento WorkingTime guardado.
   */
  async startShift(driver) {
    const now = new Date();
    const shift = new WorkingTime({
      name: driver.name,
      driverID: driver.driverID,
      driverRef: driver._id,    
      shiftStart: now,              
      lastConnection: now
    });
    return shift.save();
  }

  /**
   * Cierra el turno abierto más reciente.
   * Calcula duración, actualiza acumulados y marca la hora de fin.
   * @param {Object} driver
   * @returns {Promise<Document|null>}  El turno cerrado o null si no había turno abierto.
   */
  async endShift(driver) {
    const now = new Date();
    // 1) Busca el turno sin shiftEnd (turno abierto)
    const shift = await WorkingTime
      .findOne({ driverID: driver.driverID, shiftEnd: { $exists: false } })
      .sort({ shiftStart: -1 });

    if (!shift) return null;

    // 2) Calcula horas trabajadas
    const hours = (now - shift.shiftStart) / 1000 / 60 / 60;

    // 3) Actualiza campos
    shift.shiftEnd       = now;
    shift.activeTime     = hours;
    shift.lastConnection = now;
    shift.daysWorked    += 1;
    shift.totalHoursWeek += hours;
    if (hours > 8) shift.overtimeHours += hours - 8;

    return shift.save();
  }

  /**
   * Devuelve el turno actualmente activo (sin cerrar).
   * @param {Object} driver
   * @returns {Promise<Document|null>}
   */
  async getCurrentShift(driver) {
    return WorkingTime
      .findOne({ driverID: driver.driverID, shiftEnd: { $exists: false } })
      .sort({ shiftStart: -1 });
  }

  /**
   * Calcula cuántas horas lleva en el turno actual.
   * @param {Object} driver
   * @returns {Promise<number>}  Horas trabajadas (decimal).
   */
  async getHoursWorked(driver) {
    const shift = await this.getCurrentShift(driver);
    if (!shift) return 0;
    const now = new Date();
    return (now - shift.shiftStart) / 1000 / 60 / 60;
  }

  /**
   * Comprueba si ya descansó al menos 6 h desde el fin del turno anterior.
   * @param {Object} driver
   * @returns {Promise<boolean>}
   */
  async canStartShift(driver) {
    const lastShift = await WorkingTime
      .findOne({ driverID: driver.driverID, shiftEnd: { $exists: true } })
      .sort({ shiftEnd: -1 });

    if (!lastShift) return true;  // nunca trabajó antes
    const now = new Date();
    const restHours = (now - lastShift.shiftEnd) / 1000 / 60 / 60;
    return restHours >= 6;
  }

  /**
   * Verifica que el turno activo esté entre 12 y 15 horas.
   * @param {Object} driver
   * @returns {Promise<boolean>}
   */
  async isWithinAllowedShiftRange(driver) {
    const hours = await this.getHoursWorked(driver);
    return hours >= 12 && hours <= 15;
  }
}

module.exports = new WorkingTimeService();
