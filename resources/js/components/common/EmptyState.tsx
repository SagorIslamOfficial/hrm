import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        href: string;
        icon?: ReactNode;
    };
    children?: ReactNode;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    children,
}: EmptyStateProps) {
    return (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                {icon && <div className="mb-4">{icon}</div>}

                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 mb-4 text-sm text-muted-foreground">
                    {description}
                </p>

                {action && (
                    <Button size="sm" asChild>
                        <Link href={action.href}>
                            {action.icon}
                            {action.label}
                        </Link>
                    </Button>
                )}

                {children}
            </div>
        </div>
    );
}
