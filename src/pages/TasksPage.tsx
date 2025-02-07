import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';

export const TasksPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TaskList />
        <TaskForm />
      </div>
    </div>
  );
};