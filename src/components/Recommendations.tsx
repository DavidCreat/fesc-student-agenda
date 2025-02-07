import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '../services/recommendations';
import { FaBook, FaYoutube, FaExternalLinkAlt } from 'react-icons/fa';

interface RecommendationsProps {
  career: string;
  semester: number;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ career, semester }) => {
  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations', career, semester],
    queryFn: () => getRecommendations({ career, semester }),
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error al cargar las recomendaciones
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Libros Recomendados */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaBook className="text-blue-600" />
          Libros Recomendados
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations?.books.map((book, index) => (
            <a
              key={index}
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border rounded-lg hover:bg-gray-50 transition-colors flex items-start gap-3"
            >
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  {book.title}
                  <FaExternalLinkAlt className="text-xs text-gray-400" />
                </h4>
                <p className="text-sm text-gray-600">{book.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Videos Recomendados */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaYoutube className="text-red-600" />
          Videos Recomendados
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations?.videos.map((video, index) => (
            <a
              key={index}
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border rounded-lg hover:bg-gray-50 transition-colors flex items-start gap-3"
            >
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  {video.title}
                  <FaExternalLinkAlt className="text-xs text-gray-400" />
                </h4>
                <p className="text-sm text-gray-600">{video.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
