import { NotesEdit as CommonNotesEdit } from '@/components/common';
import type { Note } from '@/types/branch';

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

export function NotesEdit(props: NotesEditProps) {
    return (
        <CommonNotesEdit
            {...props}
            subjectLabel="branch"
            groupByCategory={true}
            supportsPrivacy={false}
        />
    );
}
