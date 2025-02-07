import React, { useState } from 'react';
import { classifyText, generateRecommendations } from '../services/huggingface.js';

interface RecommendationSystemProps {
  career: string;
  semester: number;
}

export const RecommendationSystem: React.FC<RecommendationSystemProps> = ({ career, semester }) => {
  const [interests, setInterests] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interestList = e.target.value.split(',').map(item => item.trim());
    setInterests(interestList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, classify the interests to ensure they're relevant
      const classification = await classifyText(interests.join(', '), [
        'programming',
        'design',
        'business',
        'technology',
        'science',
        'mathematics'
      ]);

      // Filter interests based on classification scores
      const relevantInterests = classification.labels
        .filter((_: string, index: number) => classification.scores[index] > 0.5);

      // Generate recommendations based on relevant interests
      const results = await generateRecommendations(career, semester, relevantInterests);
      setRecommendations(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Get Personalized Learning Recommendations</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
            Your Interests (comma-separated)
          </label>
          <input
            type="text"
            id="interests"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., programming, web design, databases"
            onChange={handleInterestChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading || interests.length === 0}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Generating...' : 'Get Recommendations'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your Recommendations</h3>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li
                key={index}
                className="p-4 bg-white rounded-lg shadow"
              >
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 