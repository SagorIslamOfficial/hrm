import { DEFAULT_CURRENCY } from '@/config/currency';
import { usePage } from '@inertiajs/react';

interface PageProps {
    currency?: string;
    [key: string]: string | number | boolean | object | undefined;
}

export function useCurrency(): string {
    const page = usePage<PageProps>();
    return page.props.currency || DEFAULT_CURRENCY;
}
