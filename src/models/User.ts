import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import chalk from 'chalk';
import { CAREERS } from '../constants/careers.js';

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
    lowercase: true,
    trim: true,
    match: [/^est_[a-z0-9_]+@fesc\.edu\.co$/, 'El correo debe tener el formato est_nombre_apellido@fesc.edu.co']
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

// Create a unique index on the email field
userSchema.index({ email: 1 }, { unique: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Use the same bcrypt version ($2a$) as the stored hash
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword: string) {
  try {
    if (!this.password) {
      console.error(chalk.red('└── ❌ No se encontró contraseña para el usuario'));
      return false;
    }
    
    console.log(chalk.yellow('├── 🔑 Verificando contraseña'));
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    
    if (isMatch) {
      console.log(chalk.green('├── ✅ Contraseña correcta'));
    } else {
      console.log(chalk.red('├── ❌ Contraseña incorrecta'));
    }
    
    return isMatch;
  } catch (error) {
    console.error(chalk.red('├── ❌ Error al comparar contraseñas:'), error);
    throw error;
  }
};

export const User = mongoose.model<IUser>('User', userSchema);