import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import dashboardService  from '../services/dashboard';

const ScheduleList = () => {
  const { user } = useStore((state) => state);
  const [scheduleEntries, setScheduleEntries] = useState<any[]>([]);

  useEffect(() => {
    const fetchScheduleEntries = async () => {
      if (user) {
        const entries = await dashboardService.getSchedule(user._id);
        setScheduleEntries(entries);
      }
    };

    fetchScheduleEntries();
  }, [user]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Mis Horarios</h2>
      <ul>
        {scheduleEntries.map((entry) => (
          <li key={entry._id} className="border-b py-2">
            <strong>{entry.subject}</strong> - {entry.dayOfWeek} {entry.startTime} to {entry.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleList; 