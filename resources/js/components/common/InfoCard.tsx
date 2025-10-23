import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface InfoCardProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export function InfoCard({ title, children, className = '' }: InfoCardProps) {
    return (
        <Card className={`shadow-none ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
