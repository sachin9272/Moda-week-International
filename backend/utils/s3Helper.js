import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config/s3Config.js';
import dotenv from 'dotenv';

dotenv.config();

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Extracts the S3 Key from an S3 URL.
 * @param {string} url - The S3 asset URL.
 * @returns {string|null} - The S3 Key or null if extraction fails.
 */
export const extractS3Key = (url) => {
    if (!url || typeof url !== 'string') return null;
    try {
        const bucketUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        if (url.startsWith(bucketUrl)) {
            return url.substring(bucketUrl.length);
        }
        
        // Handle path style or custom domain if necessary, for now assume standard virtual hosted style
        const urlObj = new URL(url);
        return urlObj.pathname.substring(1); // Remove leading slash
    } catch (e) {
        console.error("Error extracting S3 key:", e);
        return null; // Fallback to storing original if we can't extract, or handle differently
    }
};

/**
 * Deletes an asset from S3.
 * @param {string} key - The S3 key (formerly publicId) of the asset.
 */
export const deleteS3Asset = async (key) => {
    if (!key) {
        console.warn(`[S3Helper] Attempted to delete asset without key`);
        return;
    }
    
    // Safety check - don't delete Cloudinary objects via S3 sdk
    if (key.includes('res.cloudinary.com') || key.length < 10) {
       console.warn(`[S3Helper] Skipped deletion, looks like an old Cloudinary asset or invalid key: ${key}`);
       return;
    }
    
    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        
        const result = await s3.send(command);
        console.log(`S3 deletion result for ${key}:`, result.$metadata.httpStatusCode);
        return result;
    } catch (error) {
        console.error(`Failed to delete S3 asset ${key}:`, error);
        throw error; // Rethrow to let caller handle if needed
    }
};
