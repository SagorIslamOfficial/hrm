import { InfoCard } from '@/components/common';
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
                                            {leave.leave_type
                                                .split('_')
                                                .map(
                                                    (word) =>
                                                        word
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        word.slice(1),
                                                )
                                                .join(' ')}
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
                                        {new Date(
                                            leave.start_date,
                                        ).toLocaleDateString()}{' '}
                                        -{' '}
                                        {new Date(
                                            leave.end_date,
                                        ).toLocaleDateString()}{' '}
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
                <p className="text-sm text-muted-foreground">
                    No leave records available
                </p>
            )}
        </InfoCard>
    );
}
