import { Clock, Book, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';
import { fetchRecommendations } from '../services/recommendations';

export const Dashboard = () => {
  const user = useStore((state) => state.user);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (user) {
        try {
          setLoading(true);
          const { success, data, message } = await fetchRecommendations(user.career, user.semester);
          if (!success) {
            throw new Error(message);
          }
          setRecommendations(data);
        } catch (error) {
          console.error('Error loading recommendations:', error);
          setError('No se pudieron cargar las recomendaciones. Intente nuevamente más tarde.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadRecommendations();
  }, [user]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Profile Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center">
        <img src="/path/to/profile-image.jpg" alt="Profile" className="w-16 h-16 rounded-full mr-4" />
        <div>
          <h2 className="text-xl font-bold text-gray-800">Hola, {user?.fullName}</h2>
          <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Clock className="text-red-600 mr-2" />
            <h2 className="text-xl font-bold">Tareas de Hoy</h2>
          </div>
          <ul className="space-y-2">
            <li className="text-gray-500">No hay tareas pendientes para hoy</li>
          </ul>
        </div>

        {/* Tomorrow's Classes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Calendar className="text-red-600 mr-2" />
            <h2 className="text-xl font-bold">Clases de Mañana</h2>
          </div>
          <ul className="space-y-2">
            <li className="text-gray-500">No hay clases programadas para mañana</li>
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Book className="text-red-600 mr-2" />
            <h2 className="text-xl font-bold">Recomendaciones</h2>
          </div>
          <div className="text-gray-600">
            {loading ? (
              <p>Cargando recomendaciones...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div>
                {recommendations.map((rec, index) => (
                  <RecommendationItem key={index} recommendation={rec} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-bold text-gray-800">Información Adicional</h2>
        <p className="text-gray-600">Aquí puedes agregar más información relevante, como estadísticas o mensajes importantes.</p>
      </div>
    </div>
  );
};

const RecommendationItem = ({ recommendation }) => {
  return (
    <div>
      <h3>{recommendation.title}</h3>
      <p>Type: {recommendation.type}</p>
      <a href={recommendation.url} target="_blank" rel="noopener noreferrer">View Recommendation</a>
    </div>
  );
};