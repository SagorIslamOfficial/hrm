import { PageHeader } from '@/components/common';
import { EmployeeShow } from '@/components/modules/employee';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import {
    edit as employeesEdit,
    index as employeesIndex,
    show as employeesShow,
} from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';

interface Employee {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    photo: string | null;
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
    personal_detail?: {
        date_of_birth: string;
        gender: string;
        marital_status: string;
        blood_group: string;
        national_id: string;
        passport_number: string | null;
        address: string;
        city: string;
        country: string;
    };
    job_detail?: {
        job_title: string;
        supervisor_id: string;
        work_shift: string;
        probation_end_date: string | null;
        contract_end_date: string | null;
    };
    salary_detail?: {
        basic_salary: number;
        allowances: number;
        deductions: number;
        net_salary: number;
        bank_name: string;
        bank_account_number: string;
        bank_branch: string;
        tax_id: string;
    };
    contacts?: Array<{
        id: string;
        contact_name: string;
        relationship: string;
        phone: string;
        email: string | null;
        address: string;
        photo?: string;
        photo_url?: string;
        is_primary: boolean;
    }>;
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
        creator?: {
            name: string;
        };
        updated_at?: string;
        updater?: {
            name?: string;
        };
    }>;
    attendance?: Array<{
        id: string;
        date: string;
        check_in: string | null;
        check_out: string | null;
        status: string;
        remarks: string | null;
    }>;
    leaves?: Array<{
        id: string;
        leave_type: string;
        start_date: string;
        end_date: string;
        total_days: number;
        status: string;
        reason: string;
    }>;
    custom_fields?: Array<{
        id: string;
        field_key: string;
        field_value: string;
        field_type: string;
        section: string;
    }>;
}

interface Props {
    employee: Employee;
    supervisors: Array<{ id: string; name: string; employee_code: string }>;
    auth?: {
        user?: {
            id?: number;
            name?: string;
            roles?: Array<{ name: string }>;
            is_super_admin?: boolean;
        };
    };
}

export default function Show({ employee, supervisors, auth }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Employees',
            href: employeesIndex().url,
        },
        {
            title: `${employee.first_name} ${employee.last_name}`,
            href: employeesShow(employee.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${employee.first_name} ${employee.last_name}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title={`${employee.first_name} ${employee.last_name}`}
                    description={`${employee.employee_code} - ${employee.designation.title} - ${employee.department.name}`}
                    backUrl={employeesIndex().url}
                    backLabel="Back"
                    actions={
                        <Button size="sm" asChild>
                            <Link href={employeesEdit(employee.id).url}>
                                <Edit className="mr-1 size-4" />
                                Edit
                            </Link>
                        </Button>
                    }
                />

                {/* Employee Show */}
                <EmployeeShow
                    employee={employee}
                    supervisors={supervisors}
                    auth={auth}
                    className="rounded-xl border border-sidebar-border/70 p-6"
                />
            </div>
        </AppLayout>
    );
}
