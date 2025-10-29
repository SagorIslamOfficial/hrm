import DetailRow from '@/components/common/DetailRow';
import { InfoCard } from '@/components/common/InfoCard';

interface EmploymentType {
    id: string;
    name: string;
    code: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    employees_count?: number;
}

interface Props {
    employmentType: EmploymentType;
}

export default function EmploymentTypeShow({ employmentType }: Props) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <InfoCard title="Employment Type Details" className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <DetailRow label="Name">{employmentType.name}</DetailRow>

                    <DetailRow label="Code">
                        <code className="rounded bg-muted px-2 py-1 text-sm">
                            {employmentType.code}
                        </code>
                    </DetailRow>
                </div>

                <div className="my-6">
                    {employmentType.description && (
                        <DetailRow
                            label="Description"
                            valueClassName="text-sm leading-relaxed"
                        >
                            <span className="text-black">
                                {employmentType.description}
                            </span>
                        </DetailRow>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <DetailRow
                        label="Status"
                        statusValue={
                            employmentType.is_active ? 'active' : 'inactive'
                        }
                    />

                    <DetailRow label="Employees" className="text-primary">
                        {employmentType.employees_count ?? 0}{' '}
                        <span className="text-sm">employees</span>
                    </DetailRow>
                </div>
            </InfoCard>

            <InfoCard title="Timestamps">
                <div className="space-y-6">
                    <DetailRow label="Created" valueClassName="text-sm">
                        {new Date(employmentType.created_at).toLocaleString()}
                    </DetailRow>

                    <DetailRow label="Last Updated" valueClassName="text-sm">
                        {new Date(employmentType.updated_at).toLocaleString()}
                    </DetailRow>
                </div>
            </InfoCard>
        </div>
    );
}
