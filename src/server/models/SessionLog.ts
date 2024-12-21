import mongoose from 'mongoose';

const sessionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  duration: Number,
  activity: {
    type: String,
    required: true
  }
});

export const SessionLog = mongoose.model('SessionLog', sessionLogSchema); 