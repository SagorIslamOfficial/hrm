import DetailRow from '@/components/common/DetailRow';
import { InfoCard } from '@/components/common/InfoCard';
import { MembersDrawer } from '@/components/common/MembersDrawer';
import { useState } from 'react';

interface Designation {
    id: string;
    title: string;
    code: string;
    description?: string;
    department_id?: string;
    department?: {
        id: string;
        name: string;
    };
    is_active: boolean;
    employee_count?: number;
    employees?: Array<{
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        employee_code?: string;
        department_name?: string;
        designation_title?: string;
        employment_status?: string;
    }>;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

interface DesignationShowProps {
    designation: Designation;
    stats?: {
        employee_count: number;
        department_name?: string;
    };
}

export function DesignationShow({ designation, stats }: DesignationShowProps) {
    const [membersDrawerOpen, setMembersDrawerOpen] = useState(false);

    const employeeCount =
        stats?.employee_count ||
        designation.employee_count ||
        designation.employees?.length ||
        0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <InfoCard title="Designation Details" className="lg:col-span-2">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <DetailRow label="Title">{designation.title}</DetailRow>

                        <DetailRow label="Code">
                            <code className="rounded bg-muted px-2 py-1 text-sm lowercase">
                                {designation.code}
                            </code>
                        </DetailRow>
                    </div>

                    <div className="my-6">
                        {designation.description && (
                            <DetailRow
                                label="Description"
                                valueClassName="text-sm leading-relaxed"
                            >
                                <span className="text-black">
                                    {designation.description}
                                </span>
                            </DetailRow>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <DetailRow label="Department">
                            {designation.department?.name || 'N/A'}
                        </DetailRow>

                        <DetailRow
                            label="Status"
                            statusValue={
                                designation.is_active ? 'active' : 'inactive'
                            }
                        />

                        <DetailRow label="Employees" className="text-primary">
                            <button
                                onClick={() => setMembersDrawerOpen(true)}
                                className="cursor-pointer text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
                            >
                                {employeeCount}{' '}
                                <span className="text-sm">employees</span>
                            </button>
                        </DetailRow>
                    </div>
                </InfoCard>

                <InfoCard title="Timestamps">
                    <div className="space-y-6">
                        <DetailRow label="Created" valueClassName="text-sm">
                            {new Date(designation.created_at).toLocaleString()}
                        </DetailRow>

                        <DetailRow
                            label="Last Updated"
                            valueClassName="text-sm"
                        >
                            {new Date(designation.updated_at).toLocaleString()}
                        </DetailRow>
                    </div>
                </InfoCard>
            </div>

            {/* Members Drawer */}
            <MembersDrawer
                isOpen={membersDrawerOpen}
                onClose={() => setMembersDrawerOpen(false)}
                employees={(designation.employees || []).map((emp) => ({
                    id: emp.id,
                    employee_code: emp.employee_code || '',
                    first_name: emp.first_name,
                    last_name: emp.last_name,
                    email: emp.email,
                    department_name: emp.department_name || 'N/A',
                    designation_title: '',
                    employment_status: emp.employment_status || 'active',
                    joining_date: '',
                    created_at: '',
                }))}
                departmentName={designation.department?.name || 'N/A'}
                title="Department Members"
                hideDesignationColumn={true}
                hideDepartmentBadge={true}
            />
        </div>
    );
}
