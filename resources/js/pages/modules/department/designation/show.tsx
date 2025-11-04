import { PageHeader } from '@/components/common';
import { DesignationShow } from '@/components/modules/department/DesignationShow';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { index as departmentsIndex } from '@/routes/departments/index';
import {
    edit as designationsEdit,
    index as designationsIndex,
} from '@/routes/designations/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { useMemo } from 'react';

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
    }>;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

interface Props {
    designation: Designation;
    stats?: {
        employee_count: number;
        department_name?: string;
    };
}

export default function Show({ designation }: Props) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: 'Departments',
                href: departmentsIndex().url,
            },
            {
                title: 'Designations',
                href: designationsIndex().url,
            },
            {
                title: designation.title,
                href: '', // Current page
            },
        ],
        [designation.title],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={designation.title} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title={designation.title}
                    description="View designation details"
                    backUrl={designationsIndex().url}
                    backLabel="Back"
                    actions={
                        <Button size="sm" asChild>
                            <Link href={designationsEdit(designation.id).url}>
                                <Edit className="mr-1 size-4" />
                                Edit
                            </Link>
                        </Button>
                    }
                />

                <DesignationShow designation={designation} />
            </div>
        </AppLayout>
    );
}
