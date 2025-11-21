import { PageHeader } from '@/components/common';
import { BranchShow } from '@/components/modules/branch/BranchShow';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import {
    edit as branchesEdit,
    index as branchesIndex,
    show as branchesShow,
} from '@/routes/branches';
import { type BreadcrumbItem } from '@/types';
import { type Branch } from '@/types/branch';
import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';

interface Props {
    branch: Branch;
    stats?: Record<string, unknown>;
}

export default function Show({ branch, stats }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Branches',
            href: branchesIndex().url,
        },
        {
            title: branch.name,
            href: branchesShow(branch.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Branch: ${branch.name}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title={branch.name}
                    description={branch.code ? `${branch.code}` : 'No code'}
                    backUrl={branchesIndex().url}
                    backLabel="Back"
                    actions={
                        <Button size="sm" asChild>
                            <Link href={branchesEdit(branch.id).url}>
                                <Edit className="mr-1 size-4" />
                                Edit
                            </Link>
                        </Button>
                    }
                />

                {/* Branch Show Tabs */}
                <BranchShow
                    branch={branch}
                    stats={stats}
                    className="rounded-xl border border-sidebar-border/70 p-6"
                />
            </div>
        </AppLayout>
    );
}
