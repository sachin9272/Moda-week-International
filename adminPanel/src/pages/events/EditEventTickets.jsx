import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL as API_BASE_URL } from '../../config/api';
import { ArrowLeft, Crop, GripVertical, Loader, Pencil, Plus, Ticket, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { compressImageIfNeeded } from '../../utils/imageCompression';
import ImageEditorModal from '../../components/ImageEditorModal';
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
            className={`flex items-center justify-between rounded border border-gray-600 bg-gray-700/50 p-3 ${isDragging ? 'scale-[1.02] border-blue-500 opacity-50 shadow-2xl ring-2 ring-blue-500/30' : ''}`}
        >
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab rounded p-1 text-gray-400 hover:bg-gray-600 hover:text-white active:cursor-grabbing"
                >
                    <GripVertical size={20} />
                </button>
                {imageSrc && (
                    <img
                        src={imageSrc}
                        alt={ticket.name}
                        className="h-12 w-12 rounded object-cover shadow-sm"
                        crossOrigin="anonymous"
                    />
                )}
                <div>
                    <p className="text-sm font-bold leading-tight text-white">
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
                    className="rounded-full p-2 text-blue-400 transition-colors hover:bg-blue-900/20 hover:text-blue-300"
                >
                    <Pencil size={16} />
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="rounded-full p-2 text-red-400 transition-colors hover:bg-red-900/20 hover:text-red-300"
                >
                    <X size={16} />
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

export default function EditEventTickets() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [event, setEvent] = useState(null);
    const [hasTickets, setHasTickets] = useState(false);
    const [dressCode, setDressCode] = useState('');
    const [ticketBannerImage, setTicketBannerImage] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [currentTicket, setCurrentTicket] = useState(createEmptyTicket());
    const [editingTicketId, setEditingTicketId] = useState(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorImageSrc, setEditorImageSrc] = useState(null);
    const [editorTarget, setEditorTarget] = useState('banner');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/upcoming-events/${id}`);
                const eventData = response.data;
                setEvent(eventData);
                setHasTickets(eventData.hasTickets || false);
                setDressCode(eventData.dressCode || '');
                setTicketBannerImage(eventData.ticketBannerImage?.url || null);
                setTicketTypes(
                    (eventData.ticketTypes || []).map((ticket) => ({
                        ...ticket,
                        id: ticket._id || createTicketId(),
                        image: ticket.image?.url || ticket.image || null,
                    }))
                );
            } catch (error) {
                console.error('Error fetching event tickets:', error);
                toast.error('Failed to load event tickets.');
                navigate('/tickets');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, navigate]);

    const handleTicketChange = (e) => {
        const { name, value } = e.target;
        setCurrentTicket((prev) => ({ ...prev, [name]: value }));
    };

    const handleTicketImage = async (e) => {
        if (e.target.files && e.target.files[0]) {
            let file = e.target.files[0];

            if (file.type.startsWith('image/')) {
                file = await compressImageIfNeeded(file);
            } else if (file.size > 10 * 1024 * 1024) {
                toast.error('File size too large. Maximum is 10MB.');
                e.target.value = '';
                return;
            }

            setCurrentTicket((prev) => ({ ...prev, image: file }));
        }
    };

    const handleTicketBannerImage = async (e) => {
        if (e.target.files && e.target.files[0]) {
            let file = e.target.files[0];

            if (file.type.startsWith('image/')) {
                file = await compressImageIfNeeded(file);
            } else if (file.size > 10 * 1024 * 1024) {
                toast.error('File size too large. Maximum is 10MB.');
                e.target.value = '';
                return;
            }

            setTicketBannerImage(file);
        }
    };

    const handleEditBannerImage = () => {
        if (!ticketBannerImage) return;
        const imageUrl = typeof ticketBannerImage === 'string'
            ? ticketBannerImage
            : URL.createObjectURL(ticketBannerImage);
        setEditorTarget('banner');
        setEditorImageSrc(imageUrl);
        setEditorOpen(true);
    };

    const handleEditTicketImage = () => {
        if (!currentTicket.image) return;
        const imageUrl = typeof currentTicket.image === 'string'
            ? currentTicket.image
            : URL.createObjectURL(currentTicket.image);
        setEditorTarget('ticket');
        setEditorImageSrc(imageUrl);
        setEditorOpen(true);
    };

    const handleSaveEditedImage = (blob) => {
        if (editorTarget === 'banner') {
            const fileName = ticketBannerImage instanceof File ? ticketBannerImage.name : 'ticket_banner_image.jpg';
            const fileType = ticketBannerImage instanceof File ? ticketBannerImage.type : 'image/jpeg';
            const file = new File([blob], fileName, { type: fileType });

            setTicketBannerImage(file);
        } else {
            const fileName = currentTicket.image instanceof File ? currentTicket.image.name : 'ticket_image.jpg';
            const fileType = currentTicket.image instanceof File ? currentTicket.image.type : 'image/jpeg';
            const file = new File([blob], fileName, { type: fileType });

            setCurrentTicket((prev) => ({ ...prev, image: file }));
        }
        setEditorOpen(false);
        setEditorImageSrc(null);
    };

    const resetCurrentTicket = () => {
        setCurrentTicket(createEmptyTicket());
        setEditingTicketId(null);
    };

    const addTicket = () => {
        if (!currentTicket.name || !currentTicket.price) {
            toast.error('Ticket must have a Name and Price.');
            return;
        }

        const ticketToSave = {
            ...currentTicket,
            id: editingTicketId || currentTicket.id || createTicketId(),
        };

        setTicketTypes((prev) => {
            const existingIndex = prev.findIndex((ticket, idx) => (ticket.id || ticket._id || `ticket-${idx}`) === ticketToSave.id);

            if (existingIndex >= 0) {
                const updatedTickets = [...prev];
                updatedTickets[existingIndex] = ticketToSave;
                return updatedTickets;
            }

            return [...prev, ticketToSave];
        });

        toast.success(editingTicketId ? 'Ticket updated in draft.' : 'Ticket added to draft.');
        resetCurrentTicket();
    };

    const editTicket = (ticket) => {
        setCurrentTicket({ ...ticket });
        setEditingTicketId(ticket.id || ticket._id || null);
    };

    const removeTicket = (ticketId) => {
        setTicketTypes((prev) => prev.filter((ticket, idx) => (ticket.id || ticket._id || `ticket-${idx}`) !== ticketId));
        if (editingTicketId === ticketId) {
            resetCurrentTicket();
        }
    };

    const handleTicketDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setTicketTypes((prev) => {
            const oldIndex = prev.findIndex((ticket, idx) => (ticket.id || ticket._id || `ticket-${idx}`) === active.id);
            const newIndex = prev.findIndex((ticket, idx) => (ticket.id || ticket._id || `ticket-${idx}`) === over.id);
            if (oldIndex < 0 || newIndex < 0) return prev;
            return arrayMove(prev, oldIndex, newIndex);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        let finalTicketTypes = [...ticketTypes];
        if (hasTickets && currentTicket.name && currentTicket.price) {
            const ticketToSave = {
                ...currentTicket,
                id: editingTicketId || currentTicket.id || createTicketId(),
            };
            const existingIndex = finalTicketTypes.findIndex((ticket, idx) => (ticket.id || ticket._id || `ticket-${idx}`) === ticketToSave.id);
            if (existingIndex >= 0) {
                finalTicketTypes[existingIndex] = ticketToSave;
            } else {
                finalTicketTypes.push(ticketToSave);
            }
            toast.success('Unsaved ticket changes included in update.');
        }

        const data = new FormData();
        data.append('hasTickets', hasTickets);
        data.append('dressCode', dressCode);
        data.append('removeTicketBannerImage', ticketBannerImage === null);

        if (ticketBannerImage instanceof File) {
            data.append('ticketBannerImage', ticketBannerImage);
        }

        const ticketTypesMeta = finalTicketTypes.map(({ id: _clientId, _id, image, ...ticket }) => ({
            ...ticket,
            image: typeof image === 'string' ? image : null,
        }));
        data.append('ticketTypes', JSON.stringify(hasTickets ? ticketTypesMeta : []));

        finalTicketTypes.forEach((ticket, index) => {
            if (ticket.image instanceof File) {
                data.append(`ticketImage_${index}`, ticket.image);
            }
        });

        try {
            await axios.put(`${API_BASE_URL}/api/upcoming-events/update/${id}`, data);
            setTicketTypes(finalTicketTypes);
            resetCurrentTicket();
            toast.success('Tickets updated successfully!');
            setTimeout(() => {
                navigate('/tickets');
            }, 1000);
        } catch (error) {
            console.error('Error updating tickets:', error);
            toast.error('Failed to update tickets.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader className="h-10 w-10 animate-spin text-[#C7913E]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-8 p-6 text-black">
            <ImageEditorModal
                isOpen={editorOpen}
                onClose={() => {
                    setEditorOpen(false);
                    setEditorImageSrc(null);
                }}
                onSave={handleSaveEditedImage}
                image={editorImageSrc}
                aspect={editorTarget === 'banner' ? 16 / 9 : 1}
            />

            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/tickets')}
                    className="rounded-full p-2 transition-colors hover:bg-gray-200"
                >
                    <ArrowLeft className="h-6 w-6 text-white" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">Manage Event Tickets</h1>
                    <p className="mt-1 text-neutral-400">
                        {event?.eventName || event?.title}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
                <div className={`rounded-lg border border-gray-700 bg-gray-800 p-6 ${!hasTickets ? 'opacity-50' : ''}`}>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Ticket className="text-[#C7913E]" size={22} />
                            <h2 className="text-xl font-bold text-blue-400">Ticket Types</h2>
                        </div>
                        <label className="flex cursor-pointer items-center gap-2">
                            <span className="text-sm italic text-gray-400">Enable Tickets</span>
                            <input
                                type="checkbox"
                                checked={hasTickets}
                                onChange={(e) => setHasTickets(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                        </label>
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm text-gray-400">Buy Tickets Banner Image</label>
                        <div className="rounded-lg border border-dashed border-gray-600 bg-gray-900 p-4">
                            {ticketBannerImage ? (
                                <div className="relative inline-block">
                                    <img
                                        src={ticketBannerImage instanceof File ? URL.createObjectURL(ticketBannerImage) : ticketBannerImage}
                                        alt="Buy tickets banner preview"
                                        className="max-h-52 rounded object-cover"
                                        crossOrigin="anonymous"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setTicketBannerImage(null)}
                                        className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white"
                                        title="Remove banner image"
                                    >
                                        <X size={14} />
                                    </button>
                                    <label className="mt-3 block cursor-pointer text-sm text-[#C7913E]">
                                        Replace banner image
                                        <input
                                            type="file"
                                            onChange={handleTicketBannerImage}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleEditBannerImage}
                                        className="mt-2 block text-sm text-blue-400 hover:text-blue-300"
                                    >
                                        Crop / Edit image
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer text-sm text-[#C7913E]">
                                    Upload banner image
                                    <input
                                        type="file"
                                        onChange={handleTicketBannerImage}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </label>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                                This image appears at the top of the event&apos;s buy tickets page.
                            </p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm text-gray-400">Dress Code</label>
                        <input
                            type="text"
                            value={dressCode}
                            onChange={(e) => setDressCode(e.target.value)}
                            className="w-full rounded bg-gray-700 p-2 text-sm text-white"
                            placeholder="e.g. Black Tie / Cocktail Attire"
                            disabled={!hasTickets}
                        />
                    </div>

                    <div className="mb-4 grid grid-cols-1 items-end gap-4 md:grid-cols-12">
                        <div className="md:col-span-4">
                            <label className="mb-1 block text-sm text-gray-400">Ticket Name</label>
                            <input
                                type="text"
                                name="name"
                                value={currentTicket.name}
                                onChange={handleTicketChange}
                                className="w-full rounded bg-gray-700 p-2 text-sm text-white"
                                placeholder="e.g. VIP"
                                disabled={!hasTickets}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm text-gray-400">Qty</label>
                            <input
                                type="number"
                                name="amount"
                                value={currentTicket.amount}
                                onChange={handleTicketChange}
                                className="w-full rounded bg-gray-700 p-2 text-sm text-white"
                                placeholder="100"
                                disabled={!hasTickets}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm text-gray-400">Currency</label>
                            <input
                                type="text"
                                name="currency"
                                value={currentTicket.currency}
                                onChange={handleTicketChange}
                                className="w-full rounded bg-gray-700 p-2 text-sm text-white"
                                placeholder="USD"
                                disabled={!hasTickets}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm text-gray-400">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={currentTicket.price}
                                onChange={handleTicketChange}
                                className="w-full rounded bg-gray-700 p-2 text-white"
                                placeholder="0.00"
                                disabled={!hasTickets}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="mb-1 block text-sm text-gray-400">Ticket Image</label>
                            <input
                                type="file"
                                onChange={handleTicketImage}
                                accept="image/*"
                                className="mt-1 w-full text-xs text-gray-400"
                                disabled={!hasTickets}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <button
                                type="button"
                                onClick={addTicket}
                                className="h-[42px] w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
                                disabled={!hasTickets}
                                title={editingTicketId ? 'Update ticket' : 'Add ticket'}
                            >
                                {editingTicketId ? <Pencil size={18} className="mx-auto" /> : <Plus className="mx-auto" />}
                            </button>
                        </div>
                        <div className="md:col-span-12">
                            <label className="mb-1 block text-sm text-gray-400">Description</label>
                            <textarea
                                name="description"
                                value={currentTicket.description}
                                onChange={handleTicketChange}
                                className="min-h-[100px] w-full rounded bg-gray-700 p-2 text-white"
                                placeholder="Includes..."
                                disabled={!hasTickets}
                            />
                        </div>
                    </div>

                    {currentTicket.image && (
                        <div className="mb-4 flex items-center gap-3 rounded border border-gray-600 bg-gray-900 p-3">
                            <img
                                src={typeof currentTicket.image === 'string' ? currentTicket.image : URL.createObjectURL(currentTicket.image)}
                                alt="Current ticket preview"
                                className="h-14 w-14 rounded object-cover"
                                crossOrigin="anonymous"
                            />
                            <div className="flex-1 text-sm text-gray-300">
                                {editingTicketId ? 'Editing selected ticket image' : 'Ticket image ready'}
                            </div>
                            <button
                                type="button"
                                onClick={handleEditTicketImage}
                                className="rounded-full bg-blue-900/30 p-2 text-blue-400 hover:text-blue-300"
                                title="Crop / Edit ticket image"
                            >
                                <Crop size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentTicket((prev) => ({ ...prev, image: null }))}
                                className="rounded-full bg-red-900/30 p-2 text-red-400 hover:text-red-300"
                                title="Remove image"
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

                    {hasTickets && ticketTypes.length > 0 && (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleTicketDragEnd}
                        >
                            <SortableContext
                                items={ticketTypes.map((ticket, idx) => ticket.id || ticket._id || `ticket-${idx}`)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {ticketTypes.map((ticket, idx) => (
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

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/tickets')}
                        className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-gradient-to-r from-[#8C5D25] to-[#C7913E] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#C7913E]/20 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {saving ? 'Saving...' : 'Update Tickets'}
                    </button>
                </div>
            </form>
        </div>
    );
}
