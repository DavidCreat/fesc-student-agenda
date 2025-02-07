interface RecommendationRequest {
  career: string;
  semester: number;
}

interface Recommendation {
  books: Array<{
    title: string;
    link: string;
    description: string;
  }>;
  videos: Array<{
    title: string;
    link: string;
    description: string;
  }>;
}

const DEFAULT_RECOMMENDATIONS: Recommendation = {
  books: [
    {
      title: "Fundamentos de la materia",
      link: "https://www.amazon.com/",
      description: "Libro básico recomendado para el semestre"
    }
  ],
  videos: [
    {
      title: "Introducción al tema",
      link: "https://www.youtube.com/",
      description: "Video introductorio recomendado"
    }
  ]
};

export const getRecommendations = async ({ career, semester }: RecommendationRequest): Promise<Recommendation> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recommendations/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ career, semester }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return DEFAULT_RECOMMENDATIONS;
  }
}
