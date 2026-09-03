import * as XLSX from 'xlsx';

const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
};

// File/image uploads are stored as { url, publicId } pointing at the S3 object - the
// exported sheet only ever needs the public URL, never the internal S3 key.
const formatCell = (value) => {
    if (value === undefined || value === null || value === '') return '';
    if (Array.isArray(value)) return value.filter(Boolean).join('; ');
    if (isPlainObject(value)) return value.url || value.secure_url || '';
    return value;
};

const buildRow = (record, fields) => {
    const row = {};
    fields.forEach(({ key, header, type }) => {
        row[header] = type === 'date' ? formatDate(record[key]) : formatCell(record[key]);
    });
    return row;
};

export const buildSheetRows = (records, fields) => records.map((record) => buildRow(record, fields));

// Excel sheet names can't exceed 31 chars or contain : \ / ? * [ ]
const sanitizeSheetName = (name) => (name || 'Sheet').replace(/[:\\/?*[\]]/g, ' ').trim().slice(0, 31) || 'Sheet';

export const downloadWorkbook = (filename, sheets) => {
    const workbook = XLSX.utils.book_new();
    const usedNames = new Set();

    sheets.forEach(({ name, rows }) => {
        let sheetName = sanitizeSheetName(name);
        let suffix = 2;
        while (usedNames.has(sheetName)) {
            sheetName = `${sanitizeSheetName(name).slice(0, 28)} ${suffix++}`;
        }
        usedNames.add(sheetName);

        const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{}]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(workbook, filename);
};

export const exportRecordsToExcel = (filename, sheetName, records, fields) => {
    downloadWorkbook(filename, [{ name: sheetName, rows: buildSheetRows(records, fields) }]);
};
