import { InfoCard } from '@/components/common';
import { EmptyActionState } from '@/components/common/EmptyActionState';

export function AttendanceEdit() {
    return (
        <InfoCard title="Attendance History">
            <EmptyActionState
                message="Add attendance records to track employee information."
                buttonText="Add Attendance Record"
            />
        </InfoCard>
    );
}
