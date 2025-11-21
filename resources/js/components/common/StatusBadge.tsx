import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
    status: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
}

const statusConfig: Record<
    string,
    {
        label: string;
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
        className?: string;
    }
> = {
    active: { label: 'Active', variant: 'default' },
    inactive: { label: 'In Active', variant: 'secondary' },
    pending: { label: 'Pending', variant: 'outline' },
    on_leave: {
        label: 'On Leave',
        variant: 'outline',
        className:
            'border-orange-500 text-orange-700 bg-orange-50 dark:border-orange-400 dark:text-orange-300 dark:bg-orange-950/30',
    },
    terminated: { label: 'Terminated', variant: 'destructive' },
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
    if (!status) {
        return (
            <Badge variant="outline" className={`text-xs ${className || ''}`}>
                N/A
            </Badge>
        );
    }

    const config = statusConfig[status.toLowerCase()] || {
        label: status,
        variant: variant || 'outline',
    };

    return (
        <Badge
            variant={variant || config.variant}
            className={`text-xs ${config.className || ''} ${className || ''}`}
        >
            {config.label}
        </Badge>
    );
}
