import { cloudinary } from '../config/cloudinaryConfig.js';

/**
 * Extracts the public ID from a Cloudinary URL.
 * Handles URLs with or without versioning numbers.
 * @param {string} url - The Cloudinary asset URL.
 * @returns {string|null} - The public ID or null if extraction fails.
 */
export const extractPublicId = (url) => {
    if (!url || typeof url !== 'string') return null;
    try {
        // Cloudinary URLs format: .../upload/v<version>/<folder>/<id>.<ext>
        const splitUrl = url.split('/upload/');
        if (splitUrl.length < 2) return null;

        const pathAfterUpload = splitUrl[1];
        // Remove version if present (v12345678/)
        const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');

        // Remove extension
        const lastDotIndex = pathWithoutVersion.lastIndexOf('.');
        if (lastDotIndex === -1) return pathWithoutVersion;

        return pathWithoutVersion.substring(0, lastDotIndex);
    } catch (e) {
        console.error("Error extracting public ID:", e);
        return null;
    }
};

/**
 * Deletes an asset from Cloudinary.
 * @param {string} publicId - The public ID of the asset.
 * @param {string} resourceType - 'image' or 'video' (default: 'image').
 */
export const deleteCloudinaryAsset = async (publicId, resourceType = 'image') => {
    if (!publicId) {
        console.warn(`[CloudinaryHelper] Attempted to delete asset without publicId (type: ${resourceType})`);
        return;
    }
    try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log(`Cloudinary deletion result for ${publicId} (${resourceType}):`, result);
        return result;
    } catch (error) {
        console.error(`Failed to delete Cloudinary asset ${publicId}:`, error);
        throw error; // Rethrow to let caller handle if needed
    }
};
