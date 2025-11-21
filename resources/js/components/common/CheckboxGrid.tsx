import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';

export interface CheckboxItem {
    name: string;
    isSelected: boolean;
    onChange: (checked: boolean) => void;
    isCustom?: boolean;
    isHardcoded?: boolean;
    actions?: React.ReactNode;
    title?: string;
}

interface CheckboxGridProps {
    items: CheckboxItem[];
    columns?: number;
    className?: string;
}

export function CheckboxGrid({
    items,
    columns = 5,
    className = '',
}: CheckboxGridProps) {
    const gridColsClass =
        {
            3: 'md:grid-cols-3',
            4: 'md:grid-cols-4',
            5: 'md:grid-cols-5',
            6: 'md:grid-cols-6',
        }[columns] || `md:grid-cols-${columns}`;

    return (
        <div className={`grid gap-3 ${gridColsClass} ${className}`}>
            {items.map((item) => (
                <div
                    key={item.name}
                    className="flex items-center gap-1"
                    title={item.title}
                >
                    <Checkbox
                        checked={item.isSelected}
                        onCheckedChange={item.onChange}
                    />

                    <span className="truncate text-sm">{item.name}</span>

                    {item.actions}
                </div>
            ))}
        </div>
    );
}
