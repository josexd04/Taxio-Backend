const { Schema, model, Types } = require("mongoose")

const workingTimeSchema = new Schema({
  name: { type: String, required: true },
  driverID: { type: Types.ObjectId, ref: "Driver", required: true },

  // Tiempos puntuales
  lastConnection: { type: Date },          // Fecha y hora de última actividad
  weekConnection: { type: Date },          // Última conexión semanal (si aplica)

  // Turnos activos
  shiftStart: { type: Date },              // Inicio del turno actual
  shiftEnd: { type: Date },                // Fin del turno (si ya cerró)
  activeTime: { type: Number, default: 0 },

  // Horario planificado
  workSchedule: [{
    dayOfWeek: { type: String, enum: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
    startTime: { type: String },           // p.ej. "08:00"
    endTime: { type: String }              // p.ej. "14:00"
  }],

  // Resumen de carga de trabajo
  daysWorked: { type: Number, default: 0 },// Total de días trabajados en el periodo
  totalHoursWeek: { type: Number, default: 0 },   // Horas totales trabajadas en la semana
  overtimeHours: { type: Number, default: 0 },    // Horas extra

  // Descansos
  breaks: [{
    breakStart: { type: Date },
    breakEnd:   { type: Date },
    reason:     { type: String }
  }],

  // Descanso semanal
  dayOff: { type: String, enum: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },

  // Auditoría
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Índices para acelerar consultas
workingTimeSchema.index({ driverID: 1, shiftStart: -1 })

module.exports = model("WorkingTime", workingTimeSchema)
