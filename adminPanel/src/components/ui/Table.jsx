import React from 'react';
import { Trash2, Eye } from 'lucide-react';

const Table = ({ columns, data, onDelete, onView, title }) => {
    return (
        <div className="bg-[#1a1a1a] rounded-2xl shadow-xl border border-[#2a2a2a] overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center bg-[#1a1a1a]">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h3>
                <span className="text-sm font-semibold text-[#C7913E] bg-[#C7913E]/10 px-3 py-1 rounded-full">{data.length} records found</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0f0f0f]">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 border-b border-[#2a2a2a]">
                                    {col.header}
                                </th>
                            ))}
                            {(onDelete || onView) && (
                                <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 border-b border-[#2a2a2a] text-right">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a2a2a]">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + ((onDelete || onView) ? 1 : 0)} className="p-12 text-center text-neutral-600 italic">
                                    No entries found in this category
                                </td>
                            </tr>
                        ) : (
                            data.map((item, idx) => (
                                <tr key={item._id || idx} className="hover:bg-[#C7913E]/5 transition-colors group">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="p-4 text-sm text-neutral-300 font-medium">
                                            {col.render ? col.render(item) : (
                                                <span className="line-clamp-2 max-w-[200px] group-hover:text-white transition-colors">
                                                    {item[col.key] || '-'}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                    {(onDelete || onView) && (
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {onView && (
                                                    <button
                                                        onClick={() => onView(item)}
                                                        className="p-2 text-[#C7913E] hover:bg-[#C7913E]/10 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item._id)}
                                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
