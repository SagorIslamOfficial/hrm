import { PageHeader } from '@/components/common';
import type { Note } from '@/components/common/interfaces';
import { DepartmentEditForm } from '@/components/modules/department';
import AppLayout from '@/layouts/app-layout';
import {
    edit as departmentsEdit,
    index as departmentsIndex,
} from '@/routes/departments/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface DepartmentDetail {
    founded_date?: string;
    division?: string;
    cost_center?: string;
    internal_code?: string;
    office_phone?: string;
}

interface DepartmentSettings {
    overtime_allowed?: boolean;
    travel_allowed?: boolean;
    home_office_allowed?: boolean;
    meeting_room_count?: number;
    desk_count?: number;
    requires_approval?: boolean;
    approval_level?: string;
}

interface Department {
    id: string;
    name: string;
    code?: string;
    description?: string;
    location?: string;
    budget?: number;
    status: string;
    is_active: boolean;
    manager_id?: string;
    detail?: DepartmentDetail;
    settings?: DepartmentSettings;
    notes?: Note[];
}

interface Employee {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface CurrentUser {
    id: string;
    name?: string;
}

interface Props {
    department: Department;
    employees: Employee[];
    currentUser?: CurrentUser;
}

export default function Edit({ department, employees, currentUser }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Departments',
            href: departmentsIndex().url,
        },
        {
            title: 'Edit Department',
            href: departmentsEdit(department.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Department: ${department.name}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto p-4">
                <PageHeader
                    title="Edit Department"
                    description={`Update information for ${department.name}`}
                    backUrl={departmentsIndex().url}
                    backLabel="Cancel"
                />

                <DepartmentEditForm
                    department={department}
                    employees={employees}
                    currentUser={currentUser}
                    className="rounded-xl border border-sidebar-border/70 p-6"
                />
            </div>
        </AppLayout>
    );
}
