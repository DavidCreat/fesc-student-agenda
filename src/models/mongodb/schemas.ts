import mongoose from 'mongoose';

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

export const ScheduleEntry = mongoose.model('ScheduleEntry', scheduleEntrySchema);
export const Task = mongoose.model('Task', taskSchema);
export const SessionLog = mongoose.model('SessionLog', sessionLogSchema);