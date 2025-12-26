import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft, X } from 'lucide-react';
import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string | ReactNode;
    action?: {
        label: string;
        href: string;
        icon?: ReactNode;
    };
    backUrl?: string;
    backLabel?: string;
    actions?: ReactNode;
    children?: ReactNode;
}

export function PageHeader({
    title,
    description,
    action,
    backUrl,
    backLabel = 'Cancel',
    actions,
    children,
}: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
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
                {actions}
                {children}
                {backUrl && (
                    <Button variant="secondary" size="sm" asChild>
                        <Link href={backUrl}>
                            {backLabel === 'Cancel' ? (
                                <X className="mr-1 size-4" />
                            ) : (
                                <ArrowLeft className="mr-1 size-4" />
                            )}
                            {backLabel}
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}

export default PageHeader;
