import express from 'express';
import recommendationsRouter from './recommendations';

const router = express.Router();

// Register routes
router.use('/recommendations', recommendationsRouter);

export default router;
