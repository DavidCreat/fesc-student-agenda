import { Recommendation } from '../models/types.js';

// Tipos de recomendaciones específicos por carrera
const careerSpecificResources: Record<string, Recommendation[]> = {
  'Ingeniería de Sistemas': [
    {
      title: 'Fundamentos de Programación',
      type: 'course',
      url: 'https://www.coursera.org/learn/programming-fundamentals',
      source: 'Coursera',
      relevanceScore: 0.95,
      description: 'Curso fundamental de programación',
      tags: ['programming', 'basics'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: '1'
    },
    {
      title: 'Clean Code',
      type: 'book',
      url: 'https://biblioteca.fesc.edu.co/clean-code',
      source: 'FESC Library',
      relevanceScore: 0.85,
      description: 'Essential book for writing clean code',
      tags: ['programming', 'best practices'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: '2'
    },
    {
      title: 'Modern Web Development',
      type: 'article',
      url: 'https://dev.to/modern-web',
      source: 'Dev.to',
      relevanceScore: 0.75,
      description: 'Latest trends in web development',
      tags: ['web', 'development'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: '3'
    },
    {
      title: 'Git Basics Tutorial',
      type: 'video',
      url: 'https://youtube.com/git-basics',
      source: 'YouTube',
      relevanceScore: 0.8,
      description: 'Learn Git fundamentals',
      tags: ['git', 'version control'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: '4'
    },
    {
      title: 'Research Methods in Computer Science',
      type: 'article',
      url: 'https://research.fesc.edu.co/methods',
      source: 'FESC Research',
      relevanceScore: 0.7,
      description: 'Introduction to research methods',
      tags: ['research', 'methodology'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: '5'
    },
    {
      title: 'Programming Style Guide',
      type: 'article',
      url: 'https://style.fesc.edu.co',
      source: 'FESC Docs',
      relevanceScore: 0.65,
      description: 'Coding standards and guidelines',
      tags: ['style', 'standards'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: '6'
    },
    {
      title: 'Advanced Research in Software Engineering',
      type: 'article',
      url: 'https://research.fesc.edu.co/advanced',
      source: 'FESC Research',
      relevanceScore: 0.7,
      description: 'Advanced research techniques',
      tags: ['research', 'software engineering'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: '7'
    },
    {
      title: 'Best Practices in Software Development',
      type: 'video',
      url: 'https://videos.fesc.edu.co/best-practices',
      source: 'FESC Videos',
      relevanceScore: 0.65,
      description: 'Video guide on best practices',
      tags: ['best practices', 'development'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: '8'
    },
    {
      title: 'Research Methods in Programming',
      type: 'article',
      url: 'https://research.fesc.edu.co/programming',
      source: 'FESC Research',
      relevanceScore: 0.7,
      description: 'Research methods for programmers',
      tags: ['research', 'programming'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: '9'
    },
    {
      title: 'Programming Guidelines',
      type: 'video',
      url: 'https://videos.fesc.edu.co/guidelines',
      source: 'FESC Videos',
      relevanceScore: 0.65,
      description: 'Video guide on programming guidelines',
      tags: ['guidelines', 'programming'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: '10'
    }
  ],
  'Administración de Empresas': [
    {
      title: 'Gestión Empresarial Moderna',
      type: 'article',
      url: 'https://biblioteca.fesc.edu.co/papers/business-management',
      source: 'FESC',
      relevanceScore: 0.88,
      description: 'Modern business management techniques',
      tags: ['business', 'management'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: '11'
    }
  ]
};

// Recomendaciones por semestre
const semesterSpecificResources: Record<number, Recommendation[]> = {
  1: [
    {
      title: 'Guía de Introducción a la Vida Universitaria',
      type: 'video',
      url: 'https://www.fesc.edu.co/guias/primer-semestre',
      source: 'FESC',
      relevanceScore: 1.0,
      description: 'Video guide for new university students',
      tags: ['university', 'introduction'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: '12'
    }
  ],
  // Añadir más recomendaciones por semestre según sea necesario
};

interface RecommendationFilters {
  career: string;
  semester: number;
  limit?: number;
  source?: string[];
}

export const fetchRecommendationsFromDB = async ({
  career,
  semester,
  limit = Number(import.meta.env.VITE_RECOMMENDATIONS_PER_PAGE),
  source
}: RecommendationFilters): Promise<Recommendation[]> => {
  try {
    // Combinar recomendaciones de diferentes fuentes
    let recommendations: Recommendation[] = [
      ...(careerSpecificResources[career] || []),
      ...(semesterSpecificResources[semester] || [])
    ];

    // Filtrar por fuente si se especifica
    if (source) {
      recommendations = recommendations.filter(rec => source.includes(rec.source));
    }

    // Si las AI recommendations están habilitadas, obtener recomendaciones adicionales
    if (import.meta.env.VITE_ENABLE_AI_RECOMMENDATIONS === 'true') {
      const aiRecommendations = await getAIRecommendations(career, semester);
      recommendations = [...recommendations, ...aiRecommendations];
    }

    // Ordenar por relevancia y limitar resultados
    return recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

async function getAIRecommendations(career: string, semester: number): Promise<Recommendation[]> {
  try {
    const response = await fetch(import.meta.env.VITE_HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Generate academic resources for ${career} students in semester ${semester}`,
        parameters: {
          candidate_labels: JSON.parse(import.meta.env.VITE_DEFAULT_RECOMMENDATION_SOURCES)
        }
      }),
    });

    const data = await response.json();
    
    // Transformar la respuesta de la IA en recomendaciones estructuradas
    return data.labels.map((label: string, index: number) => ({
      title: `${label} Resources for ${career}`,
      type: label,
      url: `https://www.fesc.edu.co/resources/${career.toLowerCase()}/${label.toLowerCase()}`,
      source: 'AI Generated',
      relevance: data.scores[index]
    }));
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return [];
  }
} 