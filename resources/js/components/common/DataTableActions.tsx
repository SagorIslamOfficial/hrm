import { Button } from '@/components/ui/button';
import { Check, Eye, SquarePen, Trash2, X } from 'lucide-react';

interface DataTableActionsProps<T = Record<string, unknown>> {
    item: T;
    onView?: (item: T) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onSave?: (item: T) => void;
    onCancel?: (item: T) => void;
    viewLabel?: string;
    editLabel?: string;
    deleteLabel?: string;
    saveLabel?: string;
    cancelLabel?: string;
    showView?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
    showSave?: boolean;
    showCancel?: boolean;
}

export function DataTableActions<T>({
    item,
    onView,
    onEdit,
    onDelete,
    onSave,
    onCancel,
    viewLabel = 'View',
    editLabel = 'Edit',
    deleteLabel = 'Delete',
    saveLabel = 'Save',
    cancelLabel = 'Cancel',
    showView = true,
    showEdit = true,
    showDelete = true,
    showSave = false,
    showCancel = false,
}: DataTableActionsProps<T>) {
    return (
        <div className="flex items-center gap-2">
            {showView && onView && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onView(item)}
                    className="h-8 w-8 cursor-pointer p-0 text-primary"
                    title={viewLabel}
                >
                    <Eye className="h-4 w-4" />
                </Button>
            )}
            {showEdit && onEdit && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="h-8 w-8 cursor-pointer p-0"
                    title={editLabel}
                >
                    <SquarePen className="text-outline h-4 w-4" />
                </Button>
            )}
            {showDelete && onDelete && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item)}
                    className="h-8 w-8 cursor-pointer p-0 text-destructive"
                    title={deleteLabel}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
            {showSave && onSave && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onSave(item)}
                    className="h-8 w-8 cursor-pointer p-0 text-green-600"
                    title={saveLabel}
                >
                    <Check className="h-4 w-4" />
                </Button>
            )}
            {showCancel && onCancel && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onCancel(item)}
                    className="h-8 w-8 cursor-pointer p-0 text-red-600"
                    title={cancelLabel}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
