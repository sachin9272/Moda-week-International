import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const s3Storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
        const folderName = req.uploadFolder || 'general';
        const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

        // Clean the original filename
        const originalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        const fileName = `moda-week-international/${env}/${folderName}/${uniqueSuffix}-${originalName}`;
        cb(null, fileName);
    }
});

const uploadS3 = multer({
    storage: s3Storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit, for images
});

// Same S3 storage engine, but with a larger limit for video uploads (e.g. landing page videos)
const uploadS3Video = multer({
    storage: s3Storage,
    limits: { fileSize: 200 * 1024 * 1024 } // 200MB limit
});

// Middleware to set the folder name
const setFolder = (folderName) => {
    return (req, res, next) => {
        req.uploadFolder = folderName;
        next();
    };
};

export { s3, uploadS3, uploadS3Video, setFolder };
