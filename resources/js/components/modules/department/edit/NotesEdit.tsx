import { NotesEdit as CommonNotesEdit } from '@/components/common';
import type { Note } from '@/components/common/interfaces';

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
            subjectLabel="department"
            groupByCategory={true}
            supportsPrivacy={false}
        />
    );
}
