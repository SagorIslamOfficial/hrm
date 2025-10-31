import {
    EmptyActionState,
    formatDateForDisplay,
    formatTimeForDisplay,
    InfoCard,
} from '@/components/common';
import { Badge } from '@/components/ui/badge';

interface Attendance {
    id: string;
    date: string;
    check_in: string | null;
    check_out: string | null;
    status: string;
    remarks: string | null;
}

interface AttendanceViewProps {
    attendance?: Attendance[];
}

export function AttendanceView({ attendance }: AttendanceViewProps) {
    return (
        <InfoCard title="Recent Attendance">
            {attendance && attendance.length > 0 ? (
                <div className="space-y-2">
                    {attendance.map((att) => (
                        <div
                            key={att.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                        >
                            <div className="flex items-center gap-4">
                                <div className="min-w-24">
                                    <p className="font-medium">
                                        {formatDateForDisplay(att.date)}
                                    </p>
                                </div>
                                <div>
                                    <Badge
                                        variant={
                                            att.status === 'present'
                                                ? 'default'
                                                : att.status === 'late'
                                                  ? 'secondary'
                                                  : 'destructive'
                                        }
                                    >
                                        {att.status.charAt(0).toUpperCase() +
                                            att.status.slice(1)}
                                    </Badge>
                                </div>
                                {att.check_in && (
                                    <div className="text-sm text-muted-foreground">
                                        In: {formatTimeForDisplay(att.check_in)}
                                    </div>
                                )}
                                {att.check_out && (
                                    <div className="text-sm text-muted-foreground">
                                        Out:{' '}
                                        {formatTimeForDisplay(att.check_out)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyActionState
                    message="Add attendance records to track employee information."
                    buttonText="Add Attendance Record"
                />
            )}
        </InfoCard>
    );
}
