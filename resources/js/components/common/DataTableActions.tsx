import { Button } from '@/components/ui/button';
import { Eye, SquarePen, Trash2 } from 'lucide-react';

interface DataTableActionsProps<T = Record<string, unknown>> {
    item: T;
    onView?: (item: T) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    viewLabel?: string;
    editLabel?: string;
    deleteLabel?: string;
    showView?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
}

export function DataTableActions<T>({
    item,
    onView,
    onEdit,
    onDelete,
    viewLabel = 'View',
    editLabel = 'Edit',
    deleteLabel = 'Delete',
    showView = true,
    showEdit = true,
    showDelete = true,
}: DataTableActionsProps<T>) {
    return (
        <div className="flex items-center gap-2">
            {showView && onView && (
                <Button
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
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item)}
                    className="h-8 w-8 cursor-pointer p-0 text-destructive"
                    title={deleteLabel}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
