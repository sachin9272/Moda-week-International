import React from 'react';
import { Trash2, Eye } from 'lucide-react';

const Table = ({ columns, data, onDelete, onView, title }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                <span className="text-sm text-slate-500">{data.length} records found</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    {col.header}
                                </th>
                            ))}
                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="p-8 text-center text-slate-400">
                                    No entries found
                                </td>
                            </tr>
                        ) : (
                            data.map((item, idx) => (
                                <tr key={item._id || idx} className="hover:bg-slate-50/50 transition-colors">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="p-4 text-sm text-slate-600 font-medium">
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {onView && (
                                                <button
                                                    onClick={() => onView(item)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item._id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
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
