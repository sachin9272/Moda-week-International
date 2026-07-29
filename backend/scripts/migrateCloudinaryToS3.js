import mongoose from 'mongoose';
import dotenv from 'dotenv';
import https from 'https';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// 1. Initialize S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// 2. Helper function to download from Cloudinary and upload to S3
const migrateImageToS3 = async (cloudinaryUrl, cloudinaryPublicId) => {
    return new Promise((resolve, reject) => {
        https.get(cloudinaryUrl, async (response) => {
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to fetch ${cloudinaryUrl}: ${response.statusCode}`));
            }

            try {
                const urlParts = cloudinaryUrl.split('/');
                const filenameWithExt = urlParts[urlParts.length - 1]; // e.g., kyjhwy90cgi54l5bdtye.jpg
                const ext = path.extname(filenameWithExt) || '.jpg';
                
                // Keep the old folder structure if it was in the publicId, or just put it in a migrated folder
                const safeKey = cloudinaryPublicId.replace(/[^a-zA-Z0-9-_/]/g, '_'); // Sanitize key
                const s3Key = `${safeKey}${ext}`;

                const upload = new Upload({
                    client: s3Client,
                    params: {
                        Bucket: BUCKET_NAME,
                        Key: s3Key,
                        Body: response,
                        ContentType: response.headers['content-type'],
                    },
                });

                const uploadResult = await upload.done();
                resolve({
                    newUrl: uploadResult.Location,
                    newKey: uploadResult.Key
                });
            } catch (error) {
                reject(error);
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
};

// 3. Recursive function to find and replace Cloudinary URLs in a MongoDB document
const processDocument = async (doc) => {
    let hasChanges = false;

    // We traverse the object recursively to find { url: "...", publicId: "..." }
    const traverseAndMigrate = async (obj) => {
        if (!obj || typeof obj !== 'object') return;

        // If it's an array, process each item
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                await traverseAndMigrate(obj[i]);
            }
            return;
        }

        // Instead of hardcoding `{ url, publicId }`, we iterate keys to find cloudinary URLs
        for (const key of Object.keys(obj)) {
            if (key === '_id') continue;
            
            const value = obj[key];
            
            if (typeof value === 'string' && value.includes('cloudinary.com')) {
                console.log(`\n  Found Cloudinary URL in field '${key}': ${value}`);
                
                // Try to find a corresponding ID field
                const idKeyCandidates = ['publicId', 'public_id', 'imageId', `${key}Id`, `${key}_id`];
                let existingId = null;
                let foundIdKey = null;

                for (const candidate of idKeyCandidates) {
                    if (obj[candidate] && typeof obj[candidate] === 'string') {
                        existingId = obj[candidate];
                        foundIdKey = candidate;
                        break;
                    }
                }

                // If no ID found, try to extract from URL
                if (!existingId) {
                    const match = value.match(/\/v\d+\/(.+)$/);
                    if (match) {
                        existingId = match[1].split('.')[0]; // e.g. moda-week-services/image
                    } else {
                        // Fallback: just get filename without extension
                        const parts = value.split('/');
                        existingId = parts[parts.length - 1].split('.')[0];
                    }
                }

                try {
                    const { newUrl, newKey } = await migrateImageToS3(value, existingId);
                    console.log(`  -> Successfully migrated to S3: ${newUrl}`);
                    
                    // Replace values in memory
                    obj[key] = newUrl;
                    if (foundIdKey) {
                        obj[foundIdKey] = newKey;
                    }
                    hasChanges = true;
                } catch (err) {
                    console.error(`  -> Failed to migrate ${value}:`, err.message);
                }
            } else if (value && typeof value === 'object') {
                await traverseAndMigrate(value);
            }
        }
    };

    // We operate on lean objects for safety and update via collection directly
    await traverseAndMigrate(doc);
    return hasChanges;
};

// 4. Main migration runner
const runMigration = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        // Get all collections in the database
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`\n--- Processing Collection: ${collectionName} ---`);
            
            const collection = mongoose.connection.db.collection(collectionName);
            const documents = await collection.find({}).toArray();

            for (const doc of documents) {
                const hasChanges = await processDocument(doc);
                
                if (hasChanges) {
                    console.log(`  Updating document _id: ${doc._id} in ${collectionName}`);
                    await collection.updateOne(
                        { _id: doc._id },
                        { $set: doc } // Replace the document with the mutated one
                    );
                }
            }
        }

        console.log("\n✅ Migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
};

runMigration();
