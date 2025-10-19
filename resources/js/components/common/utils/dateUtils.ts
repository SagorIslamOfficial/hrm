/**
 * Format a date string from Laravel ISO format to HTML date input format
 * @param date - Date string in ISO format (e.g., "2020-01-01T00:00:00.000000Z")
 * @returns Formatted date string (e.g., "2020-01-01") or empty string if date is null/undefined
 */
export const formatDateForInput = (date: string | undefined | null): string => {
    if (!date) {
        return '';
    }
    // Convert "2020-01-01T00:00:00.000000Z" to "2020-01-01"
    return date.split('T')[0];
};

/**
 * Format a date string for display in a readable format
 * @param date - Date string in ISO format
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string for display
 */
export const formatDateForDisplay = (
    date: string | undefined | null,
    locale: string = 'en-US',
): string => {
    if (!date) {
        return '';
    }

    try {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return date;
    }
};

/**
 * Check if a date string is valid
 * @param date - Date string to validate
 * @returns True if date is valid, false otherwise
 */
export const isValidDate = (date: string | undefined | null): boolean => {
    if (!date) {
        return false;
    }

    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
};

/**
 * Get today's date in HTML date input format (YYYY-MM-DD)
 * @returns Today's date string
 */
export const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};
