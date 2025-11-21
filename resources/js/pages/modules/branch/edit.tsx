import { PageHeader } from '@/components/common';
import { BranchEditForm } from '@/components/modules/branch';
import AppLayout from '@/layouts/app-layout';
import {
    edit as branchesEdit,
    index as branchesIndex,
} from '@/routes/branches';
import { type BreadcrumbItem, type User } from '@/types';
import {
    type Branch,
    type BranchOption,
    type BranchType,
    type Department,
    type Employee,
} from '@/types/branch';
import { Head } from '@inertiajs/react';

interface Props {
    branch: Branch;
    employees: Employee[];
    branches: BranchOption[];
    departments: Department[];
    branchTypes: BranchType[];
    currentUser?: User;
}

export default function Edit({
    branch,
    employees,
    branches,
    departments,
    branchTypes,
    currentUser,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Branches',
            href: branchesIndex().url,
        },
        {
            title: 'Edit Branch',
            href: branchesEdit(branch.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Branch: ${branch.name}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto p-4">
                <PageHeader
                    title="Edit Branch"
                    description={`Update information for ${branch.name}`}
                    backUrl={branchesIndex().url}
                    backLabel="Cancel"
                />

                <BranchEditForm
                    branch={branch}
                    employees={employees}
                    branches={branches}
                    departments={departments}
                    branchTypes={branchTypes}
                    currentUser={currentUser}
                    className="rounded-xl border border-sidebar-border/70 p-6"
                />
            </div>
        </AppLayout>
    );
}
