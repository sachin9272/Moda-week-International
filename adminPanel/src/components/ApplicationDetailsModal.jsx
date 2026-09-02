import React, { useEffect } from 'react';
import { ExternalLink, Trash2, X } from 'lucide-react';
import { baseURL } from '../config/api';

const hiddenFields = new Set(['__v']);

const labelize = (key) => key
    .replace(/^_id$/, 'ID')
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .replace(/\bId\b/g, 'ID');

const isEmptyValue = (value) => (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
);

const isUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value);

const isImageUrl = (value) => isUrl(value) && /\.(jpe?g|png|gif|webp|bmp|svg|avif)(\?.*)?$/i.test(value);

const resolveAssetUrl = (value) => {
    if (!value || typeof value !== 'string') return '';
    if (isUrl(value) || value.startsWith('data:') || value.startsWith('blob:')) return value;
    return `${baseURL}${value.startsWith('/') ? '' : '/'}${value}`;
};

const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const formatValue = (value) => {
    if (Array.isArray(value)) {
        return value.filter((item) => !isEmptyValue(item)).join(', ');
    }

    if (typeof value === 'object') {
        if (value.url || value.secure_url) return value.url || value.secure_url;
        return JSON.stringify(value, null, 2);
    }

    return String(value);
};

const DetailValue = ({ value }) => {
    const formattedValue = formatValue(value);

    if (isImageUrl(formattedValue)) {
        return (
            <a href={formattedValue} target="_blank" rel="noreferrer" className="inline-block">
                <img
                    src={formattedValue}
                    alt="Uploaded attachment"
                    className="max-h-48 max-w-full rounded-lg border border-[#2a2a2a] object-contain bg-[#0f0f0f]"
                />
            </a>
        );
    }

    if (isUrl(formattedValue)) {
        return (
            <a
                href={formattedValue}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#C7913E] hover:text-[#dca24a] break-all"
            >
                {formattedValue}
                <ExternalLink size={14} className="shrink-0" />
            </a>
        );
    }

    if (typeof value === 'object' && !Array.isArray(value) && !value?.url) {
        return <pre className="whitespace-pre-wrap break-words font-sans text-sm">{formattedValue}</pre>;
    }

    return <span className="whitespace-pre-wrap break-words">{formattedValue}</span>;
};

const getImageUrl = (application) => (
    application?.photo?.url ||
    application?.photo?.secure_url ||
    application?.image?.url ||
    application?.image?.secure_url ||
    application?.photo ||
    application?.image ||
    ''
);

const ApplicationDetailsModal = ({
    application,
    title,
    onClose,
    onDelete
}) => {
    useEffect(() => {
        if (!application) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [application]);

    if (!application) return null;

    const imageUrl = resolveAssetUrl(getImageUrl(application));
    const entries = Object.entries(application)
        .filter(([key, value]) => !hiddenFields.has(key) && key !== 'photo' && key !== 'image' && !isEmptyValue(value))
        .map(([key, value]) => [
            key,
            key === 'createdAt' || key === 'updatedAt' ? formatDate(value) : value
        ]);
    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#1a1a1a] rounded-2xl max-w-4xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-[#2a2a2a]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="p-6 border-b border-[#2a2a2a] flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{title}</h3>
                        <p className="text-sm text-neutral-500 mt-1">Full submitted application information</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
                        title="Close"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(88vh-104px)]">
                    {imageUrl && (
                        <div className="mb-6">
                            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500 mb-3">
                                Uploaded Image
                            </div>
                            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-3 max-w-sm">
                                <img
                                    src={imageUrl}
                                    alt={application.fullName || application.contactName || application.designerName || 'Uploaded application image'}
                                    className="w-full max-h-80 object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {entries.map(([key, value]) => (
                            <div key={key} className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-4">
                                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500 mb-2">
                                    {labelize(key)}
                                </div>
                                <div className="text-sm text-neutral-200 leading-relaxed">
                                    <DetailValue value={value} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {onDelete && (
                    <div className="p-6 border-t border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 bg-[#141414]">
                        <button
                            onClick={() => onDelete(application)}
                            className="px-4 py-3 rounded-xl border border-red-500/40 text-red-400 font-bold hover:bg-red-500/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Trash2 size={18} />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationDetailsModal;
