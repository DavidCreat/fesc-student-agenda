import React from 'react';
import ScheduleForm from '../components/ScheduleForm';
import ScheduleList from '../components/ScheduleList';

export const SchedulePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ScheduleForm />
      <ScheduleList />
    </div>
  );
};

export default SchedulePage;