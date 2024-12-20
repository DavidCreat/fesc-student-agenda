import React from 'react';
import { Clock, Book, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Dashboard = () => {
  const store = useStore();
  const tasks = store.tasks || [];
  const schedule = store.schedule || [];

  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);

  const todayTasks = tasks.filter(task => !task.completed);
  const nextDayClasses = schedule.filter(entry => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getDate() === nextDay.getDate() &&
      entryDate.getMonth() === nextDay.getMonth() &&
      entryDate.getFullYear() === nextDay.getFullYear()
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Clock className="text-red-600 mr-2" />
            <h2 className="text-xl font-bold">Tareas de Hoy</h2>
          </div>
          <ul className="space-y-2">
            {todayTasks.length > 0 ? (
              todayTasks.map(task => (
                <li key={task._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => useStore.getState().toggleTaskComplete(task._id)}
                    className="mr-2"
                  />
                  <span>{task.title}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No hay tareas pendientes para hoy</li>
            )}
          </ul>
        </div>

        {/* Tomorrow's Classes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Calendar className="text-red-600 mr-2" />
            <h2 className="text-xl font-bold">Clases de Mañana</h2>
          </div>
          <ul className="space-y-2">
            {nextDayClasses.length > 0 ? (
              nextDayClasses.map(entry => (
                <li key={entry._id} className="flex items-center">
                  <span>{entry.subject}</span>
                  <span className="ml-auto text-sm text-gray-500">
                    {entry.startTime} - {entry.endTime}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No hay clases programadas para mañana</li>
            )}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Book className="text-red-600 mr-2" />
            <h2 className="text-xl font-bold">Recomendaciones</h2>
          </div>
          <div className="text-gray-600">
            <p>Cargando recomendaciones personalizadas...</p>
          </div>
        </div>
      </div>
    </div>
  );
};