import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ReactNode } from 'react';

interface InfoCardProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    children?: ReactNode;
    className?: string;
    action?: ReactNode;
    titleClassName?: string;
}

export function InfoCard({
    title,
    description,
    children,
    className = '',
    action,
    titleClassName = '',
}: InfoCardProps) {
    return (
        <Card
            className={`rounded-xl border border-sidebar-border/70 px-4 py-10 shadow-none ${className}`}
        >
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className={`min-w-0 ${titleClassName}`}>
                            {title}
                        </CardTitle>
                        {description && (
                            <CardDescription>{description}</CardDescription>
                        )}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            </CardHeader>
            {children && <CardContent>{children}</CardContent>}
        </Card>
    );
}
