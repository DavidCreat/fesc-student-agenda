import mongoose from 'mongoose';

const scheduleEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  subject: {
    type: String,
    required: true
  },
  dayOfWeek: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'El formato de hora debe ser HH:MM (24h)'
    }
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'El formato de hora debe ser HH:MM (24h)'
    }
  },
  room: {
    type: String,
    required: true
  },
  professor: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para validar solapamiento de horarios
scheduleEntrySchema.pre('save', async function(next) {
  const doc = this;
  
  // Convertir las horas a minutos para facilitar la comparación
  const startMinutes = timeToMinutes(doc.startTime);
  const endMinutes = timeToMinutes(doc.endTime);
  
  // Validar que la hora de inicio sea menor que la hora de fin
  if (startMinutes >= endMinutes) {
    throw new Error('La hora de inicio debe ser menor que la hora de fin');
  }

  // Buscar horarios existentes para el mismo usuario y día
  const overlappingSchedule = await mongoose.model('ScheduleEntry').findOne({
    userId: doc.userId,
    dayOfWeek: doc.dayOfWeek,
    _id: { $ne: doc._id }, // Excluir el documento actual en caso de actualización
    $or: [
      // Caso 1: La nueva clase comienza durante otra clase
      {
        startTime: { $lte: doc.startTime },
        endTime: { $gt: doc.startTime }
      },
      // Caso 2: La nueva clase termina durante otra clase
      {
        startTime: { $lt: doc.endTime },
        endTime: { $gte: doc.endTime }
      },
      // Caso 3: La nueva clase engloba completamente otra clase
      {
        startTime: { $gte: doc.startTime },
        endTime: { $lte: doc.endTime }
      }
    ]
  });

  if (overlappingSchedule) {
    throw new Error(`Ya existe una clase programada en este horario: ${overlappingSchedule.subject} (${overlappingSchedule.startTime} - ${overlappingSchedule.endTime})`);
  }

  next();
});

// Función auxiliar para convertir hora (HH:MM) a minutos
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export const ScheduleEntry = mongoose.model('ScheduleEntry', scheduleEntrySchema);