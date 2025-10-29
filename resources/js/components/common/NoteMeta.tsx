import type { Note } from '@/components/common/interfaces/Note';

export interface NoteMetaProps {
    note: Note;
    currentUser?: { id: string; name?: string } | null;
}

export function NoteMeta({ note, currentUser }: NoteMetaProps) {
    const creatorName = note.creator?.name ?? currentUser?.name ?? 'Unknown';

    const formatDate = (iso?: string) =>
        iso ? new Date(iso).toLocaleDateString() : '';

    const formatTime = (iso?: string) =>
        iso
            ? new Date(iso)
                  .toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                  })
                  .toLowerCase()
            : '';

    return (
        <p className="text-xs text-muted-foreground">
            By {creatorName} • {formatDate(note.created_at)} •{' '}
            {formatTime(note.created_at)}
            {note._isModified && currentUser?.name ? (
                <>
                    {' '}
                    • Updated by {currentUser.name} •{' '}
                    {formatDate(new Date().toISOString())} •{' '}
                    {formatTime(new Date().toISOString())}
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
                    {formatDate(note.updated_at)} •{' '}
                    {formatTime(note.updated_at)}
                </>
            ) : null}
        </p>
    );
}

export default NoteMeta;
