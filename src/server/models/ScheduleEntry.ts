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
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  room: String,
  professor: String
});

export const ScheduleEntry = mongoose.model('ScheduleEntry', scheduleEntrySchema); 