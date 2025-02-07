import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({
      message: errors[0] || 'Error de validación',
      errors: errors
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: 'El correo electrónico ya está registrado'
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor'
  });
};