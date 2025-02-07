import api from './api/axios';

export const fetchRecommendations = async (career: string, semester: number) => {
  try {
    const response = await api.post('/recommendations', { career, semester });
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw new Error('Error al obtener recomendaciones');
  }
}; 