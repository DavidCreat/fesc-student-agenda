import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Error de validación',
      errors: Object.values(err.errors).map((e: any) => e.message)
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