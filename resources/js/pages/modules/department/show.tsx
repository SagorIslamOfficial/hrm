import { PageHeader } from '@/components/common';
import { DepartmentShow } from '@/components/modules/department';
import { Employee } from '@/components/modules/employee';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import {
    edit as departmentsEdit,
    index as departmentsIndex,
    show as departmentsShow,
} from '@/routes/departments/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';

interface DepartmentNote {
    id: string;
    note: string;
    category: string;
    user?: {
        id?: string;
        name?: string;
        email?: string;
    };
    created_at: string;
    updated_at?: string;
}

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
    manager?: Employee;
    budget?: number;
    location?: string;
    status: string;
    is_active: boolean;
    detail?: DepartmentDetail;
    settings?: DepartmentSettings;
    notes?: DepartmentNote[];
    employees: Employee[];
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

interface Props {
    department: Department;
    stats?: {
        employee_count: number;
        manager_name?: string;
    };
}

export default function Show({ department }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Departments',
            href: departmentsIndex().url,
        },
        {
            title: department.name,
            href: departmentsShow(department.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Department: ${department.name}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title={department.name}
                    description={
                        department.code ? `${department.code}` : 'No code'
                    }
                    backUrl={departmentsIndex().url}
                    actions={
                        <Button size="sm" asChild>
                            <Link href={departmentsEdit(department.id).url}>
                                <Edit className="mr-1 size-4" />
                                Edit
                            </Link>
                        </Button>
                    }
                />

                {/* Department Show */}
                <DepartmentShow
                    department={department}
                    className="rounded-xl border border-sidebar-border/70 p-6"
                />
            </div>
        </AppLayout>
    );
}
