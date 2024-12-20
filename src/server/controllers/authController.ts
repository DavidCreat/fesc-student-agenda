import mongoose from 'mongoose';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import { User } from '../../models/User';

const generateToken = (id: unknown) => {
  if (id instanceof mongoose.Types.ObjectId || typeof id === 'string') {
    return jwt.sign({ id: id.toString() }, config.jwtSecret, {
      expiresIn: '24h'
    });
  }
  throw new Error('Invalid ID type');
};

export const register = async (req: Request, res: Response) => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El correo ya está registrado'
      });
    }

    // Crear el usuario
    const user = await User.create({
      ...req.body,
      email: req.body.email.toLowerCase() // Normalizar email
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        career: user.career,
        semester: user.semester,
        schedule: user.schedule
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al registrar usuario'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        career: user.career,
        semester: user.semester,
        schedule: user.schedule
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al iniciar sesión'
    });
  }
};