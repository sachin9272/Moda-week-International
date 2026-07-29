import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from '../config/s3Config.js';
import dotenv from 'dotenv';

dotenv.config();

// Configure S3 Storage for editor uploads
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
            const originalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileName = `moda-week-international/${env}/editor-uploads/${uniqueSuffix}-${originalName}`;
            cb(null, fileName);
        }
    }),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('image'); // Field name 'image'

export const uploadImage = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error("Upload Error:", err);
            return res.status(400).json({ message: err.message || 'Upload failed' });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ message: 'No file selected!' });
            } else {
                // Return S3 URL
                res.status(200).json({
                    url: req.file.location,
                    message: 'File uploaded successfully!'
                });
            }
        }
    });
};
