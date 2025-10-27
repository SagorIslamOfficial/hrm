import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CustomFieldForm } from './CustomFieldForm';

interface CustomField {
    id: string;
    field_key: string;
    field_value: string;
    field_type: string;
    section: string;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

interface CustomFieldDialogProps {
    mode: 'add' | 'edit';
    open: boolean;
    customField?: CustomField;
    onSuccess: (data: CustomField) => void;
    onCancel: () => void;
    resourceLabel?: string;
    subjectLabel?: string;
}

export function CustomFieldDialog({
    mode,
    open,
    customField,
    onSuccess,
    onCancel,
    resourceLabel = 'Custom Field',
    subjectLabel = 'employee',
}: CustomFieldDialogProps) {
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
                <CustomFieldForm
                    customField={isEdit ? customField : undefined}
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                    subjectLabel={subjectLabel}
                />
            </DialogContent>
        </Dialog>
    );
}
