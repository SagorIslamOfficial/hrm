import { DeleteDialog, InfoCard, NoteDialog } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Note {
    id: string;
    note: string;
    category: string;
    is_private: boolean;
    created_at: string;
    creator?: {
        name?: string;
    };
    updated_at?: string;
    updater?: {
        name?: string;
    };
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

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
                        {[...activeNotes].reverse().map((note) => {
                            let borderClass = 'border';
                            if (note._isNew) {
                                borderClass = 'border-2 border-green-500';
                            } else if (note._isModified) {
                                borderClass = 'border-2 border-yellow-500';
                            }

                            return (
                                <div
                                    key={note.id}
                                    className={`relative rounded-lg ${borderClass} p-4`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1">
                                            <div className="mb-2 flex gap-2">
                                                <Badge variant="secondary">
                                                    {formatCategory(
                                                        note.category,
                                                    )}
                                                </Badge>
                                                {note.is_private && (
                                                    <Badge variant="destructive">
                                                        <Lock className="mr-1 size-3" />
                                                        Private
                                                    </Badge>
                                                )}
                                                {note._isNew && (
                                                    <Badge
                                                        className="border-green-500 bg-green-100 text-green-800 hover:bg-green-200"
                                                        variant="outline"
                                                    >
                                                        New
                                                    </Badge>
                                                )}
                                                {note._isModified && (
                                                    <Badge
                                                        className="border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                        variant="outline"
                                                    >
                                                        Modified
                                                    </Badge>
                                                )}
                                                {!note._isNew &&
                                                    !note._isModified &&
                                                    note.updated_at &&
                                                    note.updated_at !==
                                                        note.created_at && (
                                                        <Badge
                                                            className="border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                            variant="outline"
                                                        >
                                                            Modified
                                                        </Badge>
                                                    )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                By{' '}
                                                {note.creator?.name ??
                                                    currentUser?.name}{' '}
                                                •{' '}
                                                {new Date(
                                                    note.created_at,
                                                ).toLocaleDateString()}{' '}
                                                •{' '}
                                                {new Date(note.created_at)
                                                    .toLocaleTimeString([], {
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                    })
                                                    .toLowerCase()}
                                                {note._isModified &&
                                                    currentUser?.name && (
                                                        <>
                                                            {' '}
                                                            • Updated by{' '}
                                                            {
                                                                currentUser.name
                                                            } •{' '}
                                                            {new Date().toLocaleDateString()}{' '}
                                                            •{' '}
                                                            {new Date()
                                                                .toLocaleTimeString(
                                                                    [],
                                                                    {
                                                                        hour: 'numeric',
                                                                        minute: '2-digit',
                                                                    },
                                                                )
                                                                .toLowerCase()}
                                                        </>
                                                    )}
                                                {!note._isModified &&
                                                    note.updated_at &&
                                                    note.updated_at !==
                                                        note.created_at && (
                                                        <>
                                                            {' '}
                                                            - Updated by{' '}
                                                            {note.updater
                                                                ?.name ??
                                                                note.creator
                                                                    ?.name ??
                                                                currentUser?.name ??
                                                                'Unknown'}{' '}
                                                            {new Date(
                                                                note.updated_at,
                                                            ).toLocaleDateString()}{' '}
                                                            •{' '}
                                                            {new Date(
                                                                note.updated_at,
                                                            )
                                                                .toLocaleTimeString(
                                                                    [],
                                                                    {
                                                                        hour: 'numeric',
                                                                        minute: '2-digit',
                                                                    },
                                                                )
                                                                .toLowerCase()}
                                                        </>
                                                    )}
                                            </p>
                                            <p className="mt-2 text-sm">
                                                {note.note}
                                            </p>
                                        </div>
                                        <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    openEditDialog(note)
                                                }
                                            >
                                                <SquarePen className="h-4 w-4 text-primary" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    setDeleteNoteDialogOpen(
                                                        note.id,
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="mb-4 text-sm text-muted-foreground">
                            Add internal notes and comments about this employee.
                        </p>
                        <Button variant="outline" disabled>
                            Add Note
                        </Button>
                    </div>
                )}
            </InfoCard>

            {/* Add Note Dialog */}
            <NoteDialog
                mode="add"
                open={isAddNoteDialogOpen}
                onOpenChange={setIsAddNoteDialogOpen}
                onSuccess={(noteData) => {
                    onNoteAdd(noteData);
                    setIsAddNoteDialogOpen(false);
                }}
                onCancel={() => setIsAddNoteDialogOpen(false)}
                currentUser={currentUser}
                resourceLabel="Note"
                subjectLabel="employee"
            />

            {/* Edit Note Dialog */}
            <NoteDialog
                mode="edit"
                open={!!editNoteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) setEditNoteDialogOpen(null);
                }}
                note={
                    editNoteDialogOpen
                        ? (notes || []).find((n) => n.id === editNoteDialogOpen)
                        : undefined
                }
                onSuccess={(noteData) => {
                    onNoteEdit(noteData);
                    setEditNoteDialogOpen(null);
                }}
                onCancel={() => setEditNoteDialogOpen(null)}
                currentUser={currentUser}
                resourceLabel="Note"
                subjectLabel="employee"
            />

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
