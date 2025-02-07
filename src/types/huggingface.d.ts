declare module '@huggingface/inference' {
  export class HfInference {
    constructor(token?: string);
    
    zeroShotClassification(params: {
      model: string;
      inputs: string;
      parameters: { candidate_labels: string[] };
    }): Promise<{
      labels: string[];
      scores: number[];
      sequence: string;
    }>;

    textGeneration(params: {
      model: string;
      inputs: string;
      parameters: {
        max_length: number;
        num_return_sequences: number;
        temperature: number;
      };
    }): Promise<{
      generated_text: string;
    } | Array<{ generated_text: string }>>;
  }
} 