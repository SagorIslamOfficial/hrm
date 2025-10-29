import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';

interface ResourceDialogProps {
    mode: 'add' | 'edit' | 'view';
    open: boolean;
    resourceLabel: string;
    subjectLabel?: string;
    children: ReactNode;
}

export function ResourceDialog({
    mode,
    open,
    resourceLabel,
    subjectLabel = '',
    children,
}: ResourceDialogProps) {
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-2xl [&>button]:hidden">
                <DialogHeader className="mb-4">
                    <DialogTitle>
                        {isView && resourceLabel}
                        {isEdit && `Edit ${resourceLabel}`}
                        {!isEdit && !isView && `Add ${resourceLabel}`}
                    </DialogTitle>
                    {!isView && (
                        <DialogDescription>
                            {isEdit
                                ? `Update the ${resourceLabel.toLowerCase()} information.`
                                : `Add a new ${resourceLabel.toLowerCase()} for this ${subjectLabel.toLowerCase()}.`}
                        </DialogDescription>
                    )}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
