import { api } from './api/axios';

export const fetchRecommendations = async (career: string, semester: number) => {
  try {
    const response = await api.post('/recommendations', { career, semester });
    return response.data; // Ensure the response has the expected format
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw new Error('Error al obtener recomendaciones');
  }
}; 