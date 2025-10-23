import { InfoCard } from '@/components/common';
import { Badge } from '@/components/ui/badge';

interface Note {
    id: string;
    note: string;
    category: string;
    is_private: boolean;
    created_at: string;
    creator: {
        name: string;
    };
}

interface NotesViewProps {
    notes?: Note[];
}

export function NotesView({ notes }: NotesViewProps) {
    return (
        <InfoCard title="Notes">
            {notes && notes.length > 0 ? (
                <div className="space-y-4">
                    {notes.map((note) => (
                        <div key={note.id} className="rounded-lg border p-4">
                            <div className="mb-2 flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex gap-2">
                                        <Badge variant="secondary">
                                            {note.category
                                                .split('_')
                                                .map(
                                                    (word) =>
                                                        word
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        word.slice(1),
                                                )
                                                .join(' ')}
                                        </Badge>
                                        {note.is_private && (
                                            <Badge variant="destructive">
                                                Private
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        By {note.creator.name} •{' '}
                                        {new Date(
                                            note.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm">{note.note}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    No notes available
                </p>
            )}
        </InfoCard>
    );
}
