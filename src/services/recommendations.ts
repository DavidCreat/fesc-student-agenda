import { api } from './api.js';
import { config } from '../config/index.js';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'article' | 'video' | 'course';
  url?: string;
  source: string;
  relevanceScore: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  career?: string;
  semester?: number;
}

export interface RecommendationQuery {
  subjects?: string[];
  types?: string[];
  sources?: string[];
  career?: string;
  semester?: number;
  page?: number;
  limit?: number;
}

class RecommendationsService {
  private static instance: RecommendationsService;
  private cache: Map<string, { data: Recommendation[]; timestamp: number }>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): RecommendationsService {
    if (!RecommendationsService.instance) {
      RecommendationsService.instance = new RecommendationsService();
    }
    return RecommendationsService.instance;
  }

  async getRecommendations(query: RecommendationQuery = {}): Promise<Recommendation[]> {
    const cacheKey = this.generateCacheKey(query);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get<Recommendation[]>('/recommendations', { 
        params: {
          ...query,
          limit: query.limit || config.recommendations.perPage
        }
      });
      this.setInCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw new Error('Error al obtener recomendaciones');
    }
  }

  async getRecommendationById(id: string): Promise<Recommendation> {
    try {
      const response = await api.get<Recommendation>(`/recommendations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      throw new Error('Error al obtener la recomendación');
    }
  }

  private generateCacheKey(query: RecommendationQuery): string {
    return JSON.stringify(query);
  }

  private getFromCache(key: string): Recommendation[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > config.recommendations.cacheTime * 1000) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setInCache(key: string, data: Recommendation[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

export const recommendationsService = RecommendationsService.getInstance(); 