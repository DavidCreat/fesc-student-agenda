import axios from 'axios';

const API_TOKEN = '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';

export const getRecommendations = async (subjects: string[]) => {
  try {
    const response = await axios.post(
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
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data.labels.map((label: string, index: number) => ({
      type: label,
      confidence: response.data.scores[index],
      recommendation: `Recomendación para ${label}`
    }));
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};