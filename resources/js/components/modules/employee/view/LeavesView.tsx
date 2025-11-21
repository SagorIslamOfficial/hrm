import {
    EmptyActionState,
    formatDateForDisplay,
    InfoCard,
} from '@/components/common';
import { titleCase } from '@/components/common/utils/formatUtils';
import { Badge } from '@/components/ui/badge';

interface Leave {
    id: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    total_days: number;
    status: string;
    reason: string;
}

interface LeavesViewProps {
    leaves?: Leave[];
}

export function LeavesView({ leaves }: LeavesViewProps) {
    return (
        <InfoCard title="Leave Records">
            {leaves && leaves.length > 0 ? (
                <div className="space-y-4">
                    {leaves.map((leave) => (
                        <div key={leave.id} className="rounded-lg border p-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                            <Badge variant="secondary">
                                                {titleCase(leave.leave_type)}
                                        </Badge>
                                        <Badge
                                            variant={
                                                leave.status === 'approved'
                                                    ? 'default'
                                                    : leave.status === 'pending'
                                                      ? 'secondary'
                                                      : 'destructive'
                                            }
                                        >
                                            {leave.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                leave.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">
                                            Duration:
                                        </span>{' '}
                                        {formatDateForDisplay(leave.start_date)}{' '}
                                        - {formatDateForDisplay(leave.end_date)}{' '}
                                        ({leave.total_days} days)
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">
                                            Reason:
                                        </span>{' '}
                                        {leave.reason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyActionState
                    message="View and manage employee leave requests."
                    buttonText="Add Leave Record"
                />
            )}
        </InfoCard>
    );
}
