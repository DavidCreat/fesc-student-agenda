import React, { useEffect, useState } from 'react';
import { FaChartBar, FaClock, FaCheckCircle, FaBook, FaDownload } from 'react-icons/fa';
import { reportsService, ReportData } from '../services/reports/ReportsService';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export const Reports: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      if (!user) {
        console.log('No hay usuario autenticado, redirigiendo a login');
        navigate('/login');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No se encontró token, redirigiendo a login');
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log('Iniciando carga de reportes...');
        const data = await reportsService.getReports();
        console.log('Reportes cargados exitosamente:', data);
        setReportData(data);
      } catch (error: any) {
        console.error('Error al cargar reportes:', error);
        if (error.message.toLowerCase().includes('no autorizado')) {
          console.log('Error de autorización, redirigiendo a login');
          navigate('/login');
        } else {
          setError(error.message || 'Error al cargar los reportes');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
      </div>
    );
  }

  if (!reportData) {
    return null;
  }

  const handleExportReport = async () => {
    try {
      const blob = await reportsService.exportReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte-academico.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar el reporte:', error);
      setError('Error al exportar el reporte');
    }
  };

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="text-gray-600 mt-1">Visualiza tu progreso académico</p>
        </div>
        <button 
          onClick={handleExportReport}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
        >
          <FaDownload className="mr-2" />
          Exportar Reporte
        </button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sesiones */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 rounded-lg p-3">
              <FaClock className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sesiones Totales</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.sessions.totalSessions}</p>
              <p className="text-sm text-gray-500">
                Última sesión: {new Date(reportData.sessions.lastSession).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tareas */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 rounded-lg p-3">
              <FaCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tareas</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.tasks.completed}/{reportData.tasks.total}
              </p>
              <p className="text-sm text-gray-500">
                Pendientes: {reportData.tasks.pending} | Vencidas: {reportData.tasks.overdue}
              </p>
            </div>
          </div>
        </div>

        {/* Clases */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <FaBook className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Clases Registradas</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.schedule.totalClasses}</p>
              <p className="text-sm text-gray-500">
                Aula más frecuente: {reportData.schedule.mostFrequentRoom}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribución de clases por día */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <FaChartBar className="inline-block mr-2 text-red-600" />
          Clases por Día
        </h2>
        <div className="h-64 flex items-end justify-between space-x-2">
          {Object.entries(reportData.schedule.classesPerDay).map(([day, count]) => (
            <div key={day} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-red-100 hover:bg-red-200 transition-colors duration-200 rounded-t"
                style={{ height: `${(count / Math.max(...Object.values(reportData.schedule.classesPerDay))) * 200}px` }}
              />
              <span className="text-xs font-medium text-gray-600 mt-2">{day}</span>
              <span className="text-xs text-gray-500">{count} clases</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};