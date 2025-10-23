import { InfoCard } from '@/components/common';
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
                                        {new Date(
                                            att.date,
                                        ).toLocaleDateString()}
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
                                        In:{' '}
                                        {new Date(
                                            att.check_in,
                                        ).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                )}
                                {att.check_out && (
                                    <div className="text-sm text-muted-foreground">
                                        Out:{' '}
                                        {new Date(
                                            att.check_out,
                                        ).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    No attendance records available
                </p>
            )}
        </InfoCard>
    );
}
