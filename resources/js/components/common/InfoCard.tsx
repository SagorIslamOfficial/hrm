import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface InfoCardProps {
    title: React.ReactNode;
    children?: ReactNode;
    className?: string;
    action?: ReactNode;
    titleClassName?: string;
}

export function InfoCard({
    title,
    children,
    className = '',
    action,
    titleClassName = '',
}: InfoCardProps) {
    return (
        <Card className={`h-full shadow-none ${className}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className={`min-w-0 ${titleClassName}`}>
                        {title}
                    </CardTitle>
                    {action && <div>{action}</div>}
                </div>
            </CardHeader>
            {children && <CardContent>{children}</CardContent>}
        </Card>
    );
}
