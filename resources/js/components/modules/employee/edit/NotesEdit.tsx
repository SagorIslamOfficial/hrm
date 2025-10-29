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
}

export function NotesEdit({
    notes,
    onNoteAdd,
    onNoteEdit,
    onNoteDelete,
    currentUser,
}: NotesEditProps) {
    const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
    const [editNoteDialogOpen, setEditNoteDialogOpen] = useState<string | null>(
        null,
    );
    const [deleteNoteDialogOpen, setDeleteNoteDialogOpen] = useState<
        string | null
    >(null);

    const handleNoteDelete = (noteId: string) => {
        onNoteDelete(noteId);
        setDeleteNoteDialogOpen(null);
    };

    const openEditDialog = (note: Note) => {
        setEditNoteDialogOpen(note.id);
    };

    const formatCategory = (category: string) => {
        return category
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const activeNotes = (notes || []).filter((note) => !note._isDeleted);

    return (
        <>
            <InfoCard
                title="Internal Notes"
                action={
                    <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer border-2 border-blue-700"
                        onClick={() => setIsAddNoteDialogOpen(true)}
                    >
                        Add Note
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
                                                    {
                                                        show: note.is_private,
                                                        label: 'Private',
                                                        variant: 'destructive',
                                                    },
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
                                                    setDeleteNoteDialogOpen(
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
                        message="Add internal notes and comments about what matters."
                        buttonText="Add Note"
                    />
                )}
            </InfoCard>

            {/* Add Note Dialog */}
            <ResourceDialog
                mode="add"
                open={isAddNoteDialogOpen}
                resourceLabel="Note"
                subjectLabel="employee"
            >
                <NoteForm
                    onSuccess={(noteData: Note) => {
                        onNoteAdd(noteData);
                        setIsAddNoteDialogOpen(false);
                    }}
                    onCancel={() => setIsAddNoteDialogOpen(false)}
                    currentUser={currentUser}
                    subjectLabel="employee"
                />
            </ResourceDialog>

            {/* Edit Note Dialog */}
            <ResourceDialog
                mode="edit"
                open={!!editNoteDialogOpen}
                resourceLabel="Note"
                subjectLabel="employee"
            >
                <NoteForm
                    note={
                        editNoteDialogOpen
                            ? (notes || []).find(
                                  (n) => n.id === editNoteDialogOpen,
                              )
                            : undefined
                    }
                    onSuccess={(noteData: Note) => {
                        onNoteEdit(noteData);
                        setEditNoteDialogOpen(null);
                    }}
                    onCancel={() => setEditNoteDialogOpen(null)}
                    currentUser={currentUser}
                    subjectLabel="employee"
                />
            </ResourceDialog>

            {/* Delete Note Dialog */}
            <DeleteDialog
                open={!!deleteNoteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) setDeleteNoteDialogOpen(null);
                }}
                onConfirm={() => {
                    if (deleteNoteDialogOpen) {
                        handleNoteDelete(deleteNoteDialogOpen);
                    }
                }}
                title="Delete Note"
                description="Are you sure you want to delete this note? This action cannot be undone."
                confirmLabel="Delete Note"
            />
        </>
    );
}
