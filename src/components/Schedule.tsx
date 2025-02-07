import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useStore } from '../store/useStore';
import { scheduleService } from '../services/schedule/ScheduleService';
import type { ScheduleEntry } from '../models/types';
import { CLASSROOMS } from '../constants/classrooms';

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
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [selectedForActions, setSelectedForActions] = useState<ScheduleEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState<NewScheduleEntry>({
    subject: '',
    professor: '',
    room: CLASSROOMS[0].value,
    dayOfWeek: DAYS[0],
    startTime: '07:00',
    endTime: '08:00',
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await scheduleService.getUserSchedule();
      setSchedules(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  };

  const handleCellClick = (entry: ScheduleEntry | null) => {
    if (entry) {
      console.log('Editing entry:', entry);
      setSelectedForActions(entry);
      setNewEntry({
        subject: entry.subject,
        professor: entry.professor,
        room: entry.room,
        dayOfWeek: Object.entries(dayToEnglish).find(([_, value]) => value === entry.dayOfWeek)?.[0] || DAYS[0],
        startTime: entry.startTime,
        endTime: entry.endTime,
      });
      setShowForm(true);
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      if (!window.confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
        return;
      }

      await scheduleService.deleteScheduleEntry(entryId);
      setSelectedForActions(null);
      setShowForm(false);
      
      // Recargar la lista después de eliminar
      const updatedSchedules = await scheduleService.getUserSchedule();
      setSchedules(updatedSchedules);
    } catch (error) {
      console.error('Error al eliminar:', error);
      setError('Error al eliminar la clase');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para crear un horario');
      return;
    }

    setError(null);

    // Validaciones básicas
    if (!newEntry.subject.trim() || !newEntry.professor.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (!validateTimeRange(newEntry.startTime, newEntry.endTime)) {
      setError('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    try {
      const scheduleData = {
        subject: newEntry.subject.trim(),
        professor: newEntry.professor.trim(),
        room: newEntry.room,
        dayOfWeek: dayToEnglish[newEntry.dayOfWeek],
        startTime: newEntry.startTime,
        endTime: newEntry.endTime,
        semester: user.semester || 1,
        career: user.career || ''
      };

      // Si estamos editando, actualizamos
      if (selectedForActions) {
        console.log('Updating entry:', selectedForActions._id);
        await scheduleService.updateScheduleEntry(selectedForActions._id, scheduleData);
      } else {
        // Validar conflictos solo para nuevas entradas
        const hasConflict = checkTimeConflict(
          newEntry.startTime,
          newEntry.endTime,
          newEntry.dayOfWeek,
          undefined
        );

        if (hasConflict) {
          setError('Ya existe una clase programada en este horario');
          return;
        }

        await scheduleService.createScheduleEntry(scheduleData);
      }

      // Recargar horarios y limpiar formulario
      const updatedSchedules = await scheduleService.getUserSchedule();
      setSchedules(updatedSchedules);
      handleCloseForm();
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error al procesar la solicitud');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedForActions(null);
    setError(null);
    setNewEntry({
      subject: '',
      professor: '',
      room: CLASSROOMS[0].value,
      dayOfWeek: DAYS[0],
      startTime: '07:00',
      endTime: '08:00',
    });
  };

  const renderTimeSlotCell = (day: string, hour: string) => {
    const entry = getClassForTimeSlot(day, hour);
    const isSelected = entry && selectedForActions?._id === entry._id;

    return (
      <td
        key={`${day}-${hour}`}
        className={`border p-2 ${entry ? 'bg-red-100' : ''} ${isSelected ? 'bg-red-200' : ''}`}
        onClick={() => entry && handleCellClick(entry)}
      >
        {entry && (
          <div className="text-sm">
            <div className="font-semibold">{entry.subject}</div>
            <div>{entry.professor}</div>
            <div>{entry.room}</div>
          </div>
        )}
      </td>
    );
  };

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
    console.log('Checking conflicts for:', { newStart, newEnd, day, excludeEntryId });
    
    const conflicts = schedules.filter(entry => {
      console.log('Checking entry:', {
        id: entry._id,
        excludeId: excludeEntryId,
        isExcluded: entry._id === excludeEntryId,
        entryDay: entry.dayOfWeek,
        checkDay: dayToEnglish[day],
        dayMatch: entry.dayOfWeek === dayToEnglish[day]
      });

      // Si estamos editando, excluir la entrada actual
      if (excludeEntryId && entry._id === excludeEntryId) {
        console.log('Excluding entry because it matches current:', entry._id);
        return false;
      }

      // Si el día no coincide, no hay conflicto
      if (entry.dayOfWeek !== dayToEnglish[day]) {
        console.log('No conflict - different day');
        return false;
      }
      
      const existingStart = new Date(`2000-01-01T${entry.startTime}`);
      const existingEnd = new Date(`2000-01-01T${entry.endTime}`);
      const start = new Date(`2000-01-01T${newStart}`);
      const end = new Date(`2000-01-01T${newEnd}`);

      console.log('Time comparison:', {
        existingStart: existingStart.toLocaleTimeString(),
        existingEnd: existingEnd.toLocaleTimeString(),
        newStart: start.toLocaleTimeString(),
        newEnd: end.toLocaleTimeString()
      });

      const hasConflict = (start < existingEnd && end > existingStart);
      if (hasConflict) {
        console.log('Conflict found with:', {
          entryId: entry._id,
          subject: entry.subject,
          time: `${entry.startTime}-${entry.endTime}`
        });
      } else {
        console.log('No time conflict');
      }
      return hasConflict;
    });

    console.log('All conflicts found:', conflicts.map(c => ({
      id: c._id,
      subject: c.subject,
      time: `${c.startTime}-${c.endTime}`
    })));
    
    return conflicts.length > 0;
  };

  const renderDayHeader = (day: string) => (
    <th key={day} className="px-2 py-3 bg-red-50 text-red-800 font-semibold">
      {day}
    </th>
  );

  const renderClassroomOption = (classroom: { value: string; label: string }) => (
    <option key={classroom.value} value={classroom.value}>
      {classroom.label}
    </option>
  );

  const renderDayOption = (day: string) => (
    <option key={day} value={day}>
      {day}
    </option>
  );

  const renderMobileScheduleDay = (day: string) => (
    <div key={day} className="mb-6">
      <h3 className="text-lg font-semibold text-red-800 mb-2">{day}</h3>
      <div className="space-y-2">
        {HOURS.map((hour: string) => {
          const entry = getClassForTimeSlot(day, hour);
          if (!entry) return null;

          return (
            <div
              key={`${day}-${hour}`}
              className="bg-red-100 p-2 rounded-lg cursor-pointer hover:bg-red-200 transition-colors"
              onClick={() => handleCellClick(entry)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-red-800">
                    {entry.subject}
                  </div>
                  <div className="text-sm text-red-600">
                    <div>{entry.professor}</div>
                    <div>{entry.room}</div>
                    <div>
                      {entry.startTime} - {entry.endTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDesktopSchedule = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="px-2 py-3 bg-red-50 text-red-800 font-semibold">
              Hora
            </th>
            {DAYS.map(renderDayHeader)}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour: string) => (
            <tr key={hour}>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {hour}
              </td>
              {DAYS.map(day => renderTimeSlotCell(day, hour))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Mi Horario</h2>
        <button
          onClick={() => {
            setSelectedForActions(null);
            setShowForm(true);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
        >
          <FaPlus /> Agregar Clase
        </button>
      </div>

      {/* Formulario Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {selectedForActions ? 'Editar Clase' : 'Agregar Nueva Clase'}
            </h3>
            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Materia
                  </label>
                  <input
                    type="text"
                    value={newEntry.subject}
                    onChange={(e) => setNewEntry({ ...newEntry, subject: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Profesor
                  </label>
                  <input
                    type="text"
                    value={newEntry.professor}
                    onChange={(e) => setNewEntry({ ...newEntry, professor: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Día
                  </label>
                  <select
                    value={newEntry.dayOfWeek}
                    onChange={(e) => setNewEntry({ ...newEntry, dayOfWeek: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    {DAYS.map(renderDayOption)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hora Inicio
                    </label>
                    <input
                      type="time"
                      value={newEntry.startTime}
                      onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hora Fin
                    </label>
                    <input
                      type="time"
                      value={newEntry.endTime}
                      onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salón
                  </label>
                  <select
                    value={newEntry.room}
                    onChange={(e) => setNewEntry({ ...newEntry, room: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    {CLASSROOMS.map(renderClassroomOption)}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                {selectedForActions && (
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedForActions._id)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {selectedForActions ? 'Guardar Cambios' : 'Crear Clase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div>
        {isLoading ? (
          <div className="text-center py-4">Cargando horario...</div>
        ) : (
          <>
            {/* Vista móvil */}
            <div className="md:hidden">
              {DAYS.map(renderMobileScheduleDay)}
            </div>

            {/* Vista desktop */}
            <div className="hidden md:block">
              {renderDesktopSchedule()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};