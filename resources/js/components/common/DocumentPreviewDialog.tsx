import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';

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

    // Get file extension from document name or URL
    const extension = documentName.split('.').pop()?.toLowerCase() || '';
    const isPDF = extension === 'pdf' || documentType.includes('pdf');
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);

    return (
        <Dialog open={open}>
            <DialogContent className="h-[90vh] w-full !max-w-3xl overflow-hidden [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle>{title || documentName}</DialogTitle>
                    <DialogDescription>
                        Document preview - {documentName}
                    </DialogDescription>
                </DialogHeader>

                <div className="relative flex flex-col gap-4">
                    {/* Preview Area */}
                    <div className="flex items-center justify-center overflow-auto rounded-lg border bg-muted/30">
                        {isPDF ? (
                            <iframe
                                src={documentUrl}
                                className="h-[70vh] w-full rounded-lg"
                                title={documentName}
                            />
                        ) : isImage ? (
                            <img
                                src={documentUrl}
                                alt={documentName}
                                className="max-h-[70vh] w-auto rounded-lg object-contain"
                            />
                        ) : (
                            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
                                <p className="text-muted-foreground">
                                    Preview not available for this file type.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    File: {documentName}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between border-t pt-4">
                        <Button
                            variant="outline"
                            onClick={() => window.open(documentUrl, '_blank')}
                            className="cursor-pointer gap-2"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Open in New Tab
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
