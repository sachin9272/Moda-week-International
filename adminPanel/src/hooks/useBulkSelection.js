import { useCallback, useState } from 'react';

// Tracks a set of selected row ids for bulk actions (e.g. bulk delete) across a table.
export const useBulkSelection = () => {
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelect = useCallback((id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }, []);

    const toggleSelectAll = useCallback((ids) => {
        setSelectedIds((prev) => {
            const allSelected = ids.length > 0 && ids.every((id) => prev.includes(id));
            if (allSelected) return prev.filter((id) => !ids.includes(id));
            return [...new Set([...prev, ...ids])];
        });
    }, []);

    const removeFromSelection = useCallback((ids) => {
        const idSet = new Set(Array.isArray(ids) ? ids : [ids]);
        setSelectedIds((prev) => prev.filter((id) => !idSet.has(id)));
    }, []);

    const clearSelection = useCallback(() => setSelectedIds([]), []);

    return { selectedIds, toggleSelect, toggleSelectAll, removeFromSelection, clearSelection };
};
