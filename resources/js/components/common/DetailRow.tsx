import { Badge } from '@/components/ui/badge';
import React from 'react';

interface DetailRowProps {
    label: string;
    value?: React.ReactNode;
    children?: React.ReactNode;
    imageSrc?: string;
    imageAlt?: string;
    imageClassName?: string;
    imageWrapperClassName?: string;
    onImageClick?: () => void;
    showValue?: boolean;
    valueClassName?: string;
    className?: string;
    statusValue?: string | null;
    badgeClassName?: string;
    badgeVariantMapper?: (
        value: string,
    ) => 'default' | 'secondary' | 'outline' | 'destructive';
    statusLabelMapper?: (value: string) => string;
}

export default function DetailRow({
    label,
    value,
    children,
    imageSrc,
    imageAlt,
    imageClassName = 'w-8 h-8 rounded-md',
    imageWrapperClassName = 'mr-3',
    onImageClick,
    showValue = true,
    valueClassName = 'text-sm font-medium capitalize',
    className = '',
    statusValue = null,
    badgeClassName = '',
    badgeVariantMapper,
    statusLabelMapper,
}: DetailRowProps) {
    const defaultVariantMapper = (value: string) => {
        if (value === 'active') return 'default';
        if (value === 'inactive') return 'secondary';
        if (value === 'on_leave') return 'outline';
        return 'destructive';
    };

    const defaultLabelMapper = (value: string) => {
        if (!value) return '';
        if (value === 'inactive') return 'InActive';
        return value
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const renderBadge = (value: string) => {
        const variant = (badgeVariantMapper || defaultVariantMapper)(value);
        const labelText = (statusLabelMapper || defaultLabelMapper)(value);
        const extraClass =
            value === 'on_leave'
                ? 'border-rose-200 bg-rose-100 text-rose-800 hover:bg-rose-200'
                : '';
        return (
            <div className="mt-1">
                <Badge
                    className={`text-[13px] ${extraClass} ${badgeClassName}`}
                    variant={variant}
                >
                    {labelText}
                </Badge>
            </div>
        );
    };

    return (
        <div className={className}>
            <h3 className="text-sm font-medium text-muted-foreground">
                {label}
            </h3>
            {statusValue ? (
                renderBadge(statusValue)
            ) : (
                <div className="mt-1 flex items-center">
                    {imageSrc && (
                        <div className={imageWrapperClassName}>
                            <img
                                src={imageSrc}
                                alt={imageAlt ?? label}
                                className={imageClassName}
                                onClick={onImageClick}
                            />
                        </div>
                    )}
                    {showValue &&
                        (value !== undefined ? (
                            <p className={valueClassName}>{value}</p>
                        ) : (
                            <p className={valueClassName}>{children}</p>
                        ))}
                </div>
            )}
        </div>
    );
}
