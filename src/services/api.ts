import { HUGGINGFACE_TOKEN, HUGGINGFACE_API_URL } from '../config';

export const fetchRecommendations = async (subjects: string[]) => {
  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: subjects.join(', '),
        parameters: {
          candidate_labels: ['books', 'articles', 'videos', 'courses']
        }
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};