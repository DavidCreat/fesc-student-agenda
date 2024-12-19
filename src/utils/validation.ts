import { z } from 'zod';
import { CAREERS } from '../constants/careers';

export const emailSchema = z
  .string()
  .email('Formato de correo inválido')
  .regex(/^[a-zA-Z0-9._%+-]+@fesc\.edu\.co$/, 'Debe ser un correo institucional @fesc.edu.co');

export const userSchema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  career: z.enum(CAREERS as [string, ...string[]], {
    errorMap: () => ({ message: 'Selecciona una carrera válida' }),
  }),
  semester: z.number().min(1).max(10),
  schedule: z.enum(['day', 'night'], {
    errorMap: () => ({ message: 'Selecciona una jornada válida' }),
  }),
  email: emailSchema,
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const scheduleEntrySchema = z.object({
  day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']),
  subject: z.string().min(1, 'La materia es requerida'),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().min(1, 'El salón es requerido'),
}).refine(
  (data) => {
    const start = new Date(`1970-01-01T${data.startTime}`);
    const end = new Date(`1970-01-01T${data.endTime}`);
    return start < end;
  },
  {
    message: 'La hora de inicio debe ser anterior a la hora de finalización',
    path: ['startTime'],
  }
);