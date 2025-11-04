import {
    EmptyActionState,
    formatDateForDisplay,
    InfoCard,
} from '@/components/common';
import DetailRow from '@/components/common/DetailRow';

interface DepartmentDetail {
    founded_date?: string;
    division?: string;
    cost_center?: string;
    internal_code?: string;
    office_phone?: string;
}

interface DetailsViewProps {
    detail?: DepartmentDetail;
}

export function DetailsView({ detail }: DetailsViewProps) {
    return (
        <InfoCard title="Department Details">
            {detail ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <DetailRow
                            label="Founded Date"
                            value={
                                detail.founded_date
                                    ? formatDateForDisplay(detail.founded_date)
                                    : 'N/A'
                            }
                        />

                        <DetailRow label="Division" value={detail.division} />

                        <DetailRow
                            label="Cost Center"
                            value={detail.cost_center}
                        />

                        <DetailRow
                            label="Internal Code"
                            value={detail.internal_code}
                        />

                        <DetailRow
                            label="Office Phone"
                            value={detail.office_phone}
                        />
                    </div>
                </div>
            ) : (
                <EmptyActionState
                    message="Add department details to track more information."
                    buttonText="Add Department Details"
                />
            )}
        </InfoCard>
    );
}
