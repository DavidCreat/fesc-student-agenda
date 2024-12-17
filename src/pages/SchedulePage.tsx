import React from 'react';
import { ScheduleForm } from '../components/ScheduleForm';
import { useStore } from '../store/useStore';

export const SchedulePage = () => {
  const schedule = useStore((state) => state.schedule);
  const user = useStore((state) => state.user);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Mi Horario</h2>
          <div className="space-y-4">
            {schedule.map((entry) => (
              <div key={entry.id} className="p-3 border rounded hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{entry.subject}</h3>
                  <span className="text-sm text-gray-600">
                    {entry.startTime} - {entry.endTime}
                  </span>
                </div>
                <p className="text-sm text-gray-500 capitalize">{entry.day}</p>
              </div>
            ))}
          </div>
        </div>
        <ScheduleForm />
      </div>
    </div>
  );
};