import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import landingVideoRoutes from './routes/landingVideoRoutes.js';
import serviceTypeRoutes from './routes/serviceTypeRoutes.js';
import serviceHeroRoutes from './routes/serviceHeroRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
// Connect to database
connectDB();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Custom Routes
app.use('/api/admin', adminRoutes);
app.use('/api/landing-videos', landingVideoRoutes);
app.use('/api/service-types', serviceTypeRoutes);
app.use('/api/service-hero', serviceHeroRoutes); // Added route usage
app.use('/api/forms', applicationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});