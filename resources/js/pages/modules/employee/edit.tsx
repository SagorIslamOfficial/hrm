import EmployeeEditForm from '@/components/modules/employee/EmployeeEditForm';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import {
    edit as employeesEdit,
    index as employeesIndex,
    show as employeesShow,
} from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

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
        document_type: string;
        document_name: string;
        file_path: string;
        uploaded_at: string;
    }>;
    notes?: Array<{
        id: string;
        title: string;
        content: string;
        created_at: string;
    }>;
    customFields?: Array<{
        id: string;
        field_name: string;
        field_value: string;
        field_type: string;
    }>;
}

interface Props {
    employee: Employee;
    departments: Array<{ id: string; name: string }>;
    designations: Array<{ id: string; title: string }>;
    employmentTypes: Array<{ code: string; name: string }>;
    supervisors: Array<{ id: string; name: string; employee_code: string }>;
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Edit Employee Profile
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Complete profile information for{' '}
                                <span className="font-bold">
                                    {employee.first_name} {employee.last_name}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" asChild>
                            <Link href={employeesIndex().url}>
                                <ArrowLeft className="mr-1 size-4" />
                                Back
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* EmployeeEditForm component */}
                <EmployeeEditForm
                    employee={employee}
                    departments={departments}
                    designations={designations}
                    employmentTypes={employmentTypes}
                    supervisors={supervisors}
                    auth={auth}
                    className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
                />
            </div>
        </AppLayout>
    );
}
