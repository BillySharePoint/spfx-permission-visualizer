/**
 * Converts an array of objects to CSV string
 */
export function convertToCsv(rows: Record<string, unknown>[]): string {
    if (!rows || rows.length === 0) return "";

    const headers = Object.keys(rows[0]);
    const csvLines: string[] = [];

    // Header row
    csvLines.push(headers.map(h => escapeCSVField(h)).join(","));

    // Data rows
    for (const row of rows) {
        const values = headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return "";
            return escapeCSVField(String(value));
        });
        csvLines.push(values.join(","));
    }

    return csvLines.join("\r\n");
}

/**
 * Escapes a field value for CSV format
 */
function escapeCSVField(field: string): string {
    if (field.includes(",") || field.includes('"') || field.includes("\n") || field.includes("\r")) {
        return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
}

/**
 * Triggers a CSV file download in the browser
 */
export function downloadCsv(filename: string, rows: Record<string, unknown>[]): void {
    const csv = convertToCsv(rows);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
