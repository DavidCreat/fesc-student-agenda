import { useStore } from '../store/useStore';

export const TaskList = () => {
  const tasks = useStore((state) => state.tasks);
  const toggleTaskComplete = useStore((state) => state.toggleTaskComplete);

  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Tareas Pendientes</h2>
      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <div key={task._id} className="flex items-center p-3 border rounded hover:bg-gray-50">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskComplete(task._id)}
              className="mr-3"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.subject}</p>
              <p className="text-xs text-gray-500">Fecha límite: {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};