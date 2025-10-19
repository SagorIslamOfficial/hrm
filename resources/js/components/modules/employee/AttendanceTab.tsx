import { Button } from '@/components/ui/button';

export function AttendanceTab() {
    return (
        <div className="py-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Attendance History</h3>
            <p className="mb-4 text-sm text-muted-foreground">
                View and manage employee attendance records and time tracking.
            </p>
            <Button variant="outline" disabled>
                View Attendance
            </Button>
        </div>
    );
}
