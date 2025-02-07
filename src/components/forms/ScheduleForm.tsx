import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from '../../store/useStore';
import { CLASSROOMS } from '../../constants/classrooms';

interface ScheduleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const daysOfWeek = [
  { value: 'monday', label: 'Lunes' },
  { value: 'tuesday', label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday', label: 'Jueves' },
  { value: 'friday', label: 'Viernes' },
  { value: 'saturday', label: 'Sábado' }
];

export const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSuccess, onCancel }) => {
  const [subject, setSubject] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState(CLASSROOMS[0].value);
  const [professor, setProfessor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useStore((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_FRONTEND_URL?.replace('5173', '5000') || 'http://localhost:5000';
      
      await axios.post(
        `${baseUrl}/api/schedule`,
        {
          subject,
          dayOfWeek,
          startTime,
          endTime,
          room,
          professor,
          semester: user?.semester || 1,
          studentId: user?._id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      onSuccess();
    } catch (error: any) {
      console.error('Error creating schedule entry:', error);
      setError(error.response?.data?.message || 'Error al crear el horario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Materia
        </label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
          Día de la Semana
        </label>
        <select
          id="dayOfWeek"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          required
        >
          {daysOfWeek.map(day => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Hora de inicio
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            required
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            Hora de fin
          </label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="room" className="block text-sm font-medium text-gray-700">
          Salón
        </label>
        <select
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          required
        >
          {CLASSROOMS.map(classroom => (
            <option key={classroom.value} value={classroom.value}>
              {classroom.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="professor" className="block text-sm font-medium text-gray-700">
          Profesor
        </label>
        <input
          type="text"
          id="professor"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          required
          placeholder="Nombre del profesor"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Horario'}
        </button>
      </div>
    </form>
  );
};
