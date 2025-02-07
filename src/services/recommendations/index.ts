export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'article' | 'video' | 'course';
  url?: string;
  date?: string;
}

export interface GetRecommendationsParams {
  subjects?: string[];
  limit?: number;
}

class RecommendationsService {
  private mockRecommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Curso de Desarrollo Web Moderno',
      description: 'Aprende las últimas tecnologías en desarrollo web con este curso completo que cubre React, TypeScript y más.',
      type: 'course',
      date: '2025-02-10',
      url: 'https://ejemplo.com/curso-web'
    },
    {
      id: '2',
      title: 'Guía de Matemáticas Avanzadas',
      description: 'Material completo de estudio para cálculo diferencial e integral con ejercicios prácticos.',
      type: 'book',
      date: '2025-02-05',
      url: 'https://ejemplo.com/matematicas'
    },
    {
      id: '3',
      title: 'Tutorial de Programación en Python',
      description: 'Video tutorial paso a paso para aprender los fundamentos de Python con ejemplos prácticos.',
      type: 'video',
      date: '2025-02-08',
      url: 'https://ejemplo.com/python-tutorial'
    },
    {
      id: '4',
      title: 'Artículo: Tendencias en IA 2025',
      description: 'Análisis profundo sobre las últimas tendencias en Inteligencia Artificial y su impacto en la programación.',
      type: 'article',
      date: '2025-02-01',
      url: 'https://ejemplo.com/ia-tendencias'
    },
    {
      id: '5',
      title: 'Curso de Algoritmos y Estructuras de Datos',
      description: 'Mejora tus habilidades de programación con este curso fundamental sobre algoritmos.',
      type: 'course',
      date: '2025-02-15',
      url: 'https://ejemplo.com/algoritmos'
    },
    {
      id: '6',
      title: 'Libro: Patrones de Diseño en JavaScript',
      description: 'Una guía completa sobre patrones de diseño modernos en JavaScript y TypeScript.',
      type: 'book',
      date: '2025-02-03',
      url: 'https://ejemplo.com/patrones-diseno'
    }
  ];

  // Simulación de recomendaciones mientras se implementa el backend
  async getRecommendations({ subjects = [], limit = 5 }: GetRecommendationsParams): Promise<Recommendation[]> {
    // Simular un delay para hacer la experiencia más realista
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Filtrar por materias si se proporcionan
    const filteredRecommendations = subjects.length > 0
      ? this.mockRecommendations.filter(rec => 
          subjects.some(subject => 
            rec.title.toLowerCase().includes(subject.toLowerCase()) || 
            rec.description.toLowerCase().includes(subject.toLowerCase())
          )
        )
      : this.mockRecommendations;

    // Aplicar el límite y devolver las recomendaciones
    return filteredRecommendations.slice(0, limit);
  }
}

export const recommendationsService = new RecommendationsService();
