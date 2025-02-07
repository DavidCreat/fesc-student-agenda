import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { recommendationsService } from '../services/recommendations.js';

interface DashboardProps {
  studentId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ studentId }) => {
  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations', studentId],
    queryFn: () => recommendationsService.getRecommendations({
      subjects: ['programming', 'web development'],
      limit: 5
    })
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error al cargar recomendaciones</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard for student: {studentId}
      </h1>

      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recomendaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations?.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-4">
              <h3 className="font-medium">{rec.title}</h3>
              <p className="text-sm text-gray-600">{rec.description}</p>
              {rec.url && (
                <a 
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  Ver más
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};