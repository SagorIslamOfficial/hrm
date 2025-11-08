import { PageHeader } from '@/components/common';
import { DesignationEditForm } from '@/components/modules/department';
import AppLayout from '@/layouts/app-layout';
import {
    edit as designationsEdit,
    index as designationsIndex,
} from '@/routes/designations/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Department {
    id: string;
    name: string;
}

interface Designation {
    id: string;
    title: string;
    code: string;
    description?: string;
    department_id?: string;
    is_active: boolean;
}

interface Props {
    designation: Designation;
    departments: Department[];
}

export default function Edit({ designation, departments }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Designations',
            href: designationsIndex().url,
        },
        {
            title: 'Edit Designation',
            href: designationsEdit(designation.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Designation: ${designation.title}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto p-4">
                <PageHeader
                    title="Edit Designation"
                    description={`Update information for ${designation.title}`}
                    backUrl={designationsIndex().url}
                    backLabel="Cancel"
                />

                <DesignationEditForm
                    designation={designation}
                    departments={departments}
                    className="rounded-xl border border-sidebar-border/70 p-6"
                />
            </div>
        </AppLayout>
    );
}
