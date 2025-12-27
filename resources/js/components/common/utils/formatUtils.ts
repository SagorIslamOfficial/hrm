/**
 * Utility functions for formatting strings and values
 **/

export function titleCase(
    value: string | number | boolean | undefined | null,
): string {
    if (!value && value !== 0 && value !== false) return '';

    const stringValue = String(value);

    return stringValue
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(' ');
}

export function formatBranchType(type: string | undefined): string {
    return titleCase(type);
}

/**
 * Hook to format field paths and error messages into human-readable format
 */
export function useFormatError() {
    /**
     * Convert field paths to readable format
     * @param fieldPath - Field path (e.g., "subjects.0.specific_issue")
     * @returns Human-readable field name (e.g., "Specific Issue")
     */
    const formatFieldName = (fieldPath: string): string => {
        // Extract field name from path (e.g., "subjects.0.specific_issue" -> "specific_issue")
        const fieldName = fieldPath.split('.').pop() || fieldPath;

        // Convert snake_case to Title Case using the utility function
        return titleCase(fieldName);
    };

    return { formatFieldName };
}
