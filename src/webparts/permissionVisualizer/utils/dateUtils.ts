/**
 * Formats a date string in ISO format to a locale-friendly display
 */
export function formatDate(isoString?: string): string {
    if (!isoString) return "N/A";
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    } catch {
        return "N/A";
    }
}

/**
 * Formats a date string to include time
 */
export function formatDateTime(isoString?: string): string {
    if (!isoString) return "N/A";
    try {
        const date = new Date(isoString);
        return date.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch {
        return "N/A";
    }
}

/**
 * Gets a formatted date string for filenames (YYYY-MM-DD)
 */
export function getDateForFilename(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * Formats milliseconds to a user-friendly duration
 */
export function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}
