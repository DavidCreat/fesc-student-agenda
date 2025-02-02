import { Router } from 'express';
import { fetchRecommendations } from '../controllers/recommendationsController';

const router = Router();

router.post('/', (req, res, next) => {
  console.log('Incoming request to /api/recommendations:', req.body);
  next();
}, fetchRecommendations);

export default router; 