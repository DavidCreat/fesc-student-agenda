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
): Promise<string[]> => {
  try {
    const prompt = `Generate learning resources for a ${career} student in semester ${semester} interested in ${interests.join(', ')}`;
    
    const result = await hf.textGeneration({
      model: 'facebook/bart-large-mnli',
      inputs: prompt,
      parameters: {
        max_length: 100,
        num_return_sequences: 3,
        temperature: 0.7
      }
    });

    return Array.isArray(result) 
      ? result.map(r => r.generated_text)
      : [result.generated_text];
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw new Error('Failed to generate recommendations');
  }
};