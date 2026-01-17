import express from 'express';
const router = express.Router();
import { getEventAnalytics, getEventTransactions } from '../controllers/dashboardController.js';

// GET /api/dashboard/event-analytics/:eventId
router.get('/event-analytics/:eventId', getEventAnalytics);

// GET /api/dashboard/event-transactions/:eventId
router.get('/event-transactions/:eventId', getEventTransactions);

export default router;
