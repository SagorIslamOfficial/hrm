import { InfoCard } from '@/components/common';
import { Button } from '@/components/ui/button';

export function AttendanceEdit() {
    return (
        <InfoCard title="Attendance History">
            <div className="py-8 text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                    View and manage employee attendance records and time
                    tracking.
                </p>
                <Button variant="outline" disabled>
                    View Attendance
                </Button>
            </div>
        </InfoCard>
    );
}
