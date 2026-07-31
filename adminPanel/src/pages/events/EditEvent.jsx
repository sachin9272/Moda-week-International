import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL as API_BASE_URL } from '../../config/api';
import { Upload, X, ArrowLeft, Pencil } from 'lucide-react';
import ImageEditorModal from '../../components/ImageEditorModal';
import { Editor } from '@tinymce/tinymce-react';
import toast from 'react-hot-toast';
import { compressImageIfNeeded } from '../../utils/imageCompression';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const SortableCollectionItem = ({ col, idx, startEditCollection, removeCollection }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: col.id || `col-${idx}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-gray-700 p-4 rounded flex justify-between items-center group border border-gray-600 hover:border-blue-500/50 transition-all shadow-sm"
        >
            <div className="flex items-center gap-3">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-600 rounded transition-colors text-gray-500 hover:text-gray-300"
                >
                    <GripVertical size={20} />
                </div>
                <div>
                    <div className="font-bold text-white">
                        {col.title} <span className="text-sm font-normal text-gray-400">({col.subtitle})</span>
                    </div>
                    <div className="text-xs text-gray-400">
                        {col.images?.length || 0} images - Layout: {col.layout} ({col.gridAspectRatio})
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => startEditCollection(idx)}
                    className="text-blue-400 hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-400/10 transition-colors"
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => removeCollection(idx)}
                    className="text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-400/10 transition-colors"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        city: '',
        eventName: '',
        date: '',
        eventType: 'upcoming',
        status: 'draft',
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
        designerImage: null,
        layout: 'grid', // Default collection layout
        gridAspectRatio: 'portrait',
        day: '', // Add Day field
        dayLabel: '',
        images: []
    });

    const [partners, setPartners] = useState([]); // Array of {url, file?}

    // ...

    // Partner Handlers
    const handlePartnerUpload = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setPartners(prev => [...prev, ...files.map(f => ({ url: URL.createObjectURL(f), file: f }))]);
        }
    };

    const removePartner = (index) => {
        setPartners(prev => prev.filter((_, i) => i !== index));
    };

    const [designers, setDesigners] = useState([]);



    // Image Editor State
    const [editorOpen, setEditorOpen] = useState(false);
    const [currentEditingImage, setCurrentEditingImage] = useState(null);
    const [editorImageSrc, setEditorImageSrc] = useState(null);

    const handleEditClick = (field, fileOrUrl, aspect = 16 / 9, index = null) => {
        let imageUrl;
        if (fileOrUrl instanceof File) {
            imageUrl = URL.createObjectURL(fileOrUrl);
        } else if (typeof fileOrUrl === 'string') {
            imageUrl = fileOrUrl;
        } else if (fileOrUrl && fileOrUrl.url) {
            imageUrl = fileOrUrl.url;
        } else {
            return;
        }
        setEditorImageSrc(imageUrl);
        setEditorOpen(true);
        setCurrentEditingImage({ field, file: fileOrUrl, aspect, index });
    };

    const handleSaveEditedImage = (blob) => {
        if (!currentEditingImage) return;

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
        if (editorImageSrc && editorImageSrc.startsWith('blob:')) {
            URL.revokeObjectURL(editorImageSrc);
        }
        setEditorOpen(false);
        setEditorImageSrc(null);
        setCurrentEditingImage(null);
    };

    React.useEffect(() => {
        const fetchDesigners = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/fashion-designers?limit=100`);
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
                description: designer.bio || prev.description,
                designerId: designer._id, // Save ID
                designerImage: designer.image?.url // Auto-fill image if available
            }));
        }
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
                const event = response.data;
                setFormData({
                    city: event.city,
                    eventName: event.eventName,
                    date: event.date,
                    eventType: event.eventType || 'upcoming',
                    status: event.status || 'draft',
                    heroLayout: event.heroLayout || 'split',
                    // Handle object vs string for backward compatibility
                    thumbnail: event.thumbnail?.url || event.thumbnail,


                    collections: event.collections.map((col, idx) => ({
                        ...col,
                        id: col._id || `col-${idx}`, // Ensure each collection has an ID for dnd-kit
                        designerImage: col.designerImage?.url || col.designerImage,
                        gridAspectRatio: col.gridAspectRatio || 'portrait',
                        day: col.day || '', // Populate Day
                        dayLabel: col.dayLabel || '',
                        images: col.images.map(img => {
                            if (typeof img === 'string') return img;
                            return img?.url;
                        }).filter(url => url && typeof url === 'string')
                    })),
                    descriptionSection: {
                        title: event.descriptionSection?.title || '',
                        text: event.descriptionSection?.text || '',
                        credits: event.descriptionSection?.credits || '',
                        image: event.descriptionSection?.image?.url || event.descriptionSection?.image,
                        isVisible: event.descriptionSection?.isVisible || false,
                        imageSize: event.descriptionSection?.imageSize || 'medium'
                    },
                    videoSection: {
                        type: event.videoSection?.type || 'youtube',
                        url: event.videoSection?.url || '',
                        title: event.videoSection?.title || '',
                        isVisible: event.videoSection?.isVisible !== false,
                        file: null
                    },
                    hasTickets: event.hasTickets || false,
                    tickets: (event.tickets || []).map(t => ({
                        type: t.type,
                        price: t.price,
                        currency: t.currency,
                        amount: t.amount,
                        description: t.description,
                        image: t.image?.url || t.image
                    }))
                });
                // Populate Partners
                if (event.partners && Array.isArray(event.partners)) {
                    setPartners(event.partners.map(s => ({
                        url: s.url,
                        publicId: s.publicId
                    })));
                }


            } catch (error) {
                console.error("Error fetching event:", error);
                toast.error("Failed to fetch event details");
            } finally {
                setFetching(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('descriptionSection.')) {
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


            if (name === 'descriptionSection.image') {
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

    const [isDragging, setIsDragging] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setFormData((prev) => {
                const oldIndex = prev.collections.findIndex((c, i) => (c.id || `col-${i}`) === active.id);
                const newIndex = prev.collections.findIndex((c, i) => (c.id || `col-${i}`) === over.id);

                return {
                    ...prev,
                    collections: arrayMove(prev.collections, oldIndex, newIndex),
                };
            });
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
    };

    const [editingIndex, setEditingIndex] = useState(null);

    const handleCollectionChange = (e) => {
        const { name, value } = e.target;
        setCurrentCollection(prev => {
            if (name === 'day') {
                return {
                    ...prev,
                    day: value,
                    dayLabel: value === 'custom' ? prev.dayLabel : ''
                };
            }

            return { ...prev, [name]: value };
        });
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

    const removeCollectionImage = (index) => {
        setCurrentCollection(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
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
    }

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

    const saveCollection = () => {
        if (currentCollection.day === 'custom' && !currentCollection.dayLabel?.trim()) {
            toast.error("Please enter a custom day name.");
            return;
        }

        if (currentCollection.title && currentCollection.images.length > 0) {
            if (editingIndex !== null) {
                // Update existing
                setFormData(prev => {
                    const updatedCollections = [...prev.collections];
                    updatedCollections[editingIndex] = {
                        ...currentCollection,
                        id: currentCollection.id || `col-${Date.now()}`
                    };
                    return { ...prev, collections: updatedCollections };
                });
                setEditingIndex(null);
            } else {
                // Add new
                const newCollection = {
                    ...currentCollection,
                    id: `col-${Date.now()}`
                };
                setFormData(prev => ({
                    ...prev,
                    collections: [...prev.collections, newCollection]
                }));
            }
            setCurrentCollection({ title: '', subtitle: '', description: '', designerId: null, designerImage: null, layout: 'grid', gridAspectRatio: 'portrait', day: '', dayLabel: '', images: [] });
            // Reset file input if possible
            const fileInput = document.getElementById('collectionImagesInput');
            if (fileInput) fileInput.value = '';
            const diInput = document.getElementById('designerImageInput');
            if (diInput) diInput.value = '';
        } else {
            toast.error("Collection must have a title and at least one image.");
        }
    };

    const startEditCollection = (index) => {
        setEditingIndex(index);
        setCurrentCollection(formData.collections[index]);
        // Scroll to form (optional, but good UX)
        const formElement = document.getElementById('collectionForm');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    };

    const cancelEditCollection = () => {
        setEditingIndex(null);
        setCurrentCollection({ title: '', subtitle: '', description: '', designerId: null, designerImage: null, layout: 'grid', gridAspectRatio: 'portrait', day: '', dayLabel: '', images: [] });
    };

    const removeCollection = (index) => {
        if (editingIndex === index) {
            cancelEditCollection();
        }
        setFormData(prev => ({
            ...prev,
            collections: prev.collections.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('city', formData.city);
        data.append('eventName', formData.eventName);
        data.append('date', formData.date);

        data.append('eventType', 'past');
        data.append('status', formData.status); // Add status
        data.append('heroLayout', formData.heroLayout);
        data.append('removeThumbnail', formData.thumbnail === null);

        console.log('EditEvent - Submit - Image State:', formData.descriptionSection.image);
        console.log('EditEvent - Submit - Image Type:', typeof formData.descriptionSection.image);
        if (formData.descriptionSection.image && typeof formData.descriptionSection.image === 'object') {
            console.log('EditEvent - Submit - Image Object Keys:', Object.keys(formData.descriptionSection.image));
            console.log('EditEvent - Submit - Image URL:', formData.descriptionSection.image.url);
        }

        const descriptionSectionData = {
            title: formData.descriptionSection.title,
            text: formData.descriptionSection.text,
            credits: formData.descriptionSection.credits,
            isVisible: formData.descriptionSection.isVisible,
            imageSize: formData.descriptionSection.imageSize,
            image: undefined,
            removeImage: formData.descriptionSection.image === null
        };

        // Determine image value to send in JSON
        if (typeof formData.descriptionSection.image === 'string') {
            descriptionSectionData.image = formData.descriptionSection.image;
        } else if (formData.descriptionSection.image && formData.descriptionSection.image.url) {
            // If state has the image object (e.g. from fetch), send the URL
            descriptionSectionData.image = formData.descriptionSection.image.url;
        }
        // If it's a File object (upload), we leave image as undefined in JSON and let file upload handle it

        data.append('descriptionSection', JSON.stringify(descriptionSectionData));

        if (formData.descriptionSection.image instanceof File) {
            data.append('descriptionSectionImage', formData.descriptionSection.image);
        } else if (formData.descriptionSection.image && typeof formData.descriptionSection.image !== 'string' && !formData.descriptionSection.image.url) {
            // Fallback for file if instanceof check fails or other object types
            // But really we should rely on instanceof File or standard check
            if (formData.descriptionSection.image.name) { // It's likely a file
                data.append('descriptionSectionImage', formData.descriptionSection.image);
            }
        }

        const videoSectionData = {
            type: formData.videoSection.type,
            url: formData.videoSection.type === 'youtube' ? formData.videoSection.url :
                (formData.videoSection.file ? '' : formData.videoSection.url),
            title: formData.videoSection.title,
            isVisible: formData.videoSection.isVisible
        };
        data.append('videoSection', JSON.stringify(videoSectionData));
        if (formData.videoSection.type === 'upload' && formData.videoSection.file) {
            data.append('videoSectionFile', formData.videoSection.file);
        }

        if (formData.thumbnail && typeof formData.thumbnail !== 'string') {
            data.append('thumbnail', formData.thumbnail);
        }





        // Handle collections
        // For existing collections with URLs, we need to pass them back.
        // For new images in new collections, they are files.
        const collectionsMeta = formData.collections.map(col => {
            const meta = {
                title: col.title,
                subtitle: col.subtitle,
                description: col.description,
                designerId: col.designerId, // Include ID
                layout: col.layout,
                designerImage: typeof col.designerImage === 'string' ? col.designerImage : undefined,
                gridAspectRatio: col.gridAspectRatio,
                dayLabel: col.day === 'custom' ? (col.dayLabel || '').trim() : '',
                images: col.images.filter(img => typeof img === 'string') // Only pass existing URLs in metadata
            };
            if (col.day) {
                meta.day = col.day; // Only include Day if selected (optional field)
            }
            return meta;
        });
        data.append('collections', JSON.stringify(collectionsMeta));

        formData.collections.forEach((col, index) => {
            col.images.forEach((file) => {
                if (typeof file !== 'string') {
                    data.append(`collectionImages_${index}`, file);
                }
            });
            if (col.designerImage && typeof col.designerImage !== 'string') {
                data.append(`collectionDesignerImage_${index}`, col.designerImage);
            }
        });

        // Add Tickets Data
        data.append('hasTickets', formData.hasTickets);
        const ticketsMeta = formData.tickets.map(t => ({
            type: t.type,
            price: t.price,
            currency: t.currency,
            amount: t.amount,
            description: t.description,
            image: (typeof t.image === 'string') ? t.image : undefined
        }));
        data.append('tickets', JSON.stringify(ticketsMeta));

        formData.tickets.forEach((ticket, index) => {
            if (ticket.image && typeof ticket.image !== 'string') {
                data.append(`ticketImage_${index}`, ticket.image);
            }
        });

        // 7. Handle Partners Update
        const partnersMeta = partners.map((p, i) => ({
            url: p.file ? undefined : p.url,
            id: i
        }));
        data.append('partners', JSON.stringify(partnersMeta));

        partners.forEach((item, index) => {
            if (item.file) {
                data.append(`partnerImage_${index}`, item.file);
            }
        });

        try {
            await axios.put(`${API_BASE_URL}/api/events/update/${id}`, data);
            toast.success('Event updated successfully!');
            setTimeout(() => {
                navigate('/events');
            }, 1000);
        } catch (error) {
            console.error('Error updating event:', error);
            toast.error('Failed to update event. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-6 text-white">Loading event details...</div>;

    return (
        <div className="p-6 min-h-screen text-black">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-400 rounded-full transition-colors"
                    title="Go Back"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-3xl font-bold text-white">Edit Event</h1>
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
                            <label className="block text-gray-400 mb-1">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" required />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Event Name</label>
                            <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" required />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Date</label>
                            <input type="text" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" required />
                        </div>



                        <div>
                            <label className="block text-gray-400 mb-1">Thumbnail Image</label>
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-blue-500 bg-gray-700 ring-2 ring-blue-500/50' : (formData.thumbnail ? 'border-blue-500 bg-gray-900' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50')}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, 'thumbnail')}
                            >
                                {formData.thumbnail ? (
                                    <div className="relative w-full">
                                        <img
                                            src={typeof formData.thumbnail === 'string' ? formData.thumbnail : URL.createObjectURL(formData.thumbnail)}
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
                                        <p className="mt-2 text-sm text-gray-400">{typeof formData.thumbnail === 'string' ? 'Current Image' : formData.thumbnail.name}</p>
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
                                                src={typeof formData.descriptionSection.image === 'string' ? formData.descriptionSection.image : (formData.descriptionSection.image.url || URL.createObjectURL(formData.descriptionSection.image))}
                                                alt="Description Preview"
                                                className="max-h-64 w-auto mx-auto rounded shadow-lg"
                                            />
                                            <div className="absolute -top-2 -right-2 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditClick('descriptionSection.image', formData.descriptionSection.image, 4 / 3)}
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
                                                {typeof formData.descriptionSection.image === 'string'
                                                    ? 'Current Image'
                                                    : (formData.descriptionSection.image.url ? 'Current Image' : formData.descriptionSection.image.name)}
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
                                        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-blue-500 bg-gray-700 ring-2 ring-blue-500/50' : (formData.videoSection.file || formData.videoSection.url ? 'border-blue-500 bg-gray-900' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50')}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, 'videoSection.file')}
                                    >
                                        {(formData.videoSection.file || (formData.videoSection.url && typeof formData.videoSection.url === 'string')) ? (
                                            <div className="relative w-full">
                                                <video
                                                    src={formData.videoSection.file ? URL.createObjectURL(formData.videoSection.file) : formData.videoSection.url}
                                                    className="max-h-64 w-auto mx-auto rounded shadow-lg"
                                                    controls
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, videoSection: { ...prev.videoSection, file: null, url: '' } }))} // Clear both
                                                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                                                    title="Remove Video"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <p className="mt-2 text-sm text-gray-400">{formData.videoSection.file ? formData.videoSection.file.name : 'Current Video'}</p>
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
                                {partners.map((partner, idx) => (
                                    <div key={idx} className="relative group aspect-square bg-white/5 rounded flex items-center justify-center p-2">
                                        <img
                                            src={partner.url}
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

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700" id="collectionForm">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Collections (Designers/Photos)</h2>

                    <div className={`mb-4 space-y-4 border p-4 ${editingIndex !== null ? 'border-blue-500 bg-gray-900' : 'border-gray-600'} rounded`}>
                        <h3 className="font-semibold text-white">{editingIndex !== null ? 'Editing Collection' : 'Add New Collection'}</h3>

                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1 text-sm">Select Designer (Auto-fill)</label>
                            <select name="designerId" value={currentCollection.designerId || ''} onChange={handleDesignerSelect} className="w-full p-2 bg-gray-700 rounded text-white border border-gray-600 focus:border-blue-500">
                                <option value="">-- Choose a Vendor/Designer --</option>
                                {designers.map(d => (
                                    <option key={d._id} value={d._id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="title" value={currentCollection.title} onChange={handleCollectionChange} placeholder="Title (e.g., Designer Name)" className="w-full p-2 bg-gray-700 rounded text-white" />
                            <input type="text" name="subtitle" value={currentCollection.subtitle} onChange={handleCollectionChange} placeholder="Subtitle (optional)" className="w-full p-2 bg-gray-700 rounded text-white" />
                            <textarea name="description" value={currentCollection.description || ''} onChange={handleCollectionChange} placeholder="Description / Biography (Optional)" rows="3" className="w-full p-2 bg-gray-700 rounded text-white md:col-span-2"></textarea>
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
                                    <label className="block text-gray-400 mb-1 text-sm">Grid Aspect Ratio</label>
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
                                        <option value="4">Day 4</option>
                                        <option value="5">Day 5</option>
                                        <option value="custom">Custom Name</option>
                                    </select>
                                    {currentCollection.day === 'custom' && (
                                        <input
                                            type="text"
                                            name="dayLabel"
                                            value={currentCollection.dayLabel || ''}
                                            onChange={handleCollectionChange}
                                            placeholder="Enter custom day name"
                                            className="mt-2 w-full p-2 bg-gray-700 rounded text-white"
                                        />
                                    )}
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
                                                    onClick={() => handleEditClick('currentCollection.designerImage', currentCollection.designerImage, 1)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                                                    title="Edit Image"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentCollection(prev => ({ ...prev, designerImage: null }))}
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
                                            <button type="button" onClick={() => handleEditClick('currentCollection.image', file, 3 / 4, idx)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 shadow-md transition-colors">
                                                <Pencil size={14} />
                                            </button>
                                            <button type="button" onClick={() => removeCollectionImage(idx)} className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button type="button" onClick={saveCollection} className={`flex-1 py-2 rounded mt-2 text-white ${editingIndex !== null ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {editingIndex !== null ? 'Update Collection' : 'Add Collection'}
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
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={formData.collections.map((c, i) => c.id || `col-${i}`)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {formData.collections.map((col, idx) => (
                                        <SortableCollectionItem
                                            key={col.id || `col-${idx}`}
                                            col={col}
                                            idx={idx}
                                            startEditCollection={startEditCollection}
                                            removeCollection={removeCollection}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
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
                                            src={file.url}
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
                            <h3 className="font-semibold text-white">Add New Ticket</h3>
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
                                                    src={typeof currentTicket.image === 'string' ? currentTicket.image : URL.createObjectURL(currentTicket.image)}
                                                    alt="Ticket"
                                                    className="w-32 h-auto rounded border-4 border-gray-700 shadow-lg"
                                                />
                                                <div className="absolute top-0 right-0 flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditClick('currentTicket.image', currentTicket.image, 16 / 9)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                                                        title="Edit Image"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCurrentTicket(prev => ({ ...prev, image: null }))}
                                                        className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
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
                            <button type="button" onClick={addTicket} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded mt-2 text-white">Add Ticket</button>

                            {formData.tickets.length > 0 && (
                                <div className="space-y-2 mt-4">
                                    {formData.tickets.map((ticket, idx) => (
                                        <div key={idx} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                {ticket.image && <img src={typeof ticket.image === 'string' ? ticket.image : URL.createObjectURL(ticket.image)} className="w-16 h-auto rounded" alt="Ticket" />}
                                                <div>
                                                    <div className="font-bold text-white">{ticket.type} - {ticket.currency} {ticket.price}</div>
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
                    {loading ? 'Updating Event...' : 'Update Event'}
                </button>
            </form>
        </div>
    );
};

export default EditEvent;
