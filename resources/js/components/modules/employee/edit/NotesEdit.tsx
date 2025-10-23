import { InfoCard } from '@/components/common';
import { Button } from '@/components/ui/button';

export function NotesEdit() {
    return (
        <InfoCard title="Internal Notes">
            <div className="py-8 text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                    Add internal notes and comments about this employee.
                </p>
                <Button variant="outline" disabled>
                    Add Note
                </Button>
            </div>
        </InfoCard>
    );
}
