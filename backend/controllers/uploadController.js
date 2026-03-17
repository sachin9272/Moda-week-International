import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'moda-week/editor-uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
        transformation: [{ width: 1000, crop: "limit" }] // Optional: limit max width
    },
});

// Init upload
const upload = multer({
    storage: storage,
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
                // Return Cloudinary URL
                res.status(200).json({
                    url: req.file.path,
                    message: 'File uploaded successfully!'
                });
            }
        }
    });
};
