import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FaPlay, FaPause, FaStop, FaClock, FaChartLine } from 'react-icons/fa';
import { sessionService } from '../services/session/SessionService';

interface SessionData {
  _id: string;
  startTime: string;
  endTime: string;
  duration: number;
  activity: string;
}

export const Session: React.FC = () => {
  const { sessionStartTime, startSession, endSession } = useStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [activity, setActivity] = useState('');
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (sessionStartTime && isActive) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [sessionStartTime, isActive]);

  const fetchSessions = async () => {
    try {
      const data = await sessionService.getUserSessions();
      setSessions(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateTotalTimeThisWeek = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return sessions
      .filter(session => new Date(session.startTime) >= oneWeekAgo)
      .reduce((total, session) => total + session.duration, 0);
  };

  const calculateDailyAverage = () => {
    const totalTime = calculateTotalTimeThisWeek();
    return Math.floor(totalTime / 7);
  };

  const handleStart = () => {
    startSession();
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleResume = () => {
    setIsActive(true);
  };

  const handleStop = async () => {
    if (!sessionStartTime) return;

    try {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - sessionStartTime) / 1000);

      await sessionService.createSessionLog({
        startTime: new Date(sessionStartTime),
        endTime,
        duration,
        activity: activity || 'Sesión de estudio'
      });

      endSession();
      setIsActive(false);
      setElapsedTime(0);
      setActivity('');
      fetchSessions(); // Actualizar la lista de sesiones
    } catch (error) {
      console.error('Error al guardar la sesión:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sesión de Estudio</h1>
        <p className="text-gray-600">Registra y monitorea tu tiempo de estudio</p>
      </div>

      {/* Temporizador */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center">
          <div className="text-6xl font-mono font-bold text-red-600 mb-8">
            {formatTime(elapsedTime)}
          </div>

          {/* Campo de actividad */}
          {sessionStartTime && (
            <div className="w-full max-w-md mb-6">
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="¿Qué estás estudiando?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          <div className="flex space-x-4">
            {!sessionStartTime ? (
              <button
                onClick={handleStart}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <FaPlay className="mr-2" />
                Iniciar Sesión
              </button>
            ) : (
              <>
                {isActive ? (
                  <button
                    onClick={handlePause}
                    className="flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                  >
                    <FaPause className="mr-2" />
                    Pausar
                  </button>
                ) : (
                  <button
                    onClick={handleResume}
                    className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    <FaPlay className="mr-2" />
                    Continuar
                  </button>
                )}
                <button
                  onClick={handleStop}
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <FaStop className="mr-2" />
                  Finalizar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 rounded-lg p-3">
              <FaClock className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tiempo Total de Estudio</h3>
              <p className="text-2xl font-bold text-red-600">{formatTime(calculateTotalTimeThisWeek())}</p>
              <p className="text-sm text-gray-500">Esta semana</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 rounded-lg p-3">
              <FaChartLine className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Promedio Diario</h3>
              <p className="text-2xl font-bold text-red-600">{formatTime(calculateDailyAverage())}</p>
              <p className="text-sm text-gray-500">Últimos 7 días</p>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de Sesiones */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Sesiones</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {sessions.slice(0, 5).map((session) => (
            <div key={session._id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{session.activity}</p>
                <p className="text-sm text-gray-500">
                  {new Date(session.startTime).toLocaleDateString('es-CO')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-600">{formatTime(session.duration)}</p>
                <p className="text-sm text-gray-500">Duración</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
