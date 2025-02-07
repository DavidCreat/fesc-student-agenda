
import React from 'react';
import { FaChartBar, FaClock, FaCheckCircle, FaBook, FaCalendarAlt, FaDownload } from 'react-icons/fa';

export const Reports: React.FC = () => {
  const mockData = {
    studyTime: {
      total: '45h 30m',
      weekly: '12h 15m',
      daily: '2h 30m',
    },
    tasks: {
      total: 24,
      completed: 18,
      pending: 6,
      completionRate: 75,
    },
    subjects: {
      active: 6,
      performance: [
        { name: 'Matemáticas', grade: 4.5, hours: 15 },
        { name: 'Física', grade: 4.2, hours: 12 },
        { name: 'Programación', grade: 4.8, hours: 18 },
        { name: 'Base de Datos', grade: 4.0, hours: 10 },
        { name: 'Inglés', grade: 4.3, hours: 8 },
        { name: 'Estadística', grade: 3.8, hours: 9 },
      ],
    },
  };

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="text-gray-600 mt-1">Visualiza tu progreso académico</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center">
          <FaDownload className="mr-2" />
          Exportar Reporte
        </button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tiempo de estudio */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 rounded-lg p-3">
              <FaClock className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tiempo Total de Estudio</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.studyTime.total}</p>
              <p className="text-sm text-gray-500">Promedio semanal: {mockData.studyTime.weekly}</p>
            </div>
          </div>
        </div>

        {/* Tareas completadas */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 rounded-lg p-3">
              <FaCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tareas Completadas</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.tasks.completed}/{mockData.tasks.total}</p>
              <p className="text-sm text-gray-500">Tasa de completitud: {mockData.tasks.completionRate}%</p>
            </div>
          </div>
        </div>

        {/* Materias activas */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <FaBook className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Materias Activas</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.subjects.active}</p>
              <p className="text-sm text-gray-500">En el semestre actual</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de rendimiento por materia */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Materia</h2>
        <div className="space-y-4">
          {mockData.subjects.performance.map((subject) => (
            <div key={subject.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                <span className="text-sm text-gray-500">{subject.grade}/5.0</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-red-600 rounded-full"
                  style={{ width: `${(subject.grade / 5) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{subject.hours} horas de estudio</span>
                <span>{((subject.grade / 5) * 100).toFixed(1)}% de rendimiento</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución del tiempo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Horas de estudio por día */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            <FaChartBar className="inline-block mr-2 text-red-600" />
            Horas de Estudio por Día
          </h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div key={day} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-red-100 hover:bg-red-200 transition-colors duration-200 rounded-t"
                  style={{ height: `${Math.random() * 150 + 50}px` }}
                />
                <span className="text-xs font-medium text-gray-600 mt-2">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendario de actividad */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            <FaCalendarAlt className="inline-block mr-2 text-red-600" />
            Calendario de Actividad
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg ${
                  Math.random() > 0.5
                    ? 'bg-red-100 hover:bg-red-200'
                    : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors duration-200`}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-red-100 rounded-sm mr-2" />
              Con actividad
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 rounded-sm mr-2" />
              Sin actividad
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Reports = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Reportes</h2>
      <p className="mt-4">Aquí puedes ver los reportes de tu actividad.</p>
      {/* Add report details here */}
    </div>
  );
}; 
