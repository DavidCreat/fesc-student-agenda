import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  career: { type: String, required: true, enum: [
    'Diseño Gráfico',
    'Diseño de Modas',
    'Admón. Turística y Hotelera',
    'Ingeniería de Software',
    'Negocios Internacionales',
    'Admón. Financiera',
    'Negocios Distancia',
    'Logística Empresarial'
  ]},
  semester: { type: Number, required: true, min: 1, max: 10 },
  schedule: { type: String, required: true, enum: ['day', 'night'] },
  email: { 
    type: String, 
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@fesc\.edu\.co$/,
    unique: true
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

const scheduleEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, required: true },
  subject: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  classroom: { type: String, required: true }
});

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
});

const sessionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number } // in minutes
});

export const User = mongoose.model('User', userSchema);
export const ScheduleEntry = mongoose.model('ScheduleEntry', scheduleEntrySchema);
export const Task = mongoose.model('Task', taskSchema);
export const SessionLog = mongoose.model('SessionLog', sessionLogSchema);