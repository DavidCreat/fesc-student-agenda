import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getSchedule,
  createScheduleEntry,
  updateScheduleEntry,
  deleteScheduleEntry,
  getSessionLogs,
  createSessionLog,
  updateSessionLog
} from '../controllers/dashboardController';
import { protect } from '../middleware';

const router = express.Router();

// Protect all routes
router.use(protect);

// Tasks routes
router.get('/tasks/:userId', getTasks);
router.post('/tasks', createTask);
router.patch('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// Schedule routes
router.get('/schedule/:userId', getSchedule);
router.post('/schedule', createScheduleEntry);
router.patch('/schedule/:id', updateScheduleEntry);
router.delete('/schedule/:id', deleteScheduleEntry);

// Session logs routes
router.get('/sessions/:userId', getSessionLogs);
router.post('/sessions', createSessionLog);
router.patch('/sessions/:id', updateSessionLog);

export default router;