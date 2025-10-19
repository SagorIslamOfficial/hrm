import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        href: string;
        icon?: ReactNode;
    };
    children?: ReactNode;
}

export function PageHeader({
    title,
    description,
    action,
    children,
}: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2">
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
