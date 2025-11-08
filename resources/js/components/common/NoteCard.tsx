import type { Note } from '@/components/common/interfaces';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface NoteCardProps {
    note: Note;
    showActions?: boolean;
    onEdit?: (note: Note) => void;
    onDelete?: (noteId: string) => void;
    variant?: 'simple' | 'detailed';
    className?: string;
}

export function NoteCard({
    note,
    showActions = false,
    onEdit,
    onDelete,
    variant = 'simple',
    className = '',
}: NoteCardProps) {
    const formatCategory = (category: string) => {
        return category
            .split(/[-_]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const isUpdated = note.updated_at && note.updated_at !== note.created_at;

    if (variant === 'detailed') {
        return (
            <div className={`rounded-lg border p-4 ${className}`}>
                <div className="mb-2 flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex gap-2">
                            <Badge variant="secondary">
                                {formatCategory(note.category)}
                            </Badge>
                            {note.is_private !== null && note.is_private && (
                                <Badge variant="destructive">
                                    <Lock className="mr-1 size-3" />
                                    Private
                                </Badge>
                            )}
                            {isUpdated && (
                                <Badge
                                    className="border-yellow-500 bg-yellow-100 text-yellow-800"
                                    variant="outline"
                                >
                                    Modified
                                </Badge>
                            )}
                        </div>

                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {note.title || 'Untitled Note'}
                        </h4>

                        <p className="pt-1 text-xs text-muted-foreground">
                            By {note.creator?.name} •{' '}
                            {new Date(note.created_at).toLocaleDateString()} •{' '}
                            {new Date(note.created_at).toLocaleTimeString()}
                            {isUpdated && note.updated_at && (
                                <span className="text-xs text-muted-foreground">
                                    {' '}
                                    - Updated by{' '}
                                    {note.updater?.name ??
                                        note.creator?.name ??
                                        'Unknown'}{' '}
                                    •{' '}
                                    {new Date(
                                        note.updated_at,
                                    ).toLocaleDateString()}{' '}
                                    •{' '}
                                    {new Date(
                                        note.updated_at,
                                    ).toLocaleTimeString()}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <p className="text-sm">{note.note}</p>
            </div>
        );
    }

    // Simple variant for edit components
    return (
        <div className={`relative rounded-lg border p-4 ${className}`}>
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <div className="mb-2 flex gap-2">
                        <Badge variant="secondary">
                            {formatCategory(note.category)}
                        </Badge>
                        {note.is_private !== null && note.is_private && (
                            <Badge variant="destructive">
                                <Lock className="mr-1 size-3" />
                                Private
                            </Badge>
                        )}
                        {note._isNew && (
                            <Badge
                                variant="outline"
                                className="border-green-500 bg-green-100 text-green-800 hover:bg-green-200"
                            >
                                New
                            </Badge>
                        )}
                        {(note._isModified || (!note._isNew && isUpdated)) && (
                            <Badge
                                variant="outline"
                                className="border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            >
                                Modified
                            </Badge>
                        )}
                    </div>

                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {note.title || 'Untitled Note'}
                    </h4>

                    <p className="mt-2 text-sm">{note.note}</p>
                </div>

                {showActions && onEdit && onDelete && (
                    <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-2">
                        <button
                            onClick={() => onEdit(note)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(note.id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
