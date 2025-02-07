import { HfInference } from '@huggingface/inference';
import { clientConfig } from '../config/client-config.js';

const getToken = () => {
  if (typeof window === 'undefined') {
    return process.env.VITE_HUGGINGFACE_TOKEN;
  }
  return clientConfig.huggingFaceToken;
};

const hf = new HfInference(getToken());

export interface ClassificationResult {
  labels: string[];
  scores: number[];
  sequence: string;
}

interface RecommendationResponse {
  books: Array<{
    title: string;
    author: string;
    description: string;
  }>;
  videos: Array<{
    title: string;
    url?: string;
    platform: string;
  }>;
}

export const classifyText = async (text: string, labels: string[]): Promise<ClassificationResult> => {
  try {
    const result = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: text,
      parameters: { candidate_labels: labels }
    });

    return {
      labels: result.labels,
      scores: result.scores,
      sequence: result.sequence
    };
  } catch (error) {
    console.error('Error in text classification:', error);
    throw new Error('Failed to classify text');
  }
};

export const generateRecommendations = async (
  career: string,
  semester: number,
  interests: string[]
): Promise<RecommendationResponse> => {
  try {
    const prompt = `As an AI tutor, provide personalized educational resource recommendations for a ${career} student in semester ${semester}. Focus on their interests in ${interests.join(', ')}. For each recommendation, include:
1. A relevant book with author and brief description
2. An educational video or course
3. Additional learning resources

Format the response as a JSON array with "books" and "videos" properties.`;
    
    const result = await hf.textGeneration({
      model: 'deepseek-ai/deepseek-coder-6.7b-instruct',
      inputs: prompt,
      parameters: {
        max_length: 1000,
        temperature: 0.7,
        num_return_sequences: 1
      }
    });

    // Parse y valida la respuesta
    try {
      const text = Array.isArray(result) ? result[0].generated_text : result.generated_text;
      const response = JSON.parse(text) as RecommendationResponse;
      return response;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        books: [],
        videos: []
      };
    }
  } catch (error) {
    console.error('Error in recommendation generation:', error);
    throw new Error('Failed to generate recommendations');
  }
};