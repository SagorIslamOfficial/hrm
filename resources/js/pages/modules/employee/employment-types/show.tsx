import { PageHeader } from '@/components/common';
import EmploymentTypeShow from '@/components/modules/employee/EmploymentTypeShow';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { index as employeesIndex } from '@/routes/employees/index';
import {
    edit as employmentTypesEdit,
    index as employmentTypesIndex,
} from '@/routes/employment-types/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { useMemo } from 'react';

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

export default function Show({ employmentType }: Props) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: 'Employees',
                href: employeesIndex().url,
            },
            {
                title: 'Employment Types',
                href: employmentTypesIndex().url,
            },
            {
                title: employmentType.name,
                href: '', // Current page
            },
        ],
        [employmentType.name],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={employmentType.name} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title={employmentType.name}
                    description="View employment type details"
                    backUrl={employmentTypesIndex().url}
                    backLabel="Back"
                    actions={
                        <Button size="sm" asChild>
                            <Link
                                href={
                                    employmentTypesEdit(employmentType.id).url
                                }
                            >
                                <Edit className="mr-1 size-4" />
                                Edit
                            </Link>
                        </Button>
                    }
                />

                <EmploymentTypeShow employmentType={employmentType} />
            </div>
        </AppLayout>
    );
}
