import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(parsedDate)) {
    return 'Hoy';
  }
  
  if (isTomorrow(parsedDate)) {
    return 'Mañana';
  }
  
  return format(parsedDate, 'dd/MM/yyyy', { locale: es });
};

export const formatTime = (time: string): string => {
  return format(parseISO(`1970-01-01T${time}`), 'h:mm a');
};