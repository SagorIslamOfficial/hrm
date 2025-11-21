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
