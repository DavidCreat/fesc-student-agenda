import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@fesc\.edu\.co$/
  },
  password: { type: String, required: true },
  career: { type: String, required: true },
  semester: { type: Number, required: true, min: 1, max: 10 },
  schedule: { type: String, required: true, enum: ['day', 'night'] },
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'users' // Explicitly specify the collection name
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);