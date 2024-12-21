import { Schedule } from '../components/Schedule';
import { ScheduleForm } from '../components/ScheduleForm';

export const SchedulePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <Schedule />
        <ScheduleForm />
      </div>
    </div>
  );
};