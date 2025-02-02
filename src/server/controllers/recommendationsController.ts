import { Request, Response } from 'express';
import { fetchRecommendationsFromDB } from '../../services/recommendationsService';

export const fetchRecommendations = async (req: Request, res: Response) => {
  const { career, semester } = req.body;

  try {
    const recommendations = await fetchRecommendationsFromDB(career, semester);
    return res.json({ success: true, data: recommendations, message: 'Recommendations fetched successfully' });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return res.status(500).json({ success: false, data: null, message: 'Error al obtener recomendaciones' });
  }
}; 