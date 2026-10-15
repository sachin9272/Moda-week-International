import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop';
import { X, Check, Loader2, AlertCircle } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

const ImageEditorModal = ({
    image,
    isOpen,
    onClose,
    onSave,
    aspect = 16 / 9,
    outputType = 'image/jpeg',
    outputQuality = 0.95
}) => {
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const [aspectRatio, setAspectRatio] = useState(aspect);
    const [loadedSrc, setLoadedSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const imgRef = useRef(null);

    // Reset internal aspect ratio when the modal opens or prop changes
    useEffect(() => {
        if (isOpen) {
            setAspectRatio(aspect);
        }
    }, [isOpen, aspect]);

    // Handle image loading safely to prevent CORS and browser cache collision issues
    useEffect(() => {
        if (!isOpen || !image) {
            setLoadedSrc(null);
            setIsLoading(false);
            setLoadError(null);
            return;
        }

        // If it's already a Blob, File, or local data/blob URL, use directly
        if (
            image instanceof Blob ||
            image instanceof File ||
            (typeof image === 'string' && (image.startsWith('blob:') || image.startsWith('data:')))
        ) {
            const url = typeof image === 'string' ? image : URL.createObjectURL(image);
            setLoadedSrc(url);
            setIsLoading(false);
            setLoadError(null);
            return () => {
                if (typeof image !== 'string') {
                    URL.revokeObjectURL(url);
                }
            };
        }

        // For remote HTTP/HTTPS URLs (e.g., S3):
        // Browsers often cache non-CORS image responses from normal <img> previews.
        // When later requested with crossOrigin="anonymous", Chrome reuses the cached response
        // which lacks Access-Control-Allow-Origin, resulting in a CORS block error.
        // We fetch the image as a Blob with a cache-busting timestamp parameter to force a fresh CORS request.
        let isCancelled = false;
        let createdUrl = null;
        setIsLoading(true);
        setLoadError(null);

        const fetchImageAsBlob = async () => {
            const separator = image.includes('?') ? '&' : '?';
            const cacheBustedUrl = `${image}${separator}cors_bust=${Date.now()}`;

            try {
                const response = await fetch(cacheBustedUrl, { mode: 'cors' });
                if (!response.ok) {
                    throw new Error(`Failed to load image (HTTP ${response.status})`);
                }
                const blob = await response.blob();
                if (!isCancelled) {
                    createdUrl = URL.createObjectURL(blob);
                    setLoadedSrc(createdUrl);
                    setIsLoading(false);
                }
            } catch (err) {
                console.warn('Direct blob fetch failed, falling back to cache-busted URL directly:', err);
                if (!isCancelled) {
                    setLoadedSrc(cacheBustedUrl);
                    setIsLoading(false);
                }
            }
        };

        fetchImageAsBlob();

        return () => {
            isCancelled = true;
            if (createdUrl) {
                URL.revokeObjectURL(createdUrl);
            }
        };
    }, [isOpen, image]);

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        let initialCrop;
        if (aspectRatio) {
            initialCrop = centerAspectCrop(width, height, aspectRatio);
        } else {
            initialCrop = {
                unit: '%',
                width: 90,
                height: 90,
                x: 5,
                y: 5
            };
        }
        setCrop(initialCrop);
        setCompletedCrop(convertToPixelCrop(initialCrop, width, height));
    };

    const getCroppedImg = (image, crop) => {
        const canvas = document.createElement('canvas');

        // Ensure crop is converted to accurate pixel dimensions relative to the displayed image
        const pixelCrop = crop.unit === '%'
            ? convertToPixelCrop(crop, image.width, image.height)
            : crop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const sourceX = pixelCrop.x * scaleX;
        const sourceY = pixelCrop.y * scaleY;
        const sourceWidth = pixelCrop.width * scaleX;
        const sourceHeight = pixelCrop.height * scaleY;

        canvas.width = Math.max(1, Math.round(sourceWidth));
        canvas.height = Math.max(1, Math.round(sourceHeight));
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Could not get canvas context');
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const isPng = (typeof image.src === 'string' && image.src.toLowerCase().includes('.png')) ||
                      outputType === 'image/png';
        const finalOutputType = isPng ? 'image/png' : outputType;

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, finalOutputType, outputQuality);
        });
    };

    const handleSave = async () => {
        const targetCrop = completedCrop || (crop && imgRef.current
            ? (crop.unit === '%' ? convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height) : crop)
            : null);

        if (!targetCrop || !imgRef.current) return;

        try {
            const croppedImage = await getCroppedImg(imgRef.current, targetCrop);
            onSave(croppedImage);
            onClose();
        } catch (e) {
            console.error('Failed to crop image:', e);
        }
    };

    // Helper to change aspect and reset crop safely
    const handleAspectChange = (newAspect) => {
        setAspectRatio(newAspect);
        if (imgRef.current) {
            const { width, height } = imgRef.current;
            if (newAspect) {
                const newCrop = centerAspectCrop(width, height, newAspect);
                setCrop(newCrop);
                setCompletedCrop(convertToPixelCrop(newCrop, width, height));
            } else {
                if (crop) {
                    setCompletedCrop(crop.unit === '%' ? convertToPixelCrop(crop, width, height) : crop);
                }
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                <div className="shrink-0 p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">Edit Image</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAspectChange(undefined)}
                            className={`px-3 py-1 rounded text-sm ${!aspectRatio ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            Free
                        </button>
                        <button
                            onClick={() => handleAspectChange(21 / 9)}
                            className={`px-3 py-1 rounded text-sm ${aspectRatio === 21 / 9 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            21:9
                        </button>
                        <button
                            onClick={() => handleAspectChange(16 / 9)}
                            className={`px-3 py-1 rounded text-sm ${aspectRatio === 16 / 9 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            16:9
                        </button>
                        <button
                            onClick={() => handleAspectChange(4 / 3)}
                            className={`px-3 py-1 rounded text-sm ${aspectRatio === 4 / 3 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            4:3
                        </button>
                        <button
                            onClick={() => handleAspectChange(1)}
                            className={`px-3 py-1 rounded text-sm ${aspectRatio === 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            1:1
                        </button>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex items-center justify-center p-4 bg-black min-h-[300px]">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                            <span className="text-sm">Loading image for editing...</span>
                        </div>
                    )}

                    {loadError && !isLoading && (
                        <div className="flex flex-col items-center justify-center p-8 text-red-400 text-center">
                            <AlertCircle className="w-8 h-8 mb-2" />
                            <span className="text-sm">{loadError}</span>
                        </div>
                    )}

                    {loadedSrc && !isLoading && !loadError && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspectRatio}
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={loadedSrc}
                                onLoad={onImageLoad}
                                onError={() => setLoadError('Could not load image. Please check network connection.')}
                                style={{ maxWidth: '100%', maxHeight: '60vh', width: 'auto', height: 'auto', display: 'block' }}
                                crossOrigin="anonymous"
                            />
                        </ReactCrop>
                    )}
                </div>

                <div className="shrink-0 p-4 border-t border-gray-700 bg-gray-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={(!completedCrop && !crop) || isLoading || loadError}
                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditorModal;
