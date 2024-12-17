const API_TOKEN = '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';

export const fetchRecommendations = async (subjects: string[]) => {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-mnli', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
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