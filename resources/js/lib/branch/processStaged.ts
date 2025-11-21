type Predicate<T> = (item: T) => boolean;

export interface ProcessStagedOptions<T> {
    isNew: Predicate<T>;
    isModified: Predicate<T>;
    isDeleted: Predicate<T>;
    create: (item: T) => Promise<unknown>;
    update: (item: T) => Promise<unknown>;
    remove: (item: T) => Promise<unknown>;
}

export interface ProcessedResult<T> {
    item: T;
    action: 'created' | 'updated' | 'deleted' | 'skipped' | 'none';
    ok: boolean;
    error?: unknown;
}

/**
 * Generic helper to process a list of staged items.
 * It will iterate items and call create/update/delete helpers as appropriate.
 * It returns a list of per-item results so callers can show messages or aggregate errors.
 */
export async function processStaged<T>(
    items: T[],
    options: ProcessStagedOptions<T>,
): Promise<ProcessedResult<T>[]> {
    const results: ProcessedResult<T>[] = [];

    for (const item of items) {
        try {
            // Skip if both new and deleted
            if (options.isNew(item) && options.isDeleted(item)) {
                results.push({ item, action: 'skipped', ok: true });
                continue;
            }

            if (options.isDeleted(item) && !options.isNew(item)) {
                await options.remove(item);
                results.push({ item, action: 'deleted', ok: true });
            } else if (options.isNew(item) && !options.isDeleted(item)) {
                await options.create(item);
                results.push({ item, action: 'created', ok: true });
            } else if (options.isModified(item)) {
                await options.update(item);
                results.push({ item, action: 'updated', ok: true });
            } else {
                results.push({ item, action: 'none', ok: true });
            }
        } catch (error) {
            results.push({ item, action: 'none', ok: false, error });
        }
    }

    return results;
}

export default processStaged;
