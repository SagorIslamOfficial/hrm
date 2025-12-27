import { PageHeader } from '@/components/common';
import { ComplaintEditForm } from '@/components/modules/complaint';
import AppLayout from '@/layouts/app-layout';
import {
    edit as complaintsEdit,
    index as complaintsIndex,
} from '@/routes/complaints';
import { type BreadcrumbItem } from '@/types';
import type {
    Branch,
    Complaint,
    Department,
    Employee,    PriorityOption,} from '@/types/complaint';
import { Head } from '@inertiajs/react';

interface Props {
    complaint: Complaint;
    employees: Employee[];
    departments: Department[];
    branches: Branch[];
    predefinedCategories: string[];
    priorities: PriorityOption[];
    assignees: { value: string; label: string }[];
    subjectTypes: { value: string; label: string }[];
    commentTypes: { value: string; label: string }[];
    reminderTypes: { value: string; label: string }[];
}

export default function Edit({
    complaint,
    employees,
    departments,
    branches,
    predefinedCategories,
    priorities,
    assignees,
    subjectTypes,
    commentTypes,
    reminderTypes,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Complaints',
            href: complaintsIndex().url,
        },
        {
            title: 'Edit Complaint',
            href: complaintsEdit(complaint.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${complaint.complaint_number}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto p-4">
                <PageHeader
                    title="Edit Complaint"
                    description={`Update information for ${complaint.complaint_number}`}
                    backUrl={complaintsIndex().url}
                    backLabel="Cancel"
                />

                <ComplaintEditForm
                    complaint={complaint}
                    employees={employees}
                    departments={departments}
                    branches={branches}
                    predefinedCategories={predefinedCategories}
                    priorities={priorities}
                    assignees={assignees}
                    subjectTypes={subjectTypes}
                    commentTypes={commentTypes}
                    reminderTypes={reminderTypes}
                    className="rounded-xl border border-sidebar-border/70 p-6"
                />
            </div>
        </AppLayout>
    );
}
