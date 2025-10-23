import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { DocumentForm } from './DocumentForm';

interface Document {
    id: string;
    doc_type: string;
    title: string;
    file_name: string;
    file_path: string;
    file_url: string;
    file_size: number;
    expiry_date: string | null;
    is_expired: boolean;
    is_expiring_soon: boolean;
    uploader?: {
        id: string;
        name: string;
    };
    created_at: string;
    // Staging properties for pending changes
    _documentFile?: File;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

interface DocumentDialogProps {
    mode: 'add' | 'edit';
    open: boolean;
    document?: Document;
    onSuccess: (data: Document) => void;
    onCancel: () => void;
    resourceLabel?: string;
    subjectLabel?: string;
}

export function DocumentDialog({
    mode,
    open,
    document,
    onSuccess,
    onCancel,
    resourceLabel = '',
    subjectLabel = '',
}: DocumentDialogProps) {
    const isEdit = mode === 'edit';

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-2xl [&>button]:hidden">
                <DialogHeader className="mb-4">
                    <DialogTitle>
                        {isEdit
                            ? `Edit ${resourceLabel}`
                            : `Add ${resourceLabel}`}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? `Update the ${resourceLabel.toLowerCase()} information.`
                            : `Add a new ${resourceLabel.toLowerCase()} for this ${subjectLabel.toLowerCase()}.`}
                    </DialogDescription>
                </DialogHeader>
                <DocumentForm
                    document={isEdit ? document : undefined}
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                    subjectLabel={subjectLabel}
                />
            </DialogContent>
        </Dialog>
    );
}
