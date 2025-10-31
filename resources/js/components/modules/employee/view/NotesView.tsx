import {
    EmptyActionState,
    formatDateForDisplay,
    formatTimeForDisplay,
    InfoCard,
} from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface Note {
    id: string;
    note: string;
    category: string;
    is_private: boolean;
    created_at: string;
    creator?: {
        name: string;
    };
    updated_at?: string;
    updater?: {
        name?: string;
    };
}
interface NotesViewProps {
    notes?: Note[];
}
export function NotesView({ notes }: NotesViewProps) {
    const formatCategory = (category: string) => {
        return category
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    return (
        <InfoCard title="Internal Notes">
            {notes && notes.length > 0 ? (
                <div className="space-y-4">
                    {notes.map((note) => {
                        const isUpdated =
                            note.updated_at &&
                            note.updated_at !== note.created_at;

                        const createdDateStr = formatDateForDisplay(
                            note.created_at,
                        );
                        const createdTimeStr = formatTimeForDisplay(
                            note.created_at,
                        );

                        let updatedDateStr = '';
                        let updatedTimeStr = '';
                        if (isUpdated && note.updated_at) {
                            updatedDateStr = formatDateForDisplay(
                                note.updated_at,
                            );
                            updatedTimeStr = formatTimeForDisplay(
                                note.updated_at,
                            );
                        }

                        return (
                            <div
                                key={note.id}
                                className="rounded-lg border p-4"
                            >
                                <div className="mb-2 flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex gap-2">
                                            <Badge variant="secondary">
                                                {formatCategory(note.category)}
                                            </Badge>
                                            {note.is_private && (
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
                                        <p className="pt-1 text-xs text-muted-foreground">
                                            By {note.creator?.name} •{' '}
                                            {createdDateStr} • {createdTimeStr}
                                            {isUpdated && (
                                                <span className="text-xs text-muted-foreground">
                                                    {' '}
                                                    - Updated by{' '}
                                                    {note.updater?.name ??
                                                        note.creator?.name ??
                                                        'Unknown'}{' '}
                                                    • {updatedDateStr} •{' '}
                                                    {updatedTimeStr}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm">{note.note}</p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyActionState
                    message="Add internal notes and comments about what matters."
                    buttonText="Add Note"
                />
            )}
        </InfoCard>
    );
}
