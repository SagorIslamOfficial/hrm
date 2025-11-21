import { NotesList } from '@/components/common';
import { type Note } from '@/types/branch';

interface NotesViewProps {
    notes?: Note[];
}

export function NotesView({ notes = [] }: NotesViewProps) {
    return (
        <NotesList
            notes={notes}
            groupByCategory={true}
            emptyMessage="Add branch notes to track more information."
            emptyButtonText="Add Branch Notes"
        />
    );
}
