import { Router } from 'express';
import { getRecommendations } from '../controllers/recommendationsController';

const router = Router();

router.post('/', getRecommendations);

export default router; 