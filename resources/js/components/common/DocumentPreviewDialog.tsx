import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from './EmptyState';
import { FormActions } from './FormActions';

interface DocumentPreviewProps {
    documentUrl: string;
    documentName: string;
    documentType: string;
}

function DocumentPreview({
    documentUrl,
    documentName,
    documentType,
}: DocumentPreviewProps) {
    // Get file extension from document name or URL
    const extension = documentName.split('.').pop()?.toLowerCase() || '';
    const isPDF = extension === 'pdf' || documentType.includes('pdf');
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);

    if (isPDF) {
        return (
            <iframe
                src={documentUrl}
                className="h-[70vh] w-full rounded-lg"
                title={documentName}
            />
        );
    }

    if (isImage) {
        return (
            <img
                src={documentUrl}
                alt={documentName}
                className="max-h-[70vh] w-auto rounded-lg object-contain"
            />
        );
    }

    return (
        <EmptyState
            title="Preview not available"
            description={`Preview not available for this file type. File: ${documentName}`}
        />
    );
}

interface DocumentPreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentUrl: string | null;
    documentName: string;
    documentType: string;
    title?: string;
    onDownload?: () => void;
}

export function DocumentPreviewDialog({
    open,
    onOpenChange,
    documentUrl,
    documentName,
    documentType,
    title,
}: DocumentPreviewDialogProps) {
    if (!documentUrl) return null;

    return (
        <Dialog open={open}>
            <DialogContent className="h-[85vh] w-full !max-w-3xl overflow-hidden rounded-md border-primary/40 bg-gray-700 [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {title || documentName}
                    </DialogTitle>
                    <div className="flex items-center justify-between">
                        <DialogDescription className="text-white">
                            Document preview - {documentName}
                        </DialogDescription>
                        <FormActions
                            type="dialog"
                            onSubmit={() => window.open(documentUrl, '_blank')}
                            onCancel={() => onOpenChange(false)}
                            submitLabel="Open in New Tab"
                            cancelLabel="Cancel"
                            showReset={false}
                            className="flex justify-end gap-2 border-none"
                        />
                    </div>
                </DialogHeader>

                <DocumentPreview
                    documentUrl={documentUrl}
                    documentName={documentName}
                    documentType={documentType}
                />
            </DialogContent>
        </Dialog>
    );
}
