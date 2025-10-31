import { InfoCard } from '@/components/common';
import DetailRow from '@/components/common/DetailRow';
import { formatDateForDisplay } from '@/components/common/utils/dateUtils';
import { Separator } from '@/components/ui/separator';

interface Employee {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    photo_url?: string;
    employment_status: string;
    employment_type: string;
    joining_date: string;
    department: {
        id: string;
        name: string;
        code: string;
    };
    designation: {
        id: string;
        title: string;
        code: string;
    };
    creator?: { name: string };
    created_at?: string;
    updated_at?: string;
}

interface OverviewViewProps {
    employee: Employee;
    onPhotoClick: (photo: { url: string; name: string }) => void;
    auth?: {
        user?: {
            id?: number;
            name?: string;
            roles?: Array<{ name: string }>;
            is_super_admin?: boolean;
        };
    };
}

export function OverviewView({
    employee,
    onPhotoClick,
    auth,
}: OverviewViewProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Employee Information">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow
                            label="Employee Code"
                            value={employee.employee_code}
                        />

                        <DetailRow
                            label="Status"
                            statusValue={employee.employment_status}
                        />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <DetailRow
                                label="Full Name"
                                value={`${employee.first_name} ${employee.last_name}`}
                            />

                            <DetailRow label="Email" value={employee.email} />

                            <DetailRow
                                label="Phone"
                                value={employee.phone || 'N/A'}
                            />
                        </div>

                        {employee.photo_url && (
                            <DetailRow
                                label="Photo"
                                value={`${employee.first_name} ${employee.last_name}`}
                                imageSrc={employee.photo_url}
                                imageAlt={`${employee.first_name} ${employee.last_name}`}
                                imageClassName="size-30 cursor-pointer rounded-lg transition-opacity hover:opacity-80"
                                imageWrapperClassName=""
                                onImageClick={() =>
                                    onPhotoClick({
                                        url: employee.photo_url!,
                                        name: `${employee.first_name} ${employee.last_name}`,
                                    })
                                }
                                showValue={false}
                            />
                        )}
                    </div>
                </div>
            </InfoCard>

            <InfoCard title="Employment Details">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                        <DetailRow
                            label="Department"
                            value={employee.department.name}
                        />
                        <DetailRow
                            label="Designation"
                            value={employee.designation.title}
                        />
                        <DetailRow
                            label="Employment Type"
                            value={employee.employment_type.replace('_', ' ')}
                        />

                        <DetailRow
                            label="Joining Date"
                            value={formatDateForDisplay(employee.joining_date)}
                        />
                    </div>

                    <div className="space-y-3">
                        {(auth?.user?.is_super_admin ||
                            auth?.user?.roles?.some(
                                (r) => r.name === 'Admin',
                            )) && (
                            <>
                                <DetailRow
                                    label="Created By"
                                    value={
                                        employee.creator?.name ??
                                        auth?.user?.name ??
                                        '—'
                                    }
                                />

                                <DetailRow
                                    label="Created At"
                                    value={
                                        employee.created_at
                                            ? new Date(
                                                  employee.created_at,
                                              ).toLocaleString()
                                            : '—'
                                    }
                                />

                                <DetailRow
                                    label="Updated At"
                                    value={
                                        employee.updated_at
                                            ? new Date(
                                                  employee.updated_at,
                                              ).toLocaleString()
                                            : '—'
                                    }
                                />
                            </>
                        )}
                    </div>
                </div>
            </InfoCard>
        </div>
    );
}
