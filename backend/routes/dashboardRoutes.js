import express from 'express';
const router = express.Router();
import {
    getEventAnalytics,
    getEventTransactions,
    getGlobalAnalytics,
    getTopCustomers,
    getGlobalRecentTransactions,
    getGlobalTicketTypeStats
} from '../controllers/dashboardController.js';

// GET /api/dashboard/event-analytics/:eventId
router.get('/event-analytics/:eventId', getEventAnalytics);

// GET /api/dashboard/event-transactions/:eventId
router.get('/event-transactions/:eventId', getEventTransactions);

// GET /api/dashboard/global-analytics
router.get('/global-analytics', getGlobalAnalytics);

// GET /api/dashboard/top-customers
router.get('/top-customers', getTopCustomers);

// GET /api/dashboard/recent-transactions
router.get('/recent-transactions', getGlobalRecentTransactions);

// GET /api/dashboard/ticket-type-stats
router.get('/ticket-type-stats', getGlobalTicketTypeStats);


export default router;
