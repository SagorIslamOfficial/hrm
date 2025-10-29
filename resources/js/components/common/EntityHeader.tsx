import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadge {
    show: boolean | undefined;
    label: string;
    variant?: 'default' | 'outline' | 'secondary' | 'destructive';
    className?: string;
}

interface EntityHeaderProps {
    name: string;
    badges?: StatusBadge[];
    className?: string;
    nameClassName?: string;
}

export function EntityHeader({
    name,
    badges = [],
    className,
    nameClassName,
}: EntityHeaderProps) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <h4 className={cn('text-lg font-semibold', nameClassName)}>
                {name}
            </h4>
            {badges.map((badge, index) =>
                (badge.show ?? false) ? (
                    <Badge
                        key={index}
                        variant={badge.variant || 'default'}
                        className={badge.className}
                    >
                        {badge.label}
                    </Badge>
                ) : null,
            )}
        </div>
    );
}

// Helper to compute border class based on staging state.
export function GetBorderClass(isNew?: boolean, isModified?: boolean): string {
    if (isNew) return 'border-2 border-green-500';
    if (isModified) return 'border-2 border-yellow-500';
    return 'border';
}
