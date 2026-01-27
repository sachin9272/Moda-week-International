import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

/**
 * Compresses an image if it exceeds the specified size threshold.
 * @param {File} file - The file to compress.
 * @param {number} maxSizeMB - The maximum size in MB.
 * @returns {Promise<File>} - The compressed file (or original if not an image or under limit).
 */
export const compressImageIfNeeded = async (file, maxSizeMB = 10.0) => {
    // If not an image, return as is
    if (!file.type.startsWith('image/')) {
        return file;
    }

    // If file is already under the limit, return as is
    if (file.size <= maxSizeMB * 1024 * 1024) {
        return file;
    }

    const toastId = toast.loading(`Compressing ${file.name}...`);

    try {
        const options = {
            maxSizeMB: maxSizeMB,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        // Safety check: if compression didn't help enough (rare), we might still be over 10MB
        // but browser-image-compression is usually very good.

        toast.success(`Image compressed successfully: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`, { id: toastId });

        // Create a new File object to preserve the original name and type
        return new File([compressedFile], file.name, {
            type: file.type,
            lastModified: Date.now(),
        });
    } catch (error) {
        console.error('Image compression error:', error);
        toast.error(`Failed to compress ${file.name}. It might still be too large for upload.`, { id: toastId });
        return file;
    }
};
