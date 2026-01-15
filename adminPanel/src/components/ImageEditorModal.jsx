import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { X, Check } from 'lucide-react';
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

const ImageEditorModal = ({ image, isOpen, onClose, onSave, aspect = 16 / 9 }) => {
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const [aspectRatio, setAspectRatio] = useState(aspect);
    const imgRef = useRef(null);

    // Reset internal aspect ratio when the modal opens or prop changes
    useEffect(() => {
        if (isOpen) {
            setAspectRatio(aspect);
        }
    }, [isOpen, aspect]);

    const onImageLoad = (e) => {
        if (aspectRatio) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspectRatio));
        } else {
            const { width, height } = e.currentTarget;
            setCrop({
                unit: '%',
                width: 90,
                height: 90,
                x: 5,
                y: 5
            });
        }
    };

    const getCroppedImg = (image, crop) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleSave = async () => {
        if (!completedCrop || !imgRef.current) return;

        try {
            const croppedImage = await getCroppedImg(imgRef.current, completedCrop);
            onSave(croppedImage);
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    // Helper to change aspect and reset crop safely
    const handleAspectChange = (newAspect) => {
        setAspectRatio(newAspect);
        if (imgRef.current) {
            if (newAspect) {
                setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, newAspect));
            } else {
                // When switching to Free, keep current crop but allow resizing freely
                // or reset to full. Let's keep current crop but remove aspect constraint.
                // ReactCrop handles aspect remove automatically if undefined is passed.
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

                <div className="overflow-y-auto custom-scrollbar flex items-center justify-center p-4 bg-black">
                    {image && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspectRatio}
                            className="max-h-[60vh]"
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={image}
                                onLoad={onImageLoad}
                                style={{ maxHeight: '60vh', objectFit: 'contain' }}
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
                        disabled={!completedCrop}
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
