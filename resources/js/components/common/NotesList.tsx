import { EmptyActionState, InfoCard } from '@/components/common';
import { EntityHeader } from '@/components/common/EntityHeader';
import { NoteCard } from '@/components/common/NoteCard';
import { NoteMeta } from '@/components/common/NoteMeta';
import type { Note } from '@/components/common/interfaces';

interface NotesListProps {
    notes?: Note[];
    title?: string;
    emptyMessage?: string;
    emptyButtonText?: string;
    groupByCategory?: boolean;
    showActions?: boolean;
    onEdit?: (note: Note) => void;
    onDelete?: (noteId: string) => void;
    currentUser?: {
        id: string;
        name?: string;
    };
}

export function NotesList({
    notes = [],
    title = 'Internal Notes',
    emptyMessage = 'Add internal notes and comments about what matters.',
    emptyButtonText = 'Add Note',
    groupByCategory = false,
    showActions = false,
    onEdit,
    onDelete,
    currentUser,
}: NotesListProps) {
    const formatCategory = (category: string) => {
        return category
            .split(/[-_]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    if (!groupByCategory) {
        return (
            <InfoCard title={title}>
                {notes.length > 0 ? (
                    <div className="space-y-4">
                        {notes.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                variant="detailed"
                                showActions={showActions}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyActionState
                        message={emptyMessage}
                        buttonText={emptyButtonText}
                    />
                )}
            </InfoCard>
        );
    }

    // Grouped by category
    const groupedNotes = notes.reduce(
        (acc, note) => {
            const category = note.category || 'other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(note);
            return acc;
        },
        {} as Record<string, Note[]>,
    );

    const categories = [
        'general',
        'performance',
        'disciplinary',
        'achievement',
        'other',
    ];

    return (
        <InfoCard title={title}>
            {notes.length > 0 ? (
                <div className="space-y-6">
                    {categories.map((category) => {
                        const categoryNotes = groupedNotes[category] || [];
                        if (categoryNotes.length === 0) return null;

                        return (
                            <div key={category}>
                                <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                                    {formatCategory(category)}
                                </h4>
                                <div className="space-y-3">
                                    {categoryNotes.map((note) => {
                                        const isModified =
                                            note.updated_at &&
                                            note.updated_at !== note.created_at;

                                        const showModified: boolean =
                                            Boolean(note._isModified) ||
                                            (Boolean(note._isNew) === false &&
                                                Boolean(isModified));

                                        return (
                                            <div
                                                key={note.id}
                                                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                                            >
                                                <EntityHeader
                                                    name={
                                                        note.title ||
                                                        formatCategory(
                                                            note.category,
                                                        )
                                                    }
                                                    className="mb-2"
                                                    nameClassName="text-sm font-medium"
                                                    badges={[
                                                        ...(note.is_private !==
                                                        null
                                                            ? [
                                                                  {
                                                                      show: Boolean(
                                                                          note.is_private,
                                                                      ),
                                                                      label: 'Private',
                                                                      variant:
                                                                          'destructive' as const,
                                                                  },
                                                              ]
                                                            : []),
                                                        {
                                                            show: Boolean(
                                                                note._isNew,
                                                            ),
                                                            label: 'New',
                                                            variant: 'outline',
                                                            className:
                                                                'border-green-500 bg-green-100 text-green-800 hover:bg-green-200',
                                                        },
                                                        {
                                                            show: showModified,
                                                            label: 'Modified',
                                                            variant: 'outline',
                                                            className:
                                                                'border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                                                        },
                                                    ]}
                                                />

                                                <NoteMeta
                                                    note={note}
                                                    currentUser={currentUser}
                                                />

                                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {note.note}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyActionState
                    message={emptyMessage}
                    buttonText={emptyButtonText}
                />
            )}
        </InfoCard>
    );
}
