import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { CAREERS } from '../constants/careers';

interface IUser extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
  career: typeof CAREERS[number];
  semester: number;
  schedule: 'day' | 'night';
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  fullName: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@fesc\.edu\.co$/, 'Debe ser un correo institucional @fesc.edu.co']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    select: false
  },
  career: {
    type: String,
    required: [true, 'La carrera es requerida'],
    enum: {
      values: CAREERS,
      message: 'Carrera no válida'
    }
  },
  semester: {
    type: Number,
    required: [true, 'El semestre es requerido'],
    min: [1, 'Semestre mínimo es 1'],
    max: [10, 'Semestre máximo es 10']
  },
  schedule: {
    type: String,
    required: [true, 'La jornada es requerida'],
    enum: {
      values: ['day', 'night'],
      message: 'Jornada no válida'
    }
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);