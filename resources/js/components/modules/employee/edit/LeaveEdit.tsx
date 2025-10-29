import { EmptyActionState, InfoCard } from '@/components/common';

export function LeaveEdit() {
    return (
        <InfoCard title="Leave History">
            <EmptyActionState
                message="View and manage employee leave requests."
                buttonText="Add Leave Record"
            />
        </InfoCard>
    );
}
