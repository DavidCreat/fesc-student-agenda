import React from 'react';
import { Clock, Book, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Dashboard = () => {
  const { user, tasks, schedule } = useStore();

  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);

  const todayTasks = tasks.filter(task => !task.completed);
  const nextDayClasses = schedule.filter(entry => {
    // Filter logic for tomorrow's classes
    return true; // Simplified for example
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
            {todayTasks.map(task => (
              <li key={task.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => useStore.getState().toggleTaskComplete(task.id)}
                  className="mr-2"
                />
                <span>{task.title}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tomorrow's Classes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Calendar className="text-red-600 mr-2" />
            <h2 className="text-xl font-bold">Clases de Mañana</h2>
          </div>
          <ul className="space-y-2">
            {nextDayClasses.map(entry => (
              <li key={entry.id} className="flex items-center">
                <span>{entry.subject}</span>
                <span className="ml-auto text-sm text-gray-500">
                  {entry.startTime} - {entry.endTime}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Book className="text-red-600 mr-2" />
            <h2 className="text-xl font-bold">Recomendaciones</h2>
          </div>
          <div className="text-gray-600">
            {/* Recommendations will be populated from the API */}
            <p>Cargando recomendaciones personalizadas...</p>
          </div>
        </div>
      </div>
    </div>
  );
};