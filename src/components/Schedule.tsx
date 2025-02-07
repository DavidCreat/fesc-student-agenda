import React, { Fragment, useState } from 'react';
import { useStore } from '../store/useStore';
import { useScheduleActions } from '../hooks/schedule/useScheduleActions';

import { FaPlus, FaClock, FaMapMarkerAlt, FaChalkboardTeacher } from 'react-icons/fa';
import { ScheduleEntry } from '../models/types';

import { useEffect } from 'react';


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
  const { createSchedule } = useScheduleActions();
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState<NewScheduleEntry>({
    subject: '',
    professor: '',
    room: '',
    dayOfWeek: DAYS[0],
    startTime: '07:00',
    endTime: '08:00',
  });

export const Schedule = () => {
  const schedules = useStore((state) => state.schedules) || [];
  const { getSchedule } = useScheduleActions();

  useEffect(() => {
    getSchedule().catch(console.error);
  }, []);


  const getClassForTimeSlot = (day: string, hour: string) => {
    return schedules.find(entry => {
      const entryStartHour = entry.startTime.split(':')[0];

      return entry.dayOfWeek === dayToEnglish[day] && 

      return entry.dayOfWeek.toLowerCase() === day.toLowerCase() && 

             entryStartHour === hour.split(':')[0];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const scheduleEntry: ScheduleEntry = {
        _id: '', // Será generado por el backend
        userId: user.id,
        subject: newEntry.subject,
        professor: newEntry.professor,
        room: newEntry.room,
        dayOfWeek: dayToEnglish[newEntry.dayOfWeek],
        startTime: newEntry.startTime,
        endTime: newEntry.endTime,
        semester: user.semester,
        career: user.career
      };
      
      await createSchedule(scheduleEntry);
      setShowForm(false);
      setNewEntry({
        subject: '',
        professor: '',
        room: '',
        dayOfWeek: DAYS[0],
        startTime: '07:00',
        endTime: '08:00',
      });
    } catch (error) {
      console.error('Error al crear el horario:', error);
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
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
        >
          <FaPlus className="mr-2" />
          Agregar Clase
        </button>
      </div>

      {/* Formulario para agregar clase */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Nueva Clase</h2>
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
                <label className="block text-sm font-medium text-gray-700">Salón</label>
                <input
                  type="text"
                  value={newEntry.room}
                  onChange={(e) => setNewEntry({ ...newEntry, room: e.target.value })}
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
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Guardar Clase
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Horario */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-7 gap-1">
              {/* Header con las horas */}
              <div className="bg-gray-100 p-3 text-sm font-semibold text-center rounded-tl-lg">
                Hora
              </div>
              {/* Headers con los días */}
              {DAYS.map((day, index) => (
                <div
                  key={day}
                  className={`bg-gray-100 p-3 text-sm font-semibold text-center ${
                    index === DAYS.length - 1 ? 'rounded-tr-lg' : ''
                  }`}
                >
                  {day}
                </div>
              ))}

              {/* Celdas del horario */}
              {HOURS.map((hour, hourIndex) => (
                <Fragment key={hour}>
                  {/* Columna de hora */}
                  <div className={`border p-3 text-sm text-center bg-gray-50 ${
                    hourIndex === HOURS.length - 1 ? 'rounded-bl-lg' : ''
                  }`}>
                    {hour}
                  </div>
                  {/* Celdas para cada día */}
                  {DAYS.map((day, dayIndex) => {
                    const classEntry = getClassForTimeSlot(day, hour);
                    const isLastRow = hourIndex === HOURS.length - 1;
                    const isLastColumn = dayIndex === DAYS.length - 1;

                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={`border p-2 ${
                          classEntry ? 'bg-red-50' : 'hover:bg-gray-50'
                        } ${
                          isLastRow && isLastColumn ? 'rounded-br-lg' : ''
                        }`}
                      >
                        {classEntry && (
                          <div className="space-y-1">
                            <div className="font-semibold text-red-600 text-sm">
                              {classEntry.subject}
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <FaClock className="mr-1" />
                              {classEntry.startTime} - {classEntry.endTime}
                            </div>
                            {classEntry.room && (
                              <div className="flex items-center text-xs text-gray-500">
                                <FaMapMarkerAlt className="mr-1" />
                                {classEntry.room}
                              </div>
                            )}
                            {classEntry.professor && (
                              <div className="flex items-center text-xs text-gray-500">
                                <FaChalkboardTeacher className="mr-1" />
                                {classEntry.professor}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};