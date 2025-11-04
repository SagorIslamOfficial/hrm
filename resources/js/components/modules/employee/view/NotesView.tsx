import { NotesList } from '@/components/common';
import type { Note } from '@/components/common/interfaces';

interface NotesViewProps {
    notes?: Note[];
}

export function NotesView({ notes }: NotesViewProps) {
    return <NotesList notes={notes} groupByCategory={true} />;
}
