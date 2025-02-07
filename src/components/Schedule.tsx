import { Fragment } from 'react';
import { useStore } from '../store/useStore';
import { useScheduleActions } from '../hooks/schedule/useScheduleActions';
import { useEffect } from 'react';

const HOURS = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const Schedule = () => {
  const schedules = useStore((state) => state.schedules) || [];
  const { getSchedule } = useScheduleActions();

  useEffect(() => {
    getSchedule().catch(console.error);
  }, []);

  const getClassForTimeSlot = (day: string, hour: string) => {
    return schedules.find(entry => {
      const entryStartHour = entry.startTime.split(':')[0];
      return entry.dayOfWeek.toLowerCase() === day.toLowerCase() && 
             entryStartHour === hour.split(':')[0];
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 sm:p-6 max-w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4 sm:mb-6 px-2">Horario de Clases</h2>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="min-w-[640px] w-full">
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {/* Header con las horas */}
            <div className="bg-gray-100 p-1 sm:p-2 text-sm sm:text-base font-semibold text-center">Hora</div>
            {/* Headers con los días */}
            {DAYS.map(day => (
              <div key={day} className="bg-gray-100 p-1 sm:p-2 text-sm sm:text-base font-semibold text-center">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
            ))}

            {/* Celdas del horario */}
            {HOURS.map(hour => (
              <Fragment key={hour}>
                {/* Columna de hora */}
                <div className="border p-1 sm:p-2 text-xs sm:text-sm text-center bg-gray-50">
                  {hour}
                </div>
                {/* Celdas para cada día */}
                {DAYS.map(day => {
                  const classEntry = getClassForTimeSlot(day, hour);
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={`border p-1 sm:p-2 ${
                        classEntry ? 'bg-red-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {classEntry && (
                        <div className="text-[10px] sm:text-xs">
                          <div className="font-semibold text-red-600 truncate">
                            {classEntry.subject}
                          </div>
                          <div className="text-gray-600 hidden sm:block">
                            {classEntry.startTime} - {classEntry.endTime}
                          </div>
                          {classEntry.room && (
                            <div className="text-gray-500 truncate">
                              {classEntry.room}
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
  );
}; 