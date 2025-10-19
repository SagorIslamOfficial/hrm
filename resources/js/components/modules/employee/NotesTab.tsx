import { Button } from '@/components/ui/button';

export function NotesTab() {
    return (
        <div className="py-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Internal Notes</h3>
            <p className="mb-4 text-sm text-muted-foreground">
                Add internal notes and comments about this employee.
            </p>
            <Button variant="outline" disabled>
                Add Note
            </Button>
        </div>
    );
}
