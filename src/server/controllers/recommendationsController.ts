import { Request, Response } from 'express';
import { fetchRecommendations } from '../../services/recommendations';

export const getRecommendations = async (req: Request, res: Response) => {
  const { career, semester } = req.body;
  try {
    const recommendations = await fetchRecommendations(career, semester);
    res.json(recommendations);
  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    res.status(500).json({ message: 'Error al obtener recomendaciones' });
  }
}; 