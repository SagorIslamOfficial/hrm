import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { NoteForm } from './NoteForm';

interface Note {
    id: string;
    note: string;
    category: string;
    is_private: boolean;
    created_at: string;
    creator?: {
        name?: string;
    };
    updated_at?: string;
    updater?: {
        name?: string;
    };
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

interface NoteDialogProps {
    mode: 'add' | 'edit';
    open: boolean;
    note?: Note;
    currentUser?: {
        id: string;
        name?: string;
    };
    onSuccess: (data: Note) => void;
    onCancel: () => void;
    resourceLabel?: string;
    subjectLabel?: string;
}

export function NoteDialog({
    mode,
    open,
    note,
    currentUser,
    onSuccess,
    onCancel,
    resourceLabel = '',
    subjectLabel = '',
}: NoteDialogProps) {
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
                <NoteForm
                    note={isEdit ? note : undefined}
                    currentUser={currentUser}
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                    subjectLabel={subjectLabel}
                />
            </DialogContent>
        </Dialog>
    );
}
