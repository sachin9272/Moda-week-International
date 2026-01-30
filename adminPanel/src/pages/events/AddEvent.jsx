import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseURL as API_BASE_URL } from '../../config/api';
import { Upload, X, ArrowLeft, Pencil } from 'lucide-react';
import ImageEditorModal from '../../components/ImageEditorModal';
import { Editor } from '@tinymce/tinymce-react';
import toast from 'react-hot-toast';
import { compressImageIfNeeded } from '../../utils/imageCompression';

const AddEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        city: '',
        eventName: '',
        date: '',
        eventType: 'past',
        status: 'draft', // Default status
        heroLayout: 'split', // Default layout
        thumbnail: null,


        descriptionSection: {
            title: '',
            text: '',
            isVisible: false,
            imageSize: 'medium'
        },
        videoSection: {
            type: 'youtube', // 'youtube' or 'upload'
            url: '',
            title: '',
            isVisible: true,
            file: null
        },
        collections: [],

        hasTickets: false,
        tickets: []
    });

    const [currentTicket, setCurrentTicket] = useState({
        type: 'General',
        price: '',
        currency: 'USD',
        amount: 100,
        description: '',
        image: null
    });

    const [currentCollection, setCurrentCollection] = useState({
        title: '',
        subtitle: '',
        description: '',
        designerId: null, // Store selected designer ID
        designerImage: null, // Add ability to store designer image URL
        layout: 'grid', // Default collection layout
        gridAspectRatio: 'portrait',
        day: '', // Add Day field
        images: []
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [sponsors, setSponsors] = useState([]); // Array of file objects or {url} for preview

    const [designers, setDesigners] = useState([]);

    // Image Editor State
    const [editorOpen, setEditorOpen] = useState(false);
    const [currentEditingImage, setCurrentEditingImage] = useState(null); // { field: 'thumbnail', file: File/Blob, aspect: 16/9 }
    const [editorImageSrc, setEditorImageSrc] = useState(null);

    const handleEditClick = (field, file, aspect = 16 / 9, index = null) => {
        if (file) {
            const imageUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
            setEditorImageSrc(imageUrl);
            setCurrentEditingImage({ field, file, aspect, index });
            setEditorOpen(true);
        }
    };

    const handleSaveEditedImage = (blob) => {
        if (!currentEditingImage) return;

        // Create a File object from the Blob
        let fileName = 'edited_image.jpg';
        let fileType = 'image/jpeg';
        if (currentEditingImage.file instanceof File) {
            fileName = currentEditingImage.file.name;
            fileType = currentEditingImage.file.type;
        }

        const file = new File([blob], fileName, { type: fileType });
        const { field, index } = currentEditingImage;

        if (field === 'thumbnail') {
            setFormData(prev => ({ ...prev, thumbnail: file }));

        } else if (field === 'descriptionSection.image') {
            setFormData(prev => ({ ...prev, descriptionSection: { ...prev.descriptionSection, image: file } }));
        } else if (field === 'bottomSection.image') {
            setFormData(prev => ({ ...prev, bottomSection: { ...prev.bottomSection, image: file } }));
        } else if (field === 'currentCollection.designerImage') {
            setCurrentCollection(prev => ({ ...prev, designerImage: file }));
        } else if (field === 'currentCollection.image') {
            setCurrentCollection(prev => {
                const newImages = [...prev.images];
                if (index !== null && newImages[index]) {
                    newImages[index] = file;
                }
                return { ...prev, images: newImages };
            });
        } else if (field === 'currentTicket.image') {
            setCurrentTicket(prev => ({ ...prev, image: file }));
        }

        // Clean up
        if (editorImageSrc && typeof editorImageSrc !== 'string') URL.revokeObjectURL(editorImageSrc);
        setEditorOpen(false);
        setEditorImageSrc(null);
        setCurrentEditingImage(null);
    };

    React.useEffect(() => {
        const fetchDesigners = async () => {
            try {
                // Debugging URL issue
                console.log("API_BASE_URL:", API_BASE_URL);
                const url = `${API_BASE_URL}/api/fashion-designers?limit=100`;
                console.log("Fetching designers from:", url);

                const response = await axios.get(url);
                setDesigners(response.data.designers || []);
            } catch (error) {
                console.error("Error fetching designers:", error);
            }
        };
        fetchDesigners();
    }, []);

    const handleImageUpload = (blobInfo, progress) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', blobInfo.blob(), blobInfo.filename());

            axios.post(`${API_BASE_URL}/api/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    progress(Math.round((e.loaded / e.total) * 100));
                }
            })
                .then(response => {
                    resolve(response.data.url);
                })
                .catch(error => {
                    reject('Image upload failed: ' + error.message);
                });
        });
    };

    const editorConfig = {
        height: 400,
        menubar: true,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | image table link | help',
        image_advtab: true,
        image_title: true,
        image_caption: true,
        image_class_list: [
            { title: 'None', value: '' },
            { title: 'Left (Text wraps right)', value: 'float-left' },
            { title: 'Right (Text wraps left)', value: 'float-right' },
            { title: 'Center', value: 'align-center' }
        ],
        content_style: `
            body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #333; color: #fff; }
            img { max-width: 100%; height: auto; }
            .float-left { float: left; margin-right: 20px; margin-bottom: 20px; clear: none; }
            .float-right { float: right; margin-left: 20px; margin-bottom: 20px; clear: none; }
            .align-center { display: block; margin-left: auto; margin-right: auto; clear: both; }
        `,
        skin: 'oxide-dark',
        content_css: 'dark',
        images_upload_handler: handleImageUpload
    };

    const handleDesignerSelect = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) return;

        const designer = designers.find(d => d._id === selectedId);
        if (designer) {
            setCurrentCollection(prev => ({
                ...prev,
                title: designer.name,
                description: designer.bio,
                designerId: designer._id, // Save ID
                designerImage: designer.image?.url // Auto-fill image if available
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('bottomSection.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                bottomSection: {
                    ...prev.bottomSection,
                    [field]: value
                }
            }));
        } else if (name.startsWith('descriptionSection.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                descriptionSection: {
                    ...prev.descriptionSection,
                    [field]: value
                }
            }));
        } else if (name.startsWith('videoSection.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                videoSection: {
                    ...prev.videoSection,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = async (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            let file = files[0];

            if (file.type.startsWith('image/')) {
                file = await compressImageIfNeeded(file);
            } else if (file.size > 10 * 1024 * 1024) {
                toast.error("File size too large. Maximum is 10MB for videos.");
                e.target.value = '';
                return;
            }

            if (name === 'bottomSection.image') {
                setFormData(prev => ({
                    ...prev,
                    bottomSection: {
                        ...prev.bottomSection,
                        image: file
                    }
                }));
            } else if (name === 'descriptionSection.image') {
                setFormData(prev => ({
                    ...prev,
                    descriptionSection: {
                        ...prev.descriptionSection,
                        image: file
                    }
                }));
            } else if (name === 'videoSection.file') {
                setFormData(prev => ({
                    ...prev,
                    videoSection: {
                        ...prev.videoSection,
                        file: file
                    }
                }));
            } else {
                setFormData(prev => ({ ...prev, [name]: file }));
            }
        }
    };


    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e, fieldName) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            let file = files[0];

            if (file.type.startsWith('image/')) {
                file = await compressImageIfNeeded(file);
            } else if (file.size > 10 * 1024 * 1024) {
                toast.error("File size too large. Maximum is 10MB for videos.");
                return;
            }

            if (fieldName === 'descriptionSection.image') {
                setFormData(prev => ({
                    ...prev,
                    descriptionSection: {
                        ...prev.descriptionSection,
                        image: file
                    }
                }));
            } else if (fieldName === 'videoSection.file') {
                setFormData(prev => ({
                    ...prev,
                    videoSection: {
                        ...prev.videoSection,
                        file: file
                    }
                }));
            } else if (fieldName === 'bottomSection.image') {
                setFormData(prev => ({
                    ...prev,
                    bottomSection: {
                        ...prev.bottomSection,
                        image: file
                    }
                }));
            } else {
                setFormData(prev => ({ ...prev, [fieldName]: file }));
            }
        }
    }


    const handleCollectionChange = (e) => {
        const { name, value } = e.target;
        setCurrentCollection(prev => ({ ...prev, [name]: value }));
    };

    const handleCollectionImages = async (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const processedFiles = [];

            for (const file of newFiles) {
                if (file.type.startsWith('image/')) {
                    const compressed = await compressImageIfNeeded(file);
                    processedFiles.push(compressed);
                } else if (file.size > 10 * 1024 * 1024) {
                    toast.error(`${file.name} is too large. Maximum is 10MB for videos.`);
                } else {
                    processedFiles.push(file);
                }
            }

            if (processedFiles.length > 0) {
                setCurrentCollection(prev => ({
                    ...prev,
                    images: [...prev.images, ...processedFiles]
                }));
            }
            e.target.value = '';
        }
    };

    const handleDesignerImage = async (e) => {
        if (e.target.files && e.target.files[0]) {
            let file = e.target.files[0];

            if (file.type.startsWith('image/')) {
                file = await compressImageIfNeeded(file);
            } else if (file.size > 10 * 1024 * 1024) {
                toast.error("File size too large. Maximum is 10MB for videos.");
                e.target.value = '';
                return;
            }

            setCurrentCollection(prev => ({ ...prev, designerImage: file }));
        }
    };

    const removeCollectionImage = (index) => {
        setCurrentCollection(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const addCollection = () => {
        if (currentCollection.title && currentCollection.images.length > 0) {
            setFormData(prev => {
                const newCollections = [...prev.collections];
                if (editingIndex !== null) {
                    newCollections[editingIndex] = currentCollection;
                } else {
                    newCollections.push(currentCollection);
                }
                return { ...prev, collections: newCollections };
            });
            setCurrentCollection({ title: '', subtitle: '', description: '', designerId: null, designerImage: null, layout: 'grid', gridAspectRatio: 'portrait', day: '', images: [] });
            setEditingIndex(null);

            // Reset file inputs
            const fileInput = document.getElementById('collectionImagesInput');
            if (fileInput) fileInput.value = '';
            const designerImgInput = document.getElementById('designerImageInput');
            if (designerImgInput) designerImgInput.value = '';

        } else {
            toast.error("Collection must have a title and at least one image.");
        }
    };

    const startEditCollection = (index) => {
        setEditingIndex(index);
        setCurrentCollection(formData.collections[index]);
        const element = document.getElementById('collectionForm');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const cancelEditCollection = () => {
        setEditingIndex(null);
        setCurrentCollection({ title: '', subtitle: '', description: '', designerId: null, designerImage: null, layout: 'grid', gridAspectRatio: 'portrait', day: '', images: [] });
    };

    const removeCollection = (index) => {
        setFormData(prev => ({
            ...prev,
            collections: prev.collections.filter((_, i) => i !== index)
        }));
    };

    // Ticket Handlers
    const handleTicketChange = (e) => {
        const { name, value } = e.target;
        setCurrentTicket(prev => ({ ...prev, [name]: value }));
    };

    const handleTicketImage = async (e) => {
        if (e.target.files && e.target.files[0]) {
            let file = e.target.files[0];

            if (file.type.startsWith('image/')) {
                file = await compressImageIfNeeded(file);
            } else if (file.size > 10 * 1024 * 1024) {
                toast.error("File size too large. Maximum is 10MB for videos.");
                e.target.value = '';
                return;
            }
            setCurrentTicket(prev => ({ ...prev, image: file }));
        }
    };

    const [partners, setPartners] = useState([]);

    // Partner Handlers
    const handlePartnerUpload = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setPartners(prev => [...prev, ...files]);
        }
    };

    const removePartner = (index) => {
        setPartners(prev => prev.filter((_, i) => i !== index));
    };

    const addTicket = () => {
        if (currentTicket.price && currentTicket.type) {
            setFormData(prev => ({
                ...prev,
                tickets: [...prev.tickets, currentTicket]
            }));
            setCurrentTicket({ type: 'General', price: '', currency: 'USD', amount: 100, description: '', image: null });
        } else {
            toast.error("Ticket must have a Price and Type.");
        }
    };

    const removeTicket = (index) => {
        setFormData(prev => ({
            ...prev,
            tickets: prev.tickets.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmit triggered");

        // Manual Validation
        const requiredFields = [
            { name: 'city', label: 'City' },
            { name: 'eventName', label: 'Event Name' },
            { name: 'date', label: 'Date' }
        ];

        for (const field of requiredFields) {
            if (!formData[field.name]) {
                toast.error(`${field.label} is required`);
                const element = document.getElementsByName(field.name)[0];
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.focus();
                }
                return;
            }
        }

        if (!formData.thumbnail) {
            toast.error("Thumbnail Image is required");
            const element = document.getElementById('thumbnail-section');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append('city', formData.city);
        data.append('eventName', formData.eventName);
        data.append('date', formData.date);

        data.append('eventType', 'past');
        data.append('status', formData.status);
        data.append('heroLayout', formData.heroLayout);

        if (formData.thumbnail) data.append('thumbnail', formData.thumbnail);





        const descriptionSectionData = {
            title: formData.descriptionSection.title,
            text: formData.descriptionSection.text,
            credits: formData.descriptionSection.credits,
            isVisible: formData.descriptionSection.isVisible,
            imageSize: formData.descriptionSection.imageSize
        };
        data.append('descriptionSection', JSON.stringify(descriptionSectionData));

        if (formData.descriptionSection.image) {
            data.append('descriptionSectionImage', formData.descriptionSection.image);
        }

        const videoSectionData = {
            type: formData.videoSection.type,
            url: formData.videoSection.type === 'youtube' ? formData.videoSection.url : '',
            title: formData.videoSection.title,
            isVisible: formData.videoSection.isVisible
        };
        data.append('videoSection', JSON.stringify(videoSectionData));
        if (formData.videoSection.type === 'upload' && formData.videoSection.file) {
            data.append('videoSectionFile', formData.videoSection.file);
        }

        const collectionsMeta = formData.collections.map(col => ({
            title: col.title,
            subtitle: col.subtitle,
            description: col.description,
            designerId: col.designerId, // Include ID
            layout: col.layout,
            gridAspectRatio: col.gridAspectRatio,
            day: col.day // Include Day
        }));
        data.append('collections', JSON.stringify(collectionsMeta));

        formData.collections.forEach((col, index) => {
            col.images.forEach((file) => {
                data.append(`collectionImages_${index}`, file);
            });
        });

        // Add Tickets Data
        data.append('hasTickets', formData.hasTickets);
        const ticketsMeta = formData.tickets.map(t => ({
            type: t.type,
            price: t.price,
            currency: t.currency,
            amount: t.amount,
            description: t.description
        }));
        data.append('tickets', JSON.stringify(ticketsMeta));

        formData.tickets.forEach((ticket, index) => {
            if (ticket.image && typeof ticket.image !== 'string') {
                data.append(`ticketImage_${index}`, ticket.image);
            }
        });

        // Append Sponsors
        // We only send metadata as JSON if needed (structure is simple: list of images)
        // But controller expects JSON + files.
        // Controller: "parsedSponsors.map... return { url: sponsorFile.path }"
        // So we need to send an array of objects in 'sponsors' field.
        const sponsorsMeta = sponsors.map((s, i) => ({
            id: i // dummy ID
        }));
        data.append('sponsors', JSON.stringify(sponsorsMeta));

        sponsors.forEach((file, index) => {
            if (file instanceof File) {
                data.append(`sponsorImage_${index}`, file);
            }
        });

        // 7. Handle Partners
        const partnersMeta = partners.map((s, i) => ({ id: i }));
        data.append('partners', JSON.stringify(partnersMeta));

        partners.forEach((file, index) => {
            if (file instanceof File) {
                data.append(`partnerImage_${index}`, file);
            }
        });

        try {
            console.log("Sending request to:", `${API_BASE_URL}/api/events/create`);
            await axios.post(`${API_BASE_URL}/api/events/create`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Event created successfully!');
            setTimeout(() => {
                navigate('/events');
            }, 1000);
        } catch (error) {
            console.error('Error creating event:', error);
            toast.error('Failed to create event. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 min-h-screen text-black">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    title="Go Back"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-3xl font-bold text-white">Add New Event</h1>
            </div>



            <ImageEditorModal
                isOpen={editorOpen}
                onClose={() => setEditorOpen(false)}
                onSave={handleSaveEditedImage}
                image={editorImageSrc}
                aspect={currentEditingImage?.aspect}
            />

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-1">City <span className="text-red-500">*</span></label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Event Name <span className="text-red-500">*</span></label>
                            <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Date <span className="text-red-500">*</span></label>
                            <input type="text" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                        </div>



                        <div id="thumbnail-section">
                            <label className="block text-gray-400 mb-1">Thumbnail Image <span className="text-red-500">*</span></label>
                            <div
                                className={`border - 2 border - dashed rounded - lg p - 6 flex flex - col items - center justify - center text - center transition - colors ${isDragging ? 'border-blue-500 bg-gray-700 ring-2 ring-blue-500/50' : (formData.thumbnail ? 'border-blue-500 bg-gray-900' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50')} `}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, 'thumbnail')}
                            >
                                {formData.thumbnail ? (
                                    <div className="relative w-full">
                                        <img
                                            src={URL.createObjectURL(formData.thumbnail)}
                                            alt="Thumbnail Preview"
                                            className="max-h-64 w-auto mx-auto rounded shadow-lg"
                                        />
                                        <div className="absolute -top-2 -right-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEditClick('thumbnail', formData.thumbnail, 16 / 9)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                                                title="Edit Image"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, thumbnail: null }))}
                                                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                                                title="Remove Image"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-400">{formData.thumbnail.name}</p>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-4">
                                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                        <span className="text-blue-400 font-medium hover:underline">Click to upload</span>
                                        <span className="text-gray-500 text-sm mt-1">or drag and drop</span>
                                        <span className="text-gray-600 text-xs mt-2">SVG, PNG, JPG or GIF</span>
                                        <input
                                            type="file"
                                            name="thumbnail"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>


                    </div>
                </div>


                {/* Event Partners Section */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Event Partners</h2>
                    <div className="space-y-4">
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-blue-500 bg-gray-700 ring-2 ring-blue-500/50' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files) {
                                    handlePartnerUpload({ target: { files: e.dataTransfer.files } });
                                }
                            }}
                        >
                            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-4">
                                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                <span className="text-blue-400 font-medium hover:underline">Click to upload partner logos</span>
                                <span className="text-gray-500 text-sm mt-1">or drag and drop (multiple allowed)</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePartnerUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {partners.length > 0 && (
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 bg-gray-900 p-4 rounded border border-gray-600">
                                {partners.map((file, idx) => (
                                    <div key={idx} className="relative group aspect-square bg-white/5 rounded flex items-center justify-center p-2">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Partner ${idx}`}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePartner(idx)}
                                            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-transform hover:scale-110"
                                            title="Remove Partner"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Description Section */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-blue-400">Description Section (Optional)</h2>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="hasDescription"
                                checked={formData.descriptionSection.isVisible}
                                onChange={(e) => setFormData(prev => ({ ...prev, descriptionSection: { ...prev.descriptionSection, isVisible: e.target.checked } }))}
                                className="w-5 h-5"
                            />
                            <label htmlFor="hasDescription" className="text-white cursor-pointer select-none">Enable Description Section</label>
                        </div>
                    </div>

                    {formData.descriptionSection.isVisible && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Description Title</label>
                                <input type="text" name="descriptionSection.title" value={formData.descriptionSection.title} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1">Description Image (Left Side)</label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-blue-500 bg-gray-700 ring-2 ring-blue-500/50' : (formData.descriptionSection.image ? 'border-blue-500 bg-gray-900' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50')}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, 'descriptionSection.image')}
                                >
                                    {formData.descriptionSection.image ? (
                                        <div className="relative w-full">
                                            <img
                                                src={typeof formData.descriptionSection.image === 'string' ? formData.descriptionSection.image : URL.createObjectURL(formData.descriptionSection.image)}
                                                alt="Description Preview"
                                                className="max-h-64 w-auto mx-auto rounded shadow-lg"
                                            />
                                            <div className="absolute -top-2 -right-2 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditClick('descriptionSection.image', formData.descriptionSection.image, 4 / 3)} // Assuming different aspect might be needed, or keep 16/9
                                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                                                    title="Edit Image"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, descriptionSection: { ...prev.descriptionSection, image: null } }))}
                                                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                                                    title="Remove Image"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-400">
                                                {typeof formData.descriptionSection.image === 'string' ? 'Current Image' : formData.descriptionSection.image.name}
                                            </p>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-4">
                                            <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                            <span className="text-blue-400 font-medium hover:underline">Click to upload</span>
                                            <span className="text-gray-500 text-sm mt-1">or drag and drop</span>
                                            <span className="text-gray-600 text-xs mt-2">SVG, PNG, JPG or GIF</span>
                                            <input
                                                type="file"
                                                name="descriptionSection.image"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1">Description Text (Top Section)</label>
                                <Editor
                                    apiKey="apue6l4wni669li3i8o9igdmpcqesfnt8x89juv46kyoajyz"
                                    value={formData.descriptionSection.text}
                                    onEditorChange={(value) => setFormData(prev => ({
                                        ...prev,
                                        descriptionSection: { ...prev.descriptionSection, text: value }
                                    }))}
                                    init={editorConfig}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1">Description Side Text (Right Section)</label>
                                <Editor
                                    apiKey="apue6l4wni669li3i8o9igdmpcqesfnt8x89juv46kyoajyz"
                                    value={formData.descriptionSection.credits}
                                    onEditorChange={(value) => setFormData(prev => ({
                                        ...prev,
                                        descriptionSection: { ...prev.descriptionSection, credits: value }
                                    }))}
                                    init={editorConfig}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1">Image Size in Description</label>
                                <select
                                    name="descriptionSection.imageSize"
                                    value={formData.descriptionSection.imageSize}
                                    onChange={handleInputChange}
                                    className="w-full p-2 bg-gray-700 rounded text-white"
                                >
                                    <option value="small">Small (33% Image, 66% Text)</option>
                                    <option value="medium">Medium (50% Image, 50% Text)</option>
                                    <option value="large">Large (66% Image, 33% Text)</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-blue-400">Video Section (Below Description)</h2>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="hasVideoSection"
                                checked={formData.videoSection.isVisible}
                                onChange={(e) => setFormData(prev => ({ ...prev, videoSection: { ...prev.videoSection, isVisible: e.target.checked } }))}
                                className="w-5 h-5"
                            />
                            <label htmlFor="hasVideoSection" className="text-white cursor-pointer select-none">Enable Video Section</label>
                        </div>
                    </div>

                    {formData.videoSection.isVisible && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Section Title (Optional)</label>
                                <input type="text" name="videoSection.title" value={formData.videoSection.title} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Video Source</label>
                                <div className="flex gap-4 mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="videoSection.type"
                                            value="youtube"
                                            checked={formData.videoSection.type === 'youtube'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-white">YouTube Link</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="videoSection.type"
                                            value="upload"
                                            checked={formData.videoSection.type === 'upload'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-white">Upload Video</span>
                                    </label>
                                </div>

                                {formData.videoSection.type === 'youtube' ? (
                                    <div>
                                        <label className="block text-gray-400 mb-1">YouTube URL</label>
                                        <input
                                            type="text"
                                            name="videoSection.url"
                                            value={formData.videoSection.url}
                                            onChange={handleInputChange}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="w-full p-2 bg-gray-700 rounded text-white"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-blue-500 bg-gray-700 ring-2 ring-blue-500/50' : (formData.videoSection.file ? 'border-blue-500 bg-gray-900' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50')}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, 'videoSection.file')}
                                    >
                                        {formData.videoSection.file ? (
                                            <div className="relative w-full">
                                                <video
                                                    src={URL.createObjectURL(formData.videoSection.file)}
                                                    className="max-h-64 w-auto mx-auto rounded shadow-lg"
                                                    controls
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, videoSection: { ...prev.videoSection, file: null } }))}
                                                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                                                    title="Remove Video"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <p className="mt-2 text-sm text-gray-400">{formData.videoSection.file.name}</p>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-4">
                                                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                                <span className="text-blue-400 font-medium hover:underline">Click to upload video</span>
                                                <span className="text-gray-500 text-sm mt-1">or drag and drop</span>
                                                <span className="text-gray-600 text-xs mt-2">MP4, WebM (Max 100MB)</span>
                                                <input
                                                    type="file"
                                                    name="videoSection.file"
                                                    accept="video/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Collections (Designers/Photos)</h2>

                    <div className={`mb-4 space-y-4 border p-4 ${editingIndex !== null ? 'border-blue-500 bg-gray-900' : 'border-gray-600'} rounded`}>
                        <h3 className="font-semibold">{editingIndex !== null ? 'Editing Collection' : 'Add New Collection'}</h3>

                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1 text-sm">Select Designer (Auto-fill)</label>
                            <select onChange={handleDesignerSelect} className="w-full p-2 bg-gray-700 rounded text-white border border-gray-600 focus:border-blue-500">
                                <option value="">-- Choose a Vendor/Designer --</option>
                                {designers.map(d => (
                                    <option key={d._id} value={d._id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="title" value={currentCollection.title} onChange={handleCollectionChange} placeholder="Title (e.g., Designer Name)" className="w-full p-2 bg-gray-700 rounded text-white" />
                            <input type="text" name="subtitle" value={currentCollection.subtitle} onChange={handleCollectionChange} placeholder="Subtitle (optional)" className="w-full p-2 bg-gray-700 rounded text-white" />
                            <textarea name="description" value={currentCollection.description} onChange={handleCollectionChange} placeholder="Description / Biography (Optional)" rows="3" className="w-full p-2 bg-gray-700 rounded text-white md:col-span-2"></textarea>
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-1 text-sm">Collection Layout</label>
                                    <select name="layout" value={currentCollection.layout} onChange={handleCollectionChange} className="w-full p-2 bg-gray-700 rounded text-white">
                                        <option value="grid">Standard Grid (3 Columns)</option>
                                        <option value="masonry">Masonry / Pinterest Style</option>
                                        <option value="highlight">Feature Highlight (Large First Image)</option>
                                        <option value="carousel">Carousel / Marquee (Designer Profile)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1 text-sm">Grid Aspect Ratio (For Grid Layout)</label>
                                    <select name="gridAspectRatio" value={currentCollection.gridAspectRatio || 'portrait'} onChange={handleCollectionChange} className="w-full p-2 bg-gray-700 rounded text-white">
                                        <option value="portrait">Portrait (3:4)</option>
                                        <option value="landscape">Landscape (4:3)</option>
                                        <option value="square">Square (1:1)</option>
                                        <option value="auto">Auto (Natural)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1 text-sm">Event Day (Optional)</label>
                                    <select name="day" value={currentCollection.day || ''} onChange={handleCollectionChange} className="w-full p-2 bg-gray-700 rounded text-white">
                                        <option value="">-- No Specific Day --</option>
                                        <option value="1">Day 1</option>
                                        <option value="2">Day 2</option>
                                        <option value="3">Day 3</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-400 text-sm">Designer Profile Image (Use for Carousel Layout)</label>
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-blue-500 bg-gray-700 ring-2 ring-blue-500/50' : (currentCollection.designerImage ? 'border-blue-500 bg-gray-900' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50')}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                        setCurrentCollection(prev => ({ ...prev, designerImage: e.dataTransfer.files[0] }));
                                    }
                                }}
                            >
                                {currentCollection.designerImage ? (
                                    <div className="relative w-full flex justify-center">
                                        <div className="relative">
                                            <img
                                                src={typeof currentCollection.designerImage === 'string' ? currentCollection.designerImage : URL.createObjectURL(currentCollection.designerImage)}
                                                alt="Designer Profile"
                                                className="h-32 w-32 rounded-full object-cover border-4 border-gray-700 shadow-lg"
                                            />
                                            <div className="absolute top-0 right-0 flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditClick('currentCollection.designerImage', currentCollection.designerImage, 1, null)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 shadow-md transition-transform hover:scale-110"
                                                    title="Edit Image"
                                                >
                                                    <Pencil size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentCollection(prev => ({ ...prev, designerImage: null }))}
                                                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-transform hover:scale-110"
                                                    title="Remove Image"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-2">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-blue-400 font-medium hover:underline text-sm">Upload Profile Image</span>
                                        <span className="text-gray-500 text-xs mt-1">or drag and drop</span>
                                        <input
                                            id="designerImageInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleDesignerImage}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-400 text-sm">Upload Images</label>
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-blue-500 bg-gray-700 ring-2 ring-blue-500/50' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                        const newFiles = Array.from(e.dataTransfer.files);
                                        setCurrentCollection(prev => ({
                                            ...prev,
                                            images: [...prev.images, ...newFiles]
                                        }));
                                    }
                                }}
                            >
                                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-4">
                                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                    <span className="text-blue-400 font-medium hover:underline">Click to upload images</span>
                                    <span className="text-gray-500 text-sm mt-1">or drag and drop (multiple allowed)</span>
                                    <input
                                        id="collectionImagesInput"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleCollectionImages}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>


                        {currentCollection.images.length > 0 && (
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 bg-gray-900 p-4 max-h-96 overflow-y-auto rounded border border-gray-600">
                                {currentCollection.images.map((file, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded border border-gray-700"
                                        />
                                        <div className="absolute top-1 right-1 flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleEditClick('currentCollection.image', file, 16 / 9, idx)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 shadow-md transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={12} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeCollectionImage(idx)}
                                                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-colors"
                                                title="Remove"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button type="button" onClick={addCollection} className={`flex-1 py-2 rounded mt-2 text-white ${editingIndex !== null ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {editingIndex !== null ? 'Update Collection' : 'Save Collection to Event'}
                            </button>
                            {editingIndex !== null && (
                                <button type="button" onClick={cancelEditCollection} className="py-2 px-4 rounded mt-2 text-white bg-gray-600 hover:bg-gray-500">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {formData.collections.length > 0 && (
                        <div className="space-y-4 mt-4">
                            {formData.collections.map((col, idx) => (
                                <div key={idx} className={`bg-gray-700 p-4 rounded flex justify-between items-center ${editingIndex === idx ? 'border border-blue-500' : ''}`}>
                                    <div>
                                        <div className="font-bold">{col.title} <span className="text-sm font-normal text-gray-400">({col.subtitle})</span></div>
                                        <div className="text-xs text-gray-400">{col.images.length} images - Layout: {col.layout} ({col.gridAspectRatio})</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => startEditCollection(idx)} className="text-blue-400 hover:text-blue-300">Edit</button>
                                        <button type="button" onClick={() => removeCollection(idx)} className="text-red-400 hover:text-red-300">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Partners Section */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Event Partners</h2>
                    <div className="space-y-4">
                        <label className="block text-gray-400 mb-1">Upload Partner Logos</label>
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-gray-700/50 transition-colors">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handlePartnerUpload}
                                className="hidden"
                                id="partnerUpload"
                            />
                            <label htmlFor="partnerUpload" className="cursor-pointer flex flex-col items-center">
                                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                <span className="text-blue-400 font-medium">Click to upload logos</span>
                                <span className="text-gray-500 text-sm">Supported formats: PNG, JPG, SVG</span>
                            </label>
                        </div>

                        {partners.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {partners.map((file, idx) => (
                                    <div key={idx} className="relative group bg-gray-900 justify-center p-4 rounded border border-gray-700 flex items-center h-24">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Partner ${idx}`}
                                            className="max-h-16 max-w-full object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePartner(idx)}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tickets Section */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-blue-400">Event Tickets</h2>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="hasTickets"
                                checked={formData.hasTickets}
                                onChange={(e) => setFormData(prev => ({ ...prev, hasTickets: e.target.checked }))}
                                className="w-5 h-5"
                            />
                            <label htmlFor="hasTickets" className="text-white cursor-pointer select-none">Enable Tickets Section</label>
                        </div>
                    </div>

                    {formData.hasTickets && (
                        <div className="space-y-4 border p-4 border-gray-600 rounded">
                            <h3 className="font-semibold">Add New Ticket</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-1">Ticket Type</label>
                                    <select name="type" value={currentTicket.type} onChange={handleTicketChange} className="w-full p-2 bg-gray-700 rounded text-white">
                                        <option value="General">General</option>
                                        <option value="VIP">VIP</option>
                                        <option value="Student">Student</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Price</label>
                                    <input type="number" name="price" value={currentTicket.price} onChange={handleTicketChange} placeholder="0.00" className="w-full p-2 bg-gray-700 rounded text-white" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Quantity Available</label>
                                    <input type="number" name="amount" value={currentTicket.amount} onChange={handleTicketChange} placeholder="100" className="w-full p-2 bg-gray-700 rounded text-white" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Currency</label>
                                    <input type="text" name="currency" value={currentTicket.currency} onChange={handleTicketChange} placeholder="USD" className="w-full p-2 bg-gray-700 rounded text-white" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 mb-1">Description</label>
                                    <textarea name="description" value={currentTicket.description} onChange={handleTicketChange} placeholder="Ticket Perks & Details" rows="2" className="w-full p-2 bg-gray-700 rounded text-white"></textarea>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <label className="block text-gray-400 text-sm">Ticket Image (Visual Stub)</label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-blue-500 bg-gray-700 ring-2 ring-blue-500/50' : (currentTicket.image ? 'border-blue-500 bg-gray-900' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50')}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                            setCurrentTicket(prev => ({ ...prev, image: e.dataTransfer.files[0] }));
                                        }
                                    }}
                                >
                                    {currentTicket.image ? (
                                        <div className="relative w-full flex justify-center">
                                            <div className="relative">
                                                <img
                                                    src={URL.createObjectURL(currentTicket.image)}
                                                    alt="Ticket"
                                                    className="w-32 h-auto rounded border-4 border-gray-700 shadow-lg"
                                                />
                                                <div className="absolute top-0 right-0 flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditClick('currentTicket.image', currentTicket.image, 16 / 9)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 shadow-md transition-transform hover:scale-110"
                                                        title="Edit Image"
                                                    >
                                                        <Pencil size={12} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCurrentTicket(prev => ({ ...prev, image: null }))}
                                                        className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                                                        title="Remove Image"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-2">
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-blue-400 font-medium hover:underline text-sm">Upload Ticket Image</span>
                                            <span className="text-gray-500 text-xs mt-1">or drag and drop</span>
                                            <input
                                                id="ticketImageInput"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleTicketImage}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                            <button type="button" onClick={addTicket} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded mt-2">Add Ticket</button>

                            {formData.tickets.length > 0 && (
                                <div className="space-y-2 mt-4">
                                    {formData.tickets.map((ticket, idx) => (
                                        <div key={idx} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                {ticket.image && <img src={URL.createObjectURL(ticket.image)} className="w-16 h-auto rounded" alt="Ticket" />}
                                                <div>
                                                    <div className="font-bold">{ticket.type} - {ticket.currency} {ticket.price}</div>
                                                    <div className="text-xs text-gray-400">{ticket.amount} available</div>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => removeTicket(idx)} className="text-red-400 hover:text-red-300">Remove</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>



                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded text-lg flex justify-center items-center">
                    {loading ? 'Creating Event & Uploading...' : 'Create Event'}
                </button>
            </form >
        </div >
    );
};

export default AddEvent;
