import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface InfoCardProps {
    title: string;
    children: ReactNode;
    className?: string;
    action?: ReactNode;
}

export function InfoCard({
    title,
    children,
    className = '',
    action,
}: InfoCardProps) {
    return (
        <Card className={`shadow-none ${className}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    {action && <div>{action}</div>}
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
