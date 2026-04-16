import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL as API_BASE_URL } from '../../config/api';
import { Upload, X, ArrowLeft, Plus, Trash2, Pencil, GripVertical } from 'lucide-react';
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
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImageEditorModal from '../../components/ImageEditorModal';
import { Editor } from '@tinymce/tinymce-react';
import toast from 'react-hot-toast';
import { compressImageIfNeeded } from '../../utils/imageCompression';

// Sortable Collection Item Component
const SortableCollectionItem = ({ col, idx, onEdit, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: col.id || col._id || `col-${idx}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between bg-gray-700/50 p-3 rounded border border-gray-600 ${isDragging ? 'shadow-2xl border-blue-500 scale-[1.02] ring-2 ring-blue-500/30 opacity-50' : ''}`}
        >
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white"
                >
                    <GripVertical size={20} />
                </button>
                {col.designerImage && (
                    <img
                        src={typeof col.designerImage === 'string' ? col.designerImage : URL.createObjectURL(col.designerImage)}
                        className="w-10 h-10 object-cover rounded shadow-sm"
                    />
                )}
                <div>
                    <p className="font-bold text-white text-sm leading-tight">{col.title} {col.day ? `(Day ${col.day})` : ''}</p>
                    <p className="text-xs text-gray-400">{col.images.length} images - {col.layout} ({col.gridAspectRatio})</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onEdit}
                    className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-900/20 rounded-full transition-colors"
                >
                    <Pencil size={16} />
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-full transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

const SortableTicketItem = ({ ticket, idx, onEdit, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: ticket.id || ticket._id || `ticket-${idx}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    const imageSrc = ticket.image
        ? (typeof ticket.image === 'string' ? ticket.image : URL.createObjectURL(ticket.image))
        : null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between bg-gray-700/50 p-3 rounded border border-gray-600 ${isDragging ? 'shadow-2xl border-blue-500 scale-[1.02] ring-2 ring-blue-500/30 opacity-50' : ''}`}
        >
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white"
                >
                    <GripVertical size={20} />
                </button>
                {imageSrc && (
                    <img
                        src={imageSrc}
                        alt={ticket.name}
                        className="w-12 h-12 object-cover rounded shadow-sm"
                    />
                )}
                <div>
                    <p className="font-bold text-white text-sm leading-tight">
                        {ticket.name} - {ticket.currency} ${ticket.price} (Qty: {ticket.amount})
                    </p>
                    {ticket.description && (
                        <p className="text-xs text-gray-400">{ticket.description}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onEdit}
                    className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-900/20 rounded-full transition-colors"
                >
                    <Pencil size={16} />
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-full transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

const createEmptyTicket = () => ({
    id: '',
    name: '',
    price: '',
    currency: 'USD',
    amount: 100,
    description: '',
    image: null
});

const createTicketId = () => `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const EditUpcomingEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        eventName: '',
        eventDate: '',
        location: '',
        dressCode: '',
        description: '',
        showOnLandingPage: false,
        coverImage: null,
        heroLayout: 'split',
        descriptionSection: {
            title: '',
            text: '',
            isVisible: false,
            imageSize: 'medium'
        },
        videoSection: {
            type: 'youtube',
            url: '',
            title: '',
            isVisible: true,
            file: null
        },
        ticketTypes: [],
        collections: [],
        hasTickets: false
    });

    const [currentTicket, setCurrentTicket] = useState(createEmptyTicket);
    const [editingTicketId, setEditingTicketId] = useState(null);

    const [currentCollection, setCurrentCollection] = useState({
        title: '',
        subtitle: '',
        description: '',
        designerId: null,
        designerImage: null,
        layout: 'grid',
        gridAspectRatio: 'portrait',
        day: '',
        images: []
    });

    const [partners, setPartners] = useState([]);

    // Image Editor State
    const [editorOpen, setEditorOpen] = useState(false);
    const [currentEditingImage, setCurrentEditingImage] = useState(null);
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

        let fileName = 'edited_image.jpg';
        let fileType = 'image/jpeg';
        if (currentEditingImage.file instanceof File) {
            fileName = currentEditingImage.file.name;
            fileType = currentEditingImage.file.type;
        }

        const file = new File([blob], fileName, { type: fileType });
        const { field, index } = currentEditingImage;

        if (field === 'coverImage') {
            setFormData(prev => ({ ...prev, coverImage: file }));
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

        if (editorImageSrc && typeof editorImageSrc !== 'string') URL.revokeObjectURL(editorImageSrc);
        setEditorOpen(false);
        setEditorImageSrc(null);
        setCurrentEditingImage(null);
    };

    const [designers, setDesigners] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleCollectionDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        setFormData(prev => {
            const oldIndex = prev.collections.findIndex((col, idx) => (col.id || col._id || `col-${idx}`) === active.id);
            const newIndex = prev.collections.findIndex((col, idx) => (col.id || col._id || `col-${idx}`) === over.id);

            if (oldIndex < 0 || newIndex < 0) return prev;

            return {
                ...prev,
                collections: arrayMove(prev.collections, oldIndex, newIndex)
            };
        });
    };

    const handleTicketDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        setFormData(prev => {
            const oldIndex = prev.ticketTypes.findIndex((ticket, idx) => (ticket.id || ticket._id || `ticket-${idx}`) === active.id);
            const newIndex = prev.ticketTypes.findIndex((ticket, idx) => (ticket.id || ticket._id || `ticket-${idx}`) === over.id);

            if (oldIndex < 0 || newIndex < 0) return prev;

            return {
                ...prev,
                ticketTypes: arrayMove(prev.ticketTypes, oldIndex, newIndex)
            };
        });
    };

    const resetCurrentTicket = () => {
        setCurrentTicket(createEmptyTicket());
        setEditingTicketId(null);
    };

    useEffect(() => {
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

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/upcoming-events/${id}`);
                const event = response.data;
                setFormData({
                    title: event.title,
                    eventName: event.eventName || '',
                    eventDate: event.eventDate,
                    location: event.location,
                    dressCode: event.dressCode || '',
                    description: event.description || '',
                    showOnLandingPage: event.showOnLandingPage || false,
                    coverImage: event.coverImage?.url || null,
                    heroLayout: event.heroLayout || 'split',
                    descriptionSection: {
                        title: event.descriptionSection?.title || '',
                        text: event.descriptionSection?.text || '',
                        image: event.descriptionSection?.image?.url || null,
                        credits: event.descriptionSection?.credits || '',
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
                    ticketTypes: (event.ticketTypes || []).map(t => ({
                        ...t,
                        id: t._id || createTicketId(),
                        image: t.image?.url || t.image || null
                    })),
                    collections: (event.collections || []).map(col => ({
                        ...col,
                        designerImage: col.designerImage?.url || col.designerImage,
                        images: (col.images || []).map(img => typeof img === 'string' ? img : img.url)
                    })),
                    hasTickets: event.hasTickets || false
                });
                setPartners(event.partners?.map(p => p.url) || []);
            } catch (error) {
                console.error("Error fetching event:", error);
                toast.error("Failed to load event details");
                navigate('/events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('descriptionSection.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                descriptionSection: {
                    ...prev.descriptionSection,
                    [field]: type === 'checkbox' ? checked : value
                }
            }));
        } else if (name.startsWith('videoSection.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                videoSection: {
                    ...prev.videoSection,
                    [field]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const [isDragging, setIsDragging] = useState(false);

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
            } else {
                setFormData(prev => ({ ...prev, [fieldName]: file }));
            }
        }
    };

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

    const handleTicketChange = (e) => {
        const { name, value } = e.target;
        setCurrentTicket(prev => ({ ...prev, [name]: value }));
    };

    const addTicket = () => {
        if (!currentTicket.name || !currentTicket.price) {
            toast.error("Ticket must have a Name and Price.");
            return;
        }

        const ticketToSave = {
            ...currentTicket,
            id: editingTicketId || currentTicket.id || createTicketId()
        };

        setFormData(prev => {
            const existingIndex = prev.ticketTypes.findIndex((ticket, idx) => (ticket.id || ticket._id || `ticket-${idx}`) === ticketToSave.id);

            if (existingIndex >= 0) {
                const updatedTickets = [...prev.ticketTypes];
                updatedTickets[existingIndex] = ticketToSave;
                return {
                    ...prev,
                    ticketTypes: updatedTickets
                };
            }

            return {
                ...prev,
                ticketTypes: [...prev.ticketTypes, ticketToSave]
            };
        });

        toast.success(editingTicketId ? "Ticket updated in the event draft." : "Ticket added to the event draft.");
        resetCurrentTicket();
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

    const editTicket = (ticket) => {
        setCurrentTicket({ ...ticket });
        setEditingTicketId(ticket.id || ticket._id || null);
    };

    const removeTicket = (ticketId) => {
        setFormData(prev => ({
            ...prev,
            ticketTypes: prev.ticketTypes.filter((ticket, idx) => (ticket.id || ticket._id || `ticket-${idx}`) !== ticketId)
        }));

        if (editingTicketId === ticketId) {
            resetCurrentTicket();
        }
    };

    const handleDesignerSelect = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) {
            setCurrentCollection(prev => ({
                ...prev,
                designerId: null,
                // Optional: Decide if we want to clear title/desc too. Usually better to keep them if user typed custom ones, 
                // but here the code was overwriting them on select. 
                // Let's just clear the link to the designer.
            }));
            return;
        }

        const designer = designers.find(d => d._id === selectedId);
        if (designer) {
            setCurrentCollection(prev => ({
                ...prev,
                title: designer.name,
                description: designer.bio,
                designerId: designer._id,
                designerImage: designer.image?.url,
                layout: prev.images?.length > 0 ? prev.layout : 'carousel'
            }));
        }
    };

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
                toast.error("File size too large. Maximum is 10MB.");
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
        if (currentCollection.title) {
            setFormData(prev => ({
                ...prev,
                collections: [...prev.collections, currentCollection]
            }));
            toast.success("Collection added to the event draft. Click Update Event to publish it.");
            setCurrentCollection({
                title: '',
                subtitle: '',
                description: '',
                designerId: null,
                designerImage: null,
                layout: 'grid',
                gridAspectRatio: 'portrait',
                day: '',
                images: []
            });
        } else {
            toast.error("Collection must have a Title.");
        }
    };

    const removeCollection = (index) => {
        setFormData(prev => ({
            ...prev,
            collections: prev.collections.filter((_, i) => i !== index)
        }));
    };

    const handlePartnerUpload = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setPartners(prev => [...prev, ...files]);
        }
    };

    const removePartner = (index) => {
        setPartners(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.eventDate || !formData.location) {
            toast.error("Please fill in all required fields (Title, Date, Location)");
            return;
        }

        setSubmitting(true);

        // Auto-save logic: If there's an unsaved collection in progress, add it to the list
        let finalCollections = [...formData.collections];
        if (currentCollection.title) {
            finalCollections.push({ ...currentCollection, id: currentCollection.id || currentCollection._id || `col-${Date.now()}` });
            // Verify validation for the implicit collection if needed, but for now we assume user intends to save it
            // If title is there, we try to save it.
            toast.success("Unsaved collection changes included in update.");
        }

        let finalTicketTypes = [...formData.ticketTypes];
        if (formData.hasTickets && currentTicket.name && currentTicket.price) {
            const ticketToSave = {
                ...currentTicket,
                id: editingTicketId || currentTicket.id || createTicketId()
            };
            const existingIndex = finalTicketTypes.findIndex((ticket, idx) => (ticket.id || ticket._id || `ticket-${idx}`) === ticketToSave.id);

            if (existingIndex >= 0) {
                finalTicketTypes[existingIndex] = ticketToSave;
            } else {
                finalTicketTypes.push(ticketToSave);
            }

            toast.success("Unsaved ticket changes included in update.");
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('eventName', formData.eventName);
        data.append('eventDate', formData.eventDate);
        data.append('location', formData.location);
        data.append('dressCode', formData.dressCode);
        data.append('description', formData.description);
        data.append('showOnLandingPage', formData.showOnLandingPage);
        data.append('heroLayout', formData.heroLayout);
        data.append('hasTickets', formData.hasTickets);
        data.append('removeCoverImage', formData.coverImage === null);

        if (formData.coverImage instanceof File) {
            data.append('coverImage', formData.coverImage);
        }

        const descriptionSectionData = {
            title: formData.descriptionSection.title,
            text: formData.descriptionSection.text,
            credits: formData.descriptionSection.credits,
            isVisible: formData.descriptionSection.isVisible,
            imageSize: formData.descriptionSection.imageSize,
            removeImage: formData.descriptionSection.image === null
        };
        data.append('descriptionSection', JSON.stringify(descriptionSectionData));

        if (formData.descriptionSection.image instanceof File) {
            data.append('descriptionSectionImage', formData.descriptionSection.image);
        }

        const videoSectionData = {
            type: formData.videoSection.type,
            url: formData.videoSection.type === 'youtube' ? formData.videoSection.url : '',
            title: formData.videoSection.title,
            isVisible: formData.videoSection.isVisible
        };
        data.append('videoSection', JSON.stringify(videoSectionData));
        if (formData.videoSection.type === 'upload' && formData.videoSection.file instanceof File) {
            data.append('videoSectionFile', formData.videoSection.file);
        }

        const ticketTypesMeta = finalTicketTypes.map(({ id, _id, image, ...ticket }) => ({
            ...ticket,
            image: typeof image === 'string' ? image : null
        }));
        data.append('ticketTypes', JSON.stringify(formData.hasTickets ? ticketTypesMeta : []));

        finalTicketTypes.forEach((ticket, index) => {
            if (ticket.image instanceof File) {
                data.append(`ticketImage_${index}`, ticket.image);
            }
        });

        const partnersMeta = partners.map(p => {
            if (typeof p === 'string') return { url: p };
            return { id: p.name };
        });
        data.append('partners', JSON.stringify(partnersMeta));

        partners.forEach((p, index) => {
            if (p instanceof File) {
                data.append(`partnerImage_${index}`, p);
            }
        });

        data.append('collections', JSON.stringify(finalCollections.map(col => ({
            ...col,
            images: col.images.filter(img => !(img instanceof File)),
            designerImage: typeof col.designerImage === 'string' ? col.designerImage : null
        }))));

        finalCollections.forEach((col, index) => {
            col.images.forEach(img => {
                if (img instanceof File) {
                    data.append(`collectionImages_${index}`, img);
                }
            });
            if (col.designerImage instanceof File) {
                data.append(`collectionDesignerImage_${index}`, col.designerImage);
            }
        });

        try {
            await axios.put(`${API_BASE_URL}/api/upcoming-events/update/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Upcoming Event updated successfully!');
            setTimeout(() => {
                navigate('/events');
            }, 1000);
        } catch (error) {
            console.error('Error updating upcoming event:', error);
            toast.error('Failed to update upcoming event.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-6 text-white">Loading...</div>;

    return (
        <div className="p-6 min-h-screen text-black">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-3xl font-bold text-white">Edit Upcoming Event</h1>
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
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Event Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1">Title <span className="text-red-500">*</span></label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1">Event Name</label>
                            <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" placeholder="Used for the public event heading" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Event Date <span className="text-red-500">*</span></label>
                            <input type="text" name="eventDate" value={formData.eventDate} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Location <span className="text-red-500">*</span></label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white min-h-[100px]" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="showOnLandingPage"
                                    checked={formData.showOnLandingPage}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 rounded border-gray-600 bg-gray-700"
                                />
                                <span className="text-gray-300">Enable this on landing page</span>
                            </label>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1">Hero Layout</label>
                            <select name="heroLayout" value={formData.heroLayout} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white">
                                <option value="split">Split</option>
                                <option value="full">Full Background</option>
                                <option value="minimal">Minimal</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1">Cover Image</label>
                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-900">
                                {formData.coverImage ? (
                                    <div className="relative">
                                        <img
                                            src={formData.coverImage instanceof File ? URL.createObjectURL(formData.coverImage) : formData.coverImage}
                                            alt="Preview"
                                            className="max-h-64 rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, coverImage: null }))}
                                            className="absolute -top-2 -right-2 bg-red-600 p-1 rounded-full text-white"
                                            title="Remove Image"
                                        >
                                            <X size={16} />
                                        </button>
                                        {!(formData.coverImage instanceof File) && (
                                            <p className="text-center text-gray-400 text-sm mt-2">Current Image</p>
                                        )}
                                        <label className="mt-3 block cursor-pointer text-center text-blue-400 text-sm">
                                            Replace cover image
                                            <input
                                                type="file"
                                                name="coverImage"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center">
                                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                        <span className="text-blue-400">Click to upload new image</span>
                                        <input type="file" name="coverImage" onChange={handleFileChange} accept="image/*" className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Description Section (Optional)</h2>
                    <div className="flex items-center gap-4 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="descriptionSection.isVisible" checked={formData.descriptionSection.isVisible} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-600 bg-gray-700" />
                            <span className="text-gray-400">Enable Description Section</span>
                        </label>
                    </div>
                    {formData.descriptionSection.isVisible && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Title</label>
                                <input type="text" name="descriptionSection.title" value={formData.descriptionSection.title} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Content</label>
                                <Editor
                                    apiKey="your-tinymce-api-key"
                                    onInit={(evt, editor) => {/* Editor initialized */}}
                                    value={formData.descriptionSection.text}
                                    onEditorChange={(content) => setFormData(prev => ({ ...prev, descriptionSection: { ...prev.descriptionSection, text: content } }))}
                                    init={editorConfig}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-1">Side Image</label>
                                    <input type="file" name="descriptionSection.image" onChange={handleFileChange} accept="image/*" className="w-full text-gray-400 text-sm" />
                                    {formData.descriptionSection.image && (
                                        <div className="relative mt-2">
                                            <img src={typeof formData.descriptionSection.image === 'string' ? formData.descriptionSection.image : URL.createObjectURL(formData.descriptionSection.image)} alt="Preview" className="max-h-32 rounded" />
                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, descriptionSection: { ...prev.descriptionSection, image: null } }))} className="absolute -top-1 -right-1 bg-red-600 p-1 rounded-full text-white"><X size={10} /></button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Image Size</label>
                                    <select name="descriptionSection.imageSize" value={formData.descriptionSection.imageSize} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white">
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Credits / Right Text</label>
                                <input type="text" name="descriptionSection.credits" value={formData.descriptionSection.credits} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Video Section (Optional)</h2>
                    <div className="flex items-center gap-4 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="videoSection.isVisible" checked={formData.videoSection.isVisible} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-600 bg-gray-700" />
                            <span className="text-gray-400">Enable Video Section</span>
                        </label>
                        {formData.videoSection.isVisible && (
                            <div className="flex items-center gap-4 ml-4 border-l border-gray-600 pl-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="videoSection.type" value="youtube" checked={formData.videoSection.type === 'youtube'} onChange={handleInputChange} />
                                    <span className="text-gray-400">YouTube URL</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="videoSection.type" value="upload" checked={formData.videoSection.type === 'upload'} onChange={handleInputChange} />
                                    <span className="text-gray-400">Direct Upload</span>
                                </label>
                            </div>
                        )}
                    </div>
                    {formData.videoSection.isVisible && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Video Title</label>
                                <input type="text" name="videoSection.title" value={formData.videoSection.title} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                            </div>
                            {formData.videoSection.type === 'youtube' ? (
                                <div>
                                    <label className="block text-gray-400 mb-1">YouTube URL</label>
                                    <input type="text" name="videoSection.url" value={formData.videoSection.url} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" placeholder="https://www.youtube.com/watch?v=..." />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-gray-400 mb-1">Video File</label>
                                    <input type="file" name="videoSection.file" onChange={handleFileChange} accept="video/*" className="w-full text-gray-400 text-sm" />
                                    {formData.videoSection.url && !formData.videoSection.file && (
                                        <video src={formData.videoSection.url} className="mt-2 max-h-32 rounded" controls />
                                    )}
                                    {formData.videoSection.file && (
                                        <div className="mt-2 text-sm text-green-400">New video file ready</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={`bg-gray-800 p-6 rounded-lg border border-gray-700 ${!formData.hasTickets ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-blue-400">Ticket Types</h2>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-gray-400 text-sm italic">Enable Tickets</span>
                            <input
                                type="checkbox"
                                name="hasTickets"
                                checked={formData.hasTickets}
                                onChange={handleInputChange}
                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1 text-sm">Dress Code</label>
                        <input
                            type="text"
                            name="dressCode"
                            value={formData.dressCode}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-gray-700 rounded text-white text-sm"
                            placeholder="e.g. Black Tie / Cocktail Attire"
                            disabled={!formData.hasTickets}
                        />
                    </div>
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-4">
                            <label className="block text-gray-400 mb-1 text-sm">Ticket Name</label>
                            <input
                                type="text"
                                name="name"
                                value={currentTicket.name}
                                onChange={handleTicketChange}
                                className="w-full p-2 bg-gray-700 rounded text-white text-sm"
                                disabled={!formData.hasTickets}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1 text-sm">Qty</label>
                            <input
                                type="number"
                                name="amount"
                                value={currentTicket.amount}
                                onChange={handleTicketChange}
                                className="w-full p-2 bg-gray-700 rounded text-white text-sm"
                                placeholder="100"
                                disabled={!formData.hasTickets}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1 text-sm">Currency</label>
                            <input
                                type="text"
                                name="currency"
                                value={currentTicket.currency}
                                onChange={handleTicketChange}
                                className="w-full p-2 bg-gray-700 rounded text-white text-sm"
                                placeholder="USD"
                                disabled={!formData.hasTickets}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1 text-sm">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={currentTicket.price}
                                onChange={handleTicketChange}
                                className="w-full p-2 bg-gray-700 rounded text-white"
                                disabled={!formData.hasTickets}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-gray-400 mb-1 text-sm">Ticket Image</label>
                            <input
                                type="file"
                                onChange={handleTicketImage}
                                accept="image/*"
                                className="w-full text-gray-400 text-xs mt-1"
                                disabled={!formData.hasTickets}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <button
                                type="button"
                                onClick={addTicket}
                                className="bg-blue-600 p-2 rounded hover:bg-blue-700 text-white h-[42px] w-full"
                                disabled={!formData.hasTickets}
                                title={editingTicketId ? 'Update ticket' : 'Add ticket'}
                            >
                                {editingTicketId ? <Pencil size={18} className="mx-auto" /> : <Plus className="mx-auto" />}
                            </button>
                        </div>
                        <div className="md:col-span-12">
                            <label className="block text-gray-400 mb-1 text-sm">Description</label>
                            <textarea
                                name="description"
                                value={currentTicket.description}
                                onChange={handleTicketChange}
                                className="w-full p-2 bg-gray-700 rounded text-white min-h-[100px]"
                                disabled={!formData.hasTickets}
                            />
                        </div>
                    </div>

                    {currentTicket.image && (
                        <div className="mb-4 flex items-center gap-3 rounded border border-gray-600 bg-gray-900 p-3">
                            <img
                                src={typeof currentTicket.image === 'string' ? currentTicket.image : URL.createObjectURL(currentTicket.image)}
                                alt="Current ticket preview"
                                className="h-14 w-14 rounded object-cover"
                            />
                            <div className="flex-1 text-sm text-gray-300">
                                {editingTicketId ? 'Editing selected ticket image' : 'Ticket image ready'}
                            </div>
                            <button
                                type="button"
                                onClick={() => setCurrentTicket(prev => ({ ...prev, image: null }))}
                                className="rounded-full bg-red-900/30 p-2 text-red-400 hover:text-red-300"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    {editingTicketId && (
                        <div className="mb-4 flex justify-end">
                            <button
                                type="button"
                                onClick={resetCurrentTicket}
                                className="text-sm text-gray-400 hover:text-white"
                            >
                                Cancel ticket edit
                            </button>
                        </div>
                    )}

                    {formData.hasTickets && formData.ticketTypes.length > 0 && (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleTicketDragEnd}
                        >
                            <SortableContext
                                items={formData.ticketTypes.map((ticket, idx) => ticket.id || ticket._id || `ticket-${idx}`)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {formData.ticketTypes.map((ticket, idx) => (
                                        <SortableTicketItem
                                            key={ticket.id || ticket._id || `ticket-${idx}`}
                                            ticket={ticket}
                                            idx={idx}
                                            onEdit={() => editTicket(ticket)}
                                            onRemove={() => removeTicket(ticket.id || ticket._id || `ticket-${idx}`)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

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
                                {partners.map((p, idx) => (
                                    <div key={idx} className="relative group aspect-square bg-white/5 rounded flex items-center justify-center p-2">
                                        <img
                                            src={p instanceof File ? URL.createObjectURL(p) : p}
                                            alt={`Partner ${idx}`}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePartner(idx)}
                                            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-transform hover:scale-110"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-blue-400">Designer Collections</h2>
                    </div>

                    <div className="space-y-6 mb-8 p-4 bg-gray-900 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Select Designer (Optional)</label>
                                <select
                                    value={currentCollection.designerId || ''}
                                    onChange={handleDesignerSelect}
                                    className="w-full p-2 bg-gray-700 rounded text-white text-sm"
                                >
                                    <option value="">-- Choose Designer --</option>
                                    {designers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Collection Title <span className="text-red-500">*</span></label>
                                <input type="text" name="title" value={currentCollection.title} onChange={handleCollectionChange} className="w-full p-2 bg-gray-700 rounded text-white text-sm" placeholder="e.g. Summer Collection" />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Subtitle</label>
                                <input type="text" name="subtitle" value={currentCollection.subtitle} onChange={handleCollectionChange} className="w-full p-2 bg-gray-700 rounded text-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Aspect Ratio</label>
                                <select name="gridAspectRatio" value={currentCollection.gridAspectRatio} onChange={handleCollectionChange} className="w-full p-2 bg-gray-700 rounded text-white text-sm">
                                    <option value="portrait">Portrait (3:4)</option>
                                    <option value="landscape">Landscape (16:9)</option>
                                    <option value="square">Square (1:1)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Day</label>
                                <select name="day" value={currentCollection.day} onChange={handleCollectionChange} className="w-full p-2 bg-gray-700 rounded text-white text-sm">
                                    <option value="">None</option>
                                    <option value="1">Day 1</option>
                                    <option value="2">Day 2</option>
                                    <option value="3">Day 3</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-400 mb-1 text-sm">Designer Biography</label>
                                <textarea name="description" value={currentCollection.description} onChange={handleCollectionChange} className="w-full p-2 bg-gray-700 rounded text-white text-sm min-h-[60px]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Designer Image</label>
                                <div className="flex items-center gap-4">
                                    {currentCollection.designerImage && (
                                        <img src={typeof currentCollection.designerImage === 'string' ? currentCollection.designerImage : URL.createObjectURL(currentCollection.designerImage)} className="w-16 h-16 object-cover rounded shadow-lg border border-gray-600" />
                                    )}
                                    <label className="flex-1 cursor-pointer bg-gray-700 p-2 rounded border border-dashed border-gray-500 text-center hover:bg-gray-600 transition-colors">
                                        <span className="text-xs text-blue-400 flex items-center justify-center gap-2"><Upload size={14} /> Upload Designer Photo</span>
                                        <input type="file" onChange={handleDesignerImage} accept="image/*" className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Collection Images <span className="text-red-500">*</span></label>
                                <label className="cursor-pointer bg-blue-600/20 p-2 rounded border border-dashed border-blue-500/50 block text-center hover:bg-blue-600/30 transition-colors">
                                    <span className="text-xs text-blue-400 flex items-center justify-center gap-2"><Plus size={14} /> Add Images</span>
                                    <input type="file" multiple onChange={handleCollectionImages} accept="image/*" className="hidden" />
                                </label>
                            </div>
                        </div>

                        {currentCollection.images.length > 0 && (
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                {currentCollection.images.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={img instanceof File ? URL.createObjectURL(img) : img} className="w-full aspect-square object-cover rounded shadow-sm border border-gray-700" />
                                        <button type="button" onClick={() => removeCollectionImage(idx)} className="absolute -top-1 -right-1 bg-red-600 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button type="button" onClick={addCollection} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold shadow-lg transition-transform active:scale-[0.98]">
                            Add/Update Collection to Event
                        </button>
                    </div>

                    {formData.collections.length > 0 && (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleCollectionDragEnd}
                        >
                            <SortableContext
                                items={formData.collections.map((col, idx) => col.id || col._id || `col-${idx}`)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {formData.collections.map((col, idx) => (
                                        <SortableCollectionItem
                                            key={col.id || col._id || `col-${idx}`}
                                            col={col}
                                            idx={idx}
                                            onEdit={() => {
                                                setCurrentCollection(col);
                                                removeCollection(idx);
                                            }}
                                            onRemove={() => removeCollection(idx)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50">
                        {submitting ? 'Updating...' : 'Update Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUpcomingEvent;
