import { PageHeader } from '@/components/common';
import { EmployeeEditForm } from '@/components/modules/employee';
import AppLayout from '@/layouts/app-layout';
import {
    edit as employeesEdit,
    index as employeesIndex,
    show as employeesShow,
} from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Employee {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    photo?: string;
    photo_url?: string;
    employment_status: string;
    employment_type: string;
    joining_date: string;
    department?: {
        id: string;
        name: string;
    };
    designation?: {
        id: string;
        title: string;
    };
    personalDetail?: {
        date_of_birth?: string;
        gender?: string;
        marital_status?: string;
        blood_group?: string;
        national_id?: string;
        passport_number?: string;
        address?: string;
        city?: string;
        country?: string;
    };
    jobDetail?: {
        job_title?: string;
        employment_type?: string;
        supervisor_id?: string;
        work_shift?: string;
        probation_end_date?: string;
        contract_end_date?: string;
    };
    salaryDetail?: {
        basic_salary?: number;
        allowances?: number;
        deductions?: number;
        net_salary?: number;
        bank_name?: string;
        bank_account_number?: string;
        bank_branch?: string;
        tax_id?: string;
    };
    documents?: Array<{
        id: string;
        doc_type: string;
        title: string;
        file_name: string;
        file_path: string;
        file_url: string;
        file_size: number;
        expiry_date: string | null;
        is_expired: boolean;
        is_expiring_soon: boolean;
        uploader?: {
            id: string;
            name: string;
        };
        created_at: string;
    }>;
    notes?: Array<{
        id: string;
        note: string;
        category: string;
        is_private: boolean;
        created_at: string;
        updated_at?: string;
        creator?: {
            name?: string;
        };
        updater?: {
            name?: string;
        };
    }>;
    customFields?: Array<{
        id: string;
        field_name: string;
        field_value: string;
        field_type: string;
    }>;
}

interface Branch {
    id: string;
    name: string;
    code?: string;
}

interface Props {
    employee: Employee;
    departments: Array<{ id: string; name: string }>;
    designations: Array<{ id: string; title: string }>;
    employmentTypes: Array<{ code: string; name: string }>;
    supervisors: Array<{ id: string; name: string; employee_code: string }>;
    branches: Branch[];
    auth?: {
        user?: {
            id: string;
            name: string;
            email: string;
            roles?: Array<{ name: string }>;
            is_super_admin?: boolean;
        };
    };
}

export default function Edit({
    employee,
    departments,
    designations,
    employmentTypes,
    supervisors,
    branches,
    auth,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Employees',
            href: employeesIndex().url,
        },
        {
            title: `${employee.first_name} ${employee.last_name}`,
            href: employeesShow(employee.id).url,
        },
        {
            title: 'Edit',
            href: employeesEdit(employee.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${employee.first_name} ${employee.last_name}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title="Edit Employee Profile"
                    description={
                        <>
                            Complete profile information for{' '}
                            <span className="font-bold">
                                {employee.first_name} {employee.last_name}
                            </span>
                        </>
                    }
                    backUrl={employeesIndex().url}
                />

                {/* Employee Edit */}
                <EmployeeEditForm
                    employee={employee}
                    departments={departments}
                    designations={designations}
                    employmentTypes={employmentTypes}
                    supervisors={supervisors}
                    branches={branches}
                    auth={auth}
                    className="rounded-xl border border-sidebar-border/70 p-6"
                />
            </div>
        </AppLayout>
    );
}
