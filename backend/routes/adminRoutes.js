import express from 'express';
import { getAllNews, getNews, createNews, updateNews, deleteNews } from '../controllers/newsController.js';
const router = express.Router();
import multer from "multer";
const upload = multer();

// Admin routes
router.get('/news/get-all', getAllNews);
router.get('/news/get/:id', getNews);
router.post('/news/create', upload.none(), createNews);
router.put('/news/update/:id', updateNews);
router.delete('/news/delete/:id', deleteNews);

// Export the router
export default router;