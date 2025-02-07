import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useScheduleActions } from '../hooks/schedule/useScheduleActions';
import { FaPlus, FaClock, FaMapMarkerAlt, FaChalkboardTeacher } from 'react-icons/fa';
import { ScheduleEntry } from '../models/types';
import { CLASSROOMS } from '../constants/classrooms';
import { CreateScheduleData } from '../services/schedule/ScheduleService';
import { scheduleService } from '../services/schedule/ScheduleService';

const HOURS = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const dayToEnglish: Record<string, ScheduleEntry['dayOfWeek']> = {
  'Lunes': 'monday',
  'Martes': 'tuesday',
  'Miércoles': 'wednesday',
  'Jueves': 'thursday',
  'Viernes': 'friday',
  'Sábado': 'saturday'
};

interface NewScheduleEntry {
  subject: string;
  professor: string;
  room: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export const Schedule: React.FC = () => {
  const user = useStore((state) => state.user);
  const schedules = useStore((state) => state.schedules) || [];
  const setSchedules = useStore((state) => state.setSchedules);
  const { createSchedule } = useScheduleActions();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newEntry, setNewEntry] = useState<NewScheduleEntry>({
    subject: '',
    professor: '',
    room: CLASSROOMS[0].value,
    dayOfWeek: DAYS[0],
    startTime: '07:00',
    endTime: '08:00',
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<ScheduleEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Cargar horarios al iniciar y cuando cambie el usuario
  useEffect(() => {
    const loadSchedules = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const data = await scheduleService.getUserSchedule();
        console.log('Horarios cargados:', data);
        setSchedules(data);
      } catch (error) {
        console.error('Error al cargar horarios:', error);
        setError('Error al cargar los horarios');
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedules();
  }, [user, setSchedules]);

  const getClassForTimeSlot = (day: string, hour: string) => {
    const entry = schedules?.find(schedule => {
      const scheduleHour = schedule.startTime.split(':')[0];
      const currentHour = hour.split(':')[0];
      return schedule.dayOfWeek === dayToEnglish[day] && scheduleHour === currentHour;
    });
    
    if (entry) {
      console.log(`Encontrada entrada para ${day} ${hour}:`, entry);
    }
    return entry;
  };

  const validateTimeRange = (startTime: string, endTime: string): boolean => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return start < end;
  };

  const checkTimeConflict = (newStart: string, newEnd: string, day: string, excludeEntryId?: string): boolean => {
    return schedules.some(entry => {
      // Si estamos editando, excluir la entrada actual del chequeo de conflictos
      if (excludeEntryId && entry._id === excludeEntryId) {
        return false;
      }

      if (entry.dayOfWeek !== dayToEnglish[day]) return false;
      
      const existingStart = new Date(`2000-01-01T${entry.startTime}`);
      const existingEnd = new Date(`2000-01-01T${entry.endTime}`);
      const start = new Date(`2000-01-01T${newStart}`);
      const end = new Date(`2000-01-01T${newEnd}`);

      return (start < existingEnd && end > existingStart);
    });
  };

  const handleDelete = async (entryId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
      return;
    }

    try {
      setError(null);
      await scheduleService.deleteScheduleEntry(entryId);
      const data = await scheduleService.getUserSchedule();
      setSchedules(data);
    } catch (error) {
      console.error('Error al eliminar el horario:', error);
      setError('Error al eliminar el horario');
    }
  };

  const handleEdit = (entry: ScheduleEntry) => {
    setSelectedEntry(entry);
    setIsEditing(true);
    setNewEntry({
      subject: entry.subject,
      professor: entry.professor,
      room: entry.room,
      dayOfWeek: Object.entries(dayToEnglish).find(([_, value]) => value === entry.dayOfWeek)?.[0] || DAYS[0],
      startTime: entry.startTime,
      endTime: entry.endTime,
    });
    setShowForm(true);
  };

  const handleUpdate = async (entryId: string) => {
    if (!user) {
      setError('Debes iniciar sesión para actualizar el horario');
      return;
    }

    try {
      setError(null);
      const scheduleData = {
        subject: newEntry.subject.trim(),
        professor: newEntry.professor.trim(),
        room: newEntry.room,
        dayOfWeek: dayToEnglish[newEntry.dayOfWeek],
        startTime: newEntry.startTime,
        endTime: newEntry.endTime,
      };

      await scheduleService.updateScheduleEntry(entryId, scheduleData);
      const data = await scheduleService.getUserSchedule();
      setSchedules(data);
      
      setShowForm(false);
      setIsEditing(false);
      setSelectedEntry(null);
      setNewEntry({
        subject: '',
        professor: '',
        room: CLASSROOMS[0].value,
        dayOfWeek: DAYS[0],
        startTime: '07:00',
        endTime: '08:00',
      });
    } catch (error) {
      console.error('Error al actualizar el horario:', error);
      setError('Error al actualizar el horario');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para crear un horario');
      return;
    }
    
    setError(null);

    // Validar campos obligatorios
    if (!newEntry.subject.trim()) {
      setError('El nombre de la materia es obligatorio');
      return;
    }

    if (!newEntry.professor.trim()) {
      setError('El nombre del profesor es obligatorio');
      return;
    }

    // Validar el rango de tiempo
    if (!validateTimeRange(newEntry.startTime, newEntry.endTime)) {
      setError('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    // Validar conflictos de horario
    const hasConflict = checkTimeConflict(
      newEntry.startTime, 
      newEntry.endTime, 
      newEntry.dayOfWeek,
      isEditing ? selectedEntry?._id : undefined
    );

    if (hasConflict) {
      setError('Ya existe una clase programada en este horario');
      return;
    }
    
    try {
      const scheduleData: CreateScheduleData = {
        subject: newEntry.subject.trim(),
        professor: newEntry.professor.trim(),
        room: newEntry.room,
        dayOfWeek: dayToEnglish[newEntry.dayOfWeek],
        startTime: newEntry.startTime,
        endTime: newEntry.endTime,
        semester: user.semester || 1,
        career: user.career || ''
      };
      
      if (isEditing && selectedEntry) {
        await handleUpdate(selectedEntry._id);
      } else {
        await createSchedule(scheduleData);
        const data = await scheduleService.getUserSchedule();
        setSchedules(data);
      }
      
      setShowForm(false);
      setNewEntry({
        subject: '',
        professor: '',
        room: CLASSROOMS[0].value,
        dayOfWeek: DAYS[0],
        startTime: '07:00',
        endTime: '08:00',
      });
    } catch (error) {
      console.error('Error detallado al crear el horario:', error);
      if (error instanceof Error) {
        setError(`Error al crear el horario: ${error.message}`);
      } else {
        setError('Error al crear el horario. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Horario de Clases</h1>
          <p className="text-gray-600 mt-1">Gestiona tu horario académico</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setError(null);
            setIsEditing(false);
            setSelectedEntry(null);
            setNewEntry({
              subject: '',
              professor: '',
              room: CLASSROOMS[0].value,
              dayOfWeek: DAYS[0],
              startTime: '07:00',
              endTime: '08:00',
            });
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
        >
          <FaPlus className="mr-2" />
          {showForm ? 'Cerrar Formulario' : 'Agregar Clase'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Editar Clase' : 'Nueva Clase'}</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Materia</label>
                <input
                  type="text"
                  value={newEntry.subject}
                  onChange={(e) => setNewEntry({ ...newEntry, subject: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Día</label>
                <select
                  value={newEntry.dayOfWeek}
                  onChange={(e) => setNewEntry({ ...newEntry, dayOfWeek: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  {DAYS.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hora de inicio</label>
                <input
                  type="time"
                  value={newEntry.startTime}
                  onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hora de fin</label>
                <input
                  type="time"
                  value={newEntry.endTime}
                  onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profesor</label>
                <input
                  type="text"
                  value={newEntry.professor}
                  onChange={(e) => setNewEntry({ ...newEntry, professor: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aula</label>
                <select
                  value={newEntry.room}
                  onChange={(e) => setNewEntry({ ...newEntry, room: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  {CLASSROOMS.map(classroom => (
                    <option key={classroom.value} value={classroom.value}>
                      {classroom.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                  setIsEditing(false);
                  setSelectedEntry(null);
                  setNewEntry({
                    subject: '',
                    professor: '',
                    room: CLASSROOMS[0].value,
                    dayOfWeek: DAYS[0],
                    startTime: '07:00',
                    endTime: '08:00',
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                {isEditing ? 'Guardar Cambios' : 'Guardar Clase'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cuadrícula de horario */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {isLoading ? (
          <div className="p-4 text-center">Cargando horarios...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
                {DAYS.map(day => (
                  <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {HOURS.map(hour => (
                <tr key={hour}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hour}
                  </td>
                  {DAYS.map(day => {
                    const entry = getClassForTimeSlot(day, hour);

                    return (
                      <td key={`${day}-${hour}`} className="px-6 py-4 whitespace-nowrap">
                        {entry && (
                          <div className="bg-red-100 p-2 rounded-lg">
                            <div className="font-medium text-red-800">{entry.subject}</div>
                            <div className="text-sm text-red-600">
                              <div className="flex items-center">
                                <FaChalkboardTeacher className="mr-1" />
                                {entry.professor}
                              </div>
                              <div className="flex items-center">
                                <FaMapMarkerAlt className="mr-1" />
                                {entry.room}
                              </div>
                              <div className="flex items-center">
                                <FaClock className="mr-1" />
                                {entry.startTime} - {entry.endTime}
                              </div>
                            </div>
                            <div className="mt-2 flex space-x-2">
                              <button
                                onClick={() => handleEdit(entry)}
                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(entry._id)}
                                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};