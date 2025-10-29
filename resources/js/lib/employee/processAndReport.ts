import { toast } from 'sonner';
import processStaged from './processStaged';

export type StagedOptions<T> = {
    isNew: (item: T) => boolean;
    isModified: (item: T) => boolean;
    isDeleted: (item: T) => boolean;
    create: (item: T) => Promise<unknown>;
    update: (item: T) => Promise<unknown>;
    remove: (item: T) => Promise<unknown>;
};

export type ReportOptions<T> = {
    label: string; // friendly label for toasts: 'contact', 'document', ...
    getItemLabel?: (item: T) => string;
    onError?: (item: T, error: unknown) => void;
};

function defaultGetItemLabel(i: unknown) {
    if (i && typeof i === 'object') {
        const obj = i as Record<string, unknown>;
        if (typeof obj.contact_name === 'string') return obj.contact_name;
        if (typeof obj.title === 'string') return obj.title;
        if (typeof obj.name === 'string') return obj.name;
        if (typeof obj.field_key === 'string') return obj.field_key;
    }
    return 'item';
}

function extractResponseData(err: unknown): unknown | undefined {
    if (!err || typeof err !== 'object') return undefined;
    const maybe = err as { response?: { data?: unknown } };
    return maybe.response?.data;
}

export default async function processAndReport<T>(
    items: T[],
    stagedOptions: StagedOptions<T>,
    reportOptions: ReportOptions<T>,
) {
    const {
        label,
        getItemLabel = defaultGetItemLabel,
        onError,
    } = reportOptions;

    const results = await processStaged<T>(items, stagedOptions);

    for (const r of results) {
        if (!r.ok) {
            const err = r.error as unknown;
            const item = r.item as T;

            // Try to extract validation errors or message
            const responseData = extractResponseData(err);

            // Try to read validation errors
            let validationErrors: Record<string, string[]> | undefined;
            if (responseData && typeof responseData === 'object') {
                const rd = responseData as Record<string, unknown>;
                if (rd.errors && typeof rd.errors === 'object') {
                    validationErrors = rd.errors as Record<string, string[]>;
                }
            }

            if (validationErrors && Object.keys(validationErrors).length) {
                const messages = Object.entries(validationErrors)
                    .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
                    .join(' | ');
                toast.error(
                    `${label[0].toUpperCase() + label.slice(1)} validation failed: ${messages}`,
                );
            } else if (
                responseData &&
                typeof responseData === 'object' &&
                'message' in (responseData as Record<string, unknown>)
            ) {
                const msg = (responseData as Record<string, unknown>)
                    .message as string | undefined;
                toast.error(
                    `Failed to sync ${label} "${getItemLabel(item)}": ${msg}`,
                );
            } else {
                toast.error(
                    `Failed to sync ${label} "${getItemLabel(item)}". Please try again.`,
                );
            }

            console.error(`${label} sync error:`, err);
            if (onError) onError(item, err);
        }
    }

    return results;
}
