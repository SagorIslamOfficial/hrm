import {
    DeleteDialog,
    EmptyActionState,
    InfoCard,
    ResourceDialog,
} from '@/components/common';
import { DataTableActions } from '@/components/common/DataTableActions';
import { EntityHeader, GetBorderClass } from '@/components/common/EntityHeader';
import { NoteForm } from '@/components/common/NoteForm';
import { NoteMeta } from '@/components/common/NoteMeta';
import type { Note } from '@/components/common/interfaces';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NotesEditProps {
    notes: Note[];
    onNoteAdd: (noteData: Note) => void;
    onNoteEdit: (noteData: Note) => void;
    onNoteDelete: (noteId: string) => void;
    currentUser?: {
        id: string;
        name?: string;
    };
    subjectLabel?: string;
    groupByCategory?: boolean;
    title?: string;
    emptyMessage?: string;
    emptyButtonText?: string;
    supportsPrivacy?: boolean;
}

export function NotesEdit({
    notes,
    onNoteAdd,
    onNoteEdit,
    onNoteDelete,
    currentUser,
    subjectLabel = 'employee',
    groupByCategory = false,
    title = 'Internal Notes',
    emptyMessage = 'Add internal notes and comments about what matters.',
    emptyButtonText = 'Add Note',
    supportsPrivacy = true,
}: NotesEditProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(
        null,
    );

    const handleDelete = (noteId: string) => {
        onNoteDelete(noteId);
        setDeleteDialogOpen(null);
    };

    const openEditDialog = (note: Note) => {
        setEditDialogOpen(note.id);
    };

    const formatCategory = (category: string) => {
        return category
            .split(/[-_]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const activeNotes = (notes || []).filter((note) => !note._isDeleted);

    if (!groupByCategory) {
        return (
            <>
                <InfoCard
                    title={title}
                    action={
                        <Button
                            type="button"
                            variant="secondary"
                            className="cursor-pointer border-2 border-blue-700"
                            onClick={() => setIsAddDialogOpen(true)}
                        >
                            {emptyButtonText}
                        </Button>
                    }
                >
                    {activeNotes.length > 0 ? (
                        <div className="space-y-4">
                            {activeNotes.map((note) => {
                                const borderClass = GetBorderClass(
                                    note._isNew,
                                    note._isModified,
                                );

                                return (
                                    <div
                                        key={note.id}
                                        className={`relative rounded-lg ${borderClass} p-4`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                <EntityHeader
                                                    name={formatCategory(
                                                        note.category,
                                                    )}
                                                    className="mb-2"
                                                    nameClassName="text-sm font-medium"
                                                    badges={[
                                                        ...(note.is_private !==
                                                        null
                                                            ? [
                                                                  {
                                                                      show: note.is_private,
                                                                      label: 'Private',
                                                                      variant:
                                                                          'destructive' as const,
                                                                  },
                                                              ]
                                                            : []),
                                                        {
                                                            show: note._isNew,
                                                            label: 'New',
                                                            variant: 'outline',
                                                            className:
                                                                'border-green-500 bg-green-100 text-green-800 hover:bg-green-200',
                                                        },
                                                        {
                                                            show: !!(
                                                                note._isModified ||
                                                                (!note._isNew &&
                                                                    note.updated_at &&
                                                                    note.updated_at !==
                                                                        note.created_at)
                                                            ),
                                                            label: 'Modified',
                                                            variant: 'outline',
                                                            className:
                                                                'border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                                                        },
                                                    ]}
                                                />

                                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {note.title ||
                                                        'Untitled Note'}
                                                </h4>

                                                <NoteMeta
                                                    note={note}
                                                    currentUser={currentUser}
                                                />

                                                <p className="mt-2 text-sm">
                                                    {note.note}
                                                </p>
                                            </div>

                                            <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-2">
                                                <DataTableActions
                                                    item={note}
                                                    onEdit={() =>
                                                        openEditDialog(note)
                                                    }
                                                    onDelete={() =>
                                                        setDeleteDialogOpen(
                                                            note.id,
                                                        )
                                                    }
                                                    showView={false}
                                                />
                                            </div>
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

                {/* Add Note Dialog */}
                <ResourceDialog
                    mode="add"
                    open={isAddDialogOpen}
                    resourceLabel="Note"
                    subjectLabel={subjectLabel}
                >
                    <NoteForm
                        onSuccess={(noteData: Note) => {
                            onNoteAdd(noteData);
                            setIsAddDialogOpen(false);
                        }}
                        onCancel={() => setIsAddDialogOpen(false)}
                        currentUser={currentUser}
                        subjectLabel={subjectLabel}
                        supportsPrivacy={supportsPrivacy}
                    />
                </ResourceDialog>

                {/* Edit Note Dialog */}
                <ResourceDialog
                    mode="edit"
                    open={!!editDialogOpen}
                    resourceLabel="Note"
                    subjectLabel={subjectLabel}
                >
                    <NoteForm
                        note={
                            editDialogOpen
                                ? (notes || []).find(
                                      (n) => n.id === editDialogOpen,
                                  )
                                : undefined
                        }
                        onSuccess={(noteData: Note) => {
                            onNoteEdit(noteData);
                            setEditDialogOpen(null);
                        }}
                        onCancel={() => setEditDialogOpen(null)}
                        currentUser={currentUser}
                        subjectLabel={subjectLabel}
                        supportsPrivacy={supportsPrivacy}
                    />
                </ResourceDialog>

                {/* Delete Note Dialog */}
                <DeleteDialog
                    open={!!deleteDialogOpen}
                    onOpenChange={(open) => {
                        if (!open) setDeleteDialogOpen(null);
                    }}
                    onConfirm={() => {
                        if (deleteDialogOpen) {
                            handleDelete(deleteDialogOpen);
                        }
                    }}
                    title="Delete Note"
                    description="Are you sure you want to delete this note? This action cannot be undone."
                    confirmLabel="Delete Note"
                />
            </>
        );
    }

    // Grouped by category
    const groupedNotes = activeNotes.reduce(
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
        <>
            <InfoCard
                title={title}
                action={
                    <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer border-2 border-blue-700"
                        onClick={() => setIsAddDialogOpen(true)}
                    >
                        {emptyButtonText}
                    </Button>
                }
            >
                {activeNotes.length > 0 ? (
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
                                            const borderClass = GetBorderClass(
                                                note._isNew,
                                                note._isModified,
                                            );

                                            const isModified =
                                                note.updated_at &&
                                                note.updated_at !==
                                                    note.created_at;

                                            const showModified: boolean =
                                                Boolean(note._isModified) ||
                                                (Boolean(note._isNew) ===
                                                    false &&
                                                    Boolean(isModified));

                                            return (
                                                <div
                                                    key={note.id}
                                                    className={`relative rounded-lg ${borderClass} p-4`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-1">
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
                                                                        variant:
                                                                            'outline',
                                                                        className:
                                                                            'border-green-500 bg-green-100 text-green-800 hover:bg-green-200',
                                                                    },
                                                                    {
                                                                        show: showModified,
                                                                        label: 'Modified',
                                                                        variant:
                                                                            'outline',
                                                                        className:
                                                                            'border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                                                                    },
                                                                ]}
                                                            />

                                                            <NoteMeta
                                                                note={note}
                                                                currentUser={
                                                                    currentUser
                                                                }
                                                            />

                                                            <p className="mt-2 text-sm text-gray-800 dark:text-gray-300">
                                                                {note.note}
                                                            </p>
                                                        </div>

                                                        <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-2">
                                                            <DataTableActions
                                                                item={{
                                                                    id: note.id,
                                                                    name: note.note.substring(
                                                                        0,
                                                                        50,
                                                                    ),
                                                                }}
                                                                onEdit={() =>
                                                                    openEditDialog(
                                                                        note,
                                                                    )
                                                                }
                                                                onDelete={() =>
                                                                    setDeleteDialogOpen(
                                                                        note.id,
                                                                    )
                                                                }
                                                                showView={false}
                                                            />
                                                        </div>
                                                    </div>
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

            {/* Add Note Dialog */}
            <ResourceDialog
                mode="add"
                open={isAddDialogOpen}
                resourceLabel="Note"
                subjectLabel={subjectLabel}
            >
                <NoteForm
                    onSuccess={(noteData: Note) => {
                        onNoteAdd(noteData);
                        setIsAddDialogOpen(false);
                    }}
                    onCancel={() => setIsAddDialogOpen(false)}
                    currentUser={currentUser}
                    subjectLabel={subjectLabel}
                    supportsPrivacy={supportsPrivacy}
                />
            </ResourceDialog>

            {/* Edit Note Dialog */}
            <ResourceDialog
                mode="edit"
                open={!!editDialogOpen}
                resourceLabel="Note"
                subjectLabel={subjectLabel}
            >
                <NoteForm
                    note={
                        editDialogOpen
                            ? (notes || []).find((n) => n.id === editDialogOpen)
                            : undefined
                    }
                    onSuccess={(noteData: Note) => {
                        onNoteEdit(noteData);
                        setEditDialogOpen(null);
                    }}
                    onCancel={() => setEditDialogOpen(null)}
                    currentUser={currentUser}
                    subjectLabel={subjectLabel}
                    supportsPrivacy={supportsPrivacy}
                />
            </ResourceDialog>

            {/* Delete Note Dialog */}
            <DeleteDialog
                open={!!deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) setDeleteDialogOpen(null);
                }}
                onConfirm={() => {
                    if (deleteDialogOpen) {
                        handleDelete(deleteDialogOpen);
                    }
                }}
                title="Delete Note"
                description="Are you sure you want to delete this note? This action cannot be undone."
                confirmLabel="Delete Note"
            />
        </>
    );
}
