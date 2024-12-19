import axios from 'axios';
import { config } from '../config';

interface RecommendationResponse {
  labels: string[];
  scores: number[];
  sequence: string;
}

export const getRecommendations = async (subjects: string[]) => {
  try {
    const response = await axios.post<RecommendationResponse>(
      'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
      {
        inputs: subjects.join(', '),
        parameters: {
          candidate_labels: [
            'libros de programación',
            'libros de diseño',
            'libros de negocios',
            'libros de administración',
            'recursos en línea',
            'cursos virtuales'
          ]
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${config.huggingFaceToken}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data.labels.map((label, index) => ({
      type: label,
      confidence: response.data.scores[index],
      recommendation: `Recomendación para ${label}`
    }));
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw new Error('No se pudieron obtener las recomendaciones');
  }
};