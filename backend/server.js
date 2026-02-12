import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import landingVideoRoutes from './routes/landingVideoRoutes.js';
import serviceTypeRoutes from './routes/serviceTypeRoutes.js';
import serviceHeroRoutes from './routes/serviceHeroRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import fashionDesignerRoutes from './routes/fashionDesignerRoutes.js';
import talentRoutes from './routes/talentRoutes.js';
import instagramRoutes from './routes/instagramRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import upcomingEventRoutes from './routes/upcomingEventRoutes.js';
import { handleStripeWebhook } from './controllers/webhookController.js';
import { createCheckoutSession, confirmPayment, createDonationCheckoutSession } from './controllers/paymentController.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
// Connect to database
connectDB();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
// Middleware (Order is important! Webhook must be before json parser if it needs raw body, but here we can use express.raw for specific route)

// Stripe Webhook - Needs raw body
app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Custom Routes
app.use('/api/admin', adminRoutes);
app.use('/api/landing-videos', landingVideoRoutes);
app.use('/api/service-types', serviceTypeRoutes);
app.use('/api/service-hero', serviceHeroRoutes); // Added route usage
app.use('/api/events', eventRoutes);
app.use('/api/forms', applicationRoutes);
app.use('/api/fashion-designers', fashionDesignerRoutes);
app.use('/api/talents', talentRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/upcoming-events', upcomingEventRoutes);
import upcomingEventHeroRoutes from './routes/upcomingEventHeroRoutes.js';
import participantsHeroRoutes from './routes/participantsHeroRoutes.js';
import pastEventHeroRoutes from './routes/pastEventHeroRoutes.js';
app.use('/api/upcoming-event-hero', upcomingEventHeroRoutes);
app.use('/api/participants-hero', participantsHeroRoutes);
app.use('/api/past-event-hero', pastEventHeroRoutes);
import legalPageRoutes from './routes/legalPageRoutes.js';
app.use('/api/legal-pages', legalPageRoutes);
import dashboardRoutes from './routes/dashboardRoutes.js';
app.use('/api/dashboard', dashboardRoutes);
import notificationRoutes from './routes/notificationRoutes.js';
app.use('/api/notifications', notificationRoutes);
import philanthropyRoutes from './routes/philanthropyRoutes.js';
app.use('/api/philanthropy', philanthropyRoutes);
import donationPageRoutes from './routes/donationPageRoutes.js';
app.use('/api/donation-page', donationPageRoutes);

// Payment Routes
app.post('/api/payment/create-checkout-session', createCheckoutSession);
app.post('/api/payment/create-donation-checkout-session', createDonationCheckoutSession);
app.post('/api/payment/confirm-payment', confirmPayment);

// Ticket Verification Routes
import { verifyTicket } from './controllers/ticketController.js';
app.get('/api/tickets/verify/:id', verifyTicket);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message, stack: err.stack });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});