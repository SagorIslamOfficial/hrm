import {
    formatDateForDisplay,
    formatTimeForDisplay,
} from '@/components/common';
import type { Note } from '@/components/common/interfaces/Note';

export interface NoteMetaProps {
    note: Note;
    currentUser?: { id: string; name?: string } | null;
}

export function NoteMeta({ note, currentUser }: NoteMetaProps) {
    const creatorName = note.creator?.name ?? currentUser?.name ?? 'Unknown';

    return (
        <p className="text-xs text-muted-foreground">
            By {creatorName} • {formatDateForDisplay(note.created_at)} •{' '}
            {formatTimeForDisplay(note.created_at)}
            {note._isModified && currentUser?.name ? (
                <>
                    {' '}
                    • Updated by {currentUser.name} •{' '}
                    {formatDateForDisplay(new Date().toISOString())} •{' '}
                    {formatTimeForDisplay(new Date().toISOString())}
                </>
            ) : null}
            {!note._isModified &&
            note.updated_at &&
            note.updated_at !== note.created_at ? (
                <>
                    {' '}
                    - Updated by{' '}
                    {note.updater?.name ??
                        note.creator?.name ??
                        currentUser?.name ??
                        'Unknown'}{' '}
                    {formatDateForDisplay(note.updated_at)} •{' '}
                    {formatTimeForDisplay(note.updated_at)}
                </>
            ) : null}
        </p>
    );
}

export default NoteMeta;
