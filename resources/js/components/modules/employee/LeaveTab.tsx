import { Button } from '@/components/ui/button';

export function LeaveTab() {
    return (
        <div className="py-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Leave History</h3>
            <p className="mb-4 text-sm text-muted-foreground">
                View and manage employee leave requests and balances.
            </p>
            <Button variant="outline" disabled>
                View Leave Records
            </Button>
        </div>
    );
}
