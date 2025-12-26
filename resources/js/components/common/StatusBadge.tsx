import { Badge } from '@/components/ui/badge';
import { STATUS_CONFIG } from '@/constants/status';

interface StatusBadgeProps {
    status: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
}

const statusVariantMap: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    active: 'default',
    inactive: 'secondary',
    pending: 'outline',
    on_leave: 'outline',
    terminated: 'destructive',
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
    if (!status) {
        return (
            <Badge variant="outline" className={`text-xs ${className || ''}`}>
                N/A
            </Badge>
        );
    }

    const statusKey = status.toLowerCase() as keyof typeof STATUS_CONFIG;
    const config = STATUS_CONFIG[statusKey];
    const badgeVariant =
        variant || statusVariantMap[status.toLowerCase()] || 'outline';
    const badgeClassName = config?.color || '';

    return (
        <Badge
            variant={badgeVariant}
            className={`text-xs ${badgeClassName} ${className || ''}`}
        >
            {config?.label || status}
        </Badge>
    );
}
