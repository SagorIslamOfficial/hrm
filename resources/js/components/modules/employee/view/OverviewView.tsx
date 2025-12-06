import { InfoCard, StatusBadge } from '@/components/common';
import DetailRow from '@/components/common/DetailRow';
import {
    formatDateForDisplay,
    formatDateTimeForDisplay,
} from '@/components/common/utils/dateUtils';
import { Separator } from '@/components/ui/separator';
import { show as usersShow } from '@/routes/users';
import { Link } from '@inertiajs/react';
import { UserCheck, UserX } from 'lucide-react';

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
    user?: {
        id: number;
        name: string;
        email: string;
        created_at?: string;
        roles?: Array<{ id: number; name: string }>;
    };
    creator?: { name: string };
    created_at?: string;
    updated_at?: string;
}

interface OverviewViewProps {
    employee: Employee;
    auth?: {
        user?: {
            id?: number;
            name?: string;
            roles?: Array<{ name: string }>;
            is_super_admin?: boolean;
        };
    };
}

export function OverviewView({ employee, auth }: OverviewViewProps) {
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
                                    value={formatDateTimeForDisplay(
                                        employee.created_at,
                                    )}
                                />

                                <DetailRow
                                    label="Updated At"
                                    value={formatDateTimeForDisplay(
                                        employee.updated_at,
                                    )}
                                />
                            </>
                        )}
                    </div>
                </div>
            </InfoCard>

            {(auth?.user?.is_super_admin ||
                auth?.user?.roles?.some((r) => r.name === 'Admin')) && (
                <InfoCard title="User Account" className="md:col-span-2">
                    {employee.user ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                    <UserCheck className="size-5 text-green-600 dark:text-green-400" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </p>
                                    <div className="mt-1">
                                        <StatusBadge status="active" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <DetailRow
                                    label="Username"
                                    value={employee.user.name}
                                />
                                <DetailRow
                                    label="Email"
                                    value={employee.user.email}
                                />
                            </div>

                            <div className="space-y-3">
                                <DetailRow
                                    label="Role"
                                    value={
                                        employee.user.roles
                                            ?.map((r) => r.name)
                                            .join(', ') || 'No role assigned'
                                    }
                                />
                                <DetailRow
                                    label="Account Created"
                                    value={formatDateTimeForDisplay(
                                        employee.user.created_at,
                                    )}
                                />
                            </div>

                            <div className="md:col-span-3">
                                <Link
                                    href={usersShow(employee.user.id).url}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    View User Details →
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                <UserX className="size-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-medium">No User Account</p>
                                <p className="text-sm text-muted-foreground">
                                    This employee does not have a system login
                                    account.
                                </p>
                            </div>
                        </div>
                    )}
                </InfoCard>
            )}
        </div>
    );
}
