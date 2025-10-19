import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ContactForm } from './ContactForm';

interface Contact {
    id: string;
    contact_name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
    photo?: string;
    photo_url?: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
    // Staging properties for pending changes
    _photoFile?: File;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

interface ContactDialogProps {
    mode: 'add' | 'edit';
    open: boolean;
    contact?: Contact;
    onSuccess: (data: Contact) => void;
    onCancel: () => void;
    resourceLabel?: string;
    subjectLabel?: string;
}

export function ContactDialog({
    mode,
    open,
    contact,
    onSuccess,
    onCancel,
    resourceLabel = '',
    subjectLabel = '',
}: ContactDialogProps) {
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
                <ContactForm
                    contact={isEdit ? contact : undefined}
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                    resourceLabel={resourceLabel}
                    subjectLabel={subjectLabel}
                />
            </DialogContent>
        </Dialog>
    );
}
