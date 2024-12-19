export const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Lunes' },
  { value: 'tuesday', label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday', label: 'Jueves' },
  { value: 'friday', label: 'Viernes' },
  { value: 'saturday', label: 'Sábado' },
] as const;

export const SCHEDULE_OPTIONS = [
  { value: 'day', label: 'Diurna' },
  { value: 'night', label: 'Nocturna' },
] as const;

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
] as const;

export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes