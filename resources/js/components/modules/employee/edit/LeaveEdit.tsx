import { InfoCard } from '@/components/common';
import { Button } from '@/components/ui/button';

export function LeaveEdit() {
    return (
        <InfoCard title="Leave History">
            <div className="py-8 text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                    View and manage employee leave requests and balances.
                </p>
                <Button variant="outline" disabled>
                    View Leave Records
                </Button>
            </div>
        </InfoCard>
    );
}
