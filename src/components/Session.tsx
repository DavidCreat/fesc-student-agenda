import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FaPlay, FaPause, FaStop, FaClock, FaChartLine } from 'react-icons/fa';

export const Session: React.FC = () => {
  const { sessionStartTime, startSession, endSession } = useStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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

  const handleStop = () => {
    endSession();
    setIsActive(false);
    setElapsedTime(0);
  };

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
              <p className="text-2xl font-bold text-red-600">12:45:30</p>
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
              <p className="text-2xl font-bold text-red-600">02:30:15</p>
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
          {[...Array(5)].map((_, index) => (
            <div key={index} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">Sesión de Estudio #{5 - index}</p>
                <p className="text-sm text-gray-500">
                  {new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-600">02:30:00</p>
                <p className="text-sm text-gray-500">Duración</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
