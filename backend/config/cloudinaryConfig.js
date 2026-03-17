import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Dynamic folder selection
        const folderName = req.uploadFolder || 'general';
        const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

        return {
            folder: `moda-week-international/${env}/${folderName}`,
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'mov', 'avi', 'mkv', 'avif'],
            resource_type: 'auto',
            transformation: [
                { quality: 'auto', fetch_format: 'auto' }
            ]
        };
    },
});

const uploadCloudinary = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to set the folder name
const setFolder = (folderName) => {
    return (req, res, next) => {
        req.uploadFolder = folderName;
        next();
    };
};

export { cloudinary, uploadCloudinary, setFolder };
