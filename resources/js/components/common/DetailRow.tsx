import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';

interface DetailRowProps {
    label: string;
    value?: React.ReactNode;
    children?: React.ReactNode;
    imageSrc?: string;
    imageAlt?: string;
    imageClassName?: string;
    showValue?: boolean;
    valueClassName?: string;
    className?: string;
    statusValue?: string | null;
    badgeClassName?: string;
}

export default function DetailRow({
    label,
    value,
    children,
    imageSrc,
    imageAlt,
    imageClassName = 'w-8 h-8 rounded-md',
    showValue = true,
    valueClassName = 'text-sm font-medium capitalize',
    className = '',
    statusValue = null,
    badgeClassName = '',
}: DetailRowProps) {
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    const renderBadge = (status: string) => (
        <div className="mt-1">
            <StatusBadge status={status} className={badgeClassName} />
        </div>
    );

    return (
        <>
            <div className={className}>
                <h3 className="text-sm font-medium text-muted-foreground">
                    {label}
                </h3>
                {statusValue ? (
                    renderBadge(statusValue)
                ) : (
                    <div className="mt-1 flex flex-col items-start gap-2">
                        {imageSrc !== undefined && (
                            <>
                                <Avatar
                                    className={`${imageClassName} cursor-pointer bg-muted shadow-none transition-opacity hover:opacity-80`}
                                    onClick={() => setIsPhotoModalOpen(true)}
                                >
                                    <AvatarImage
                                        src={imageSrc || undefined}
                                        alt={imageAlt ?? label}
                                    />
                                    <AvatarFallback>
                                        <UserIcon className="size-16 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>

                                {imageSrc && (
                                    <Dialog
                                        open={isPhotoModalOpen}
                                        onOpenChange={setIsPhotoModalOpen}
                                    >
                                        <DialogContent className="max-w-2xl border-0 bg-gray-700/60 p-6 shadow-lg">
                                            <div className="space-y-4">
                                                <DialogTitle className="text-lg font-semibold text-white">
                                                    {imageAlt ?? label} - Photo
                                                </DialogTitle>
                                                <DialogDescription className="sr-only">
                                                    Preview of{' '}
                                                    {imageAlt ?? label}
                                                </DialogDescription>
                                                <img
                                                    src={imageSrc}
                                                    alt={imageAlt ?? label}
                                                    className="h-auto w-full rounded-lg"
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </>
                        )}
                        {showValue &&
                            (value !== undefined ? (
                                React.isValidElement(value) ? (
                                    <div
                                        className={`${valueClassName} ${
                                            label === 'Email' ? 'lowercase' : ''
                                        }`}
                                    >
                                        {value}
                                    </div>
                                ) : (
                                    <p
                                        className={`${valueClassName} ${
                                            label === 'Email' ? 'lowercase' : ''
                                        }`}
                                    >
                                        {value}
                                    </p>
                                )
                            ) : (
                                <p className={valueClassName}>{children}</p>
                            ))}
                    </div>
                )}
            </div>
        </>
    );
}
