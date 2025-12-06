import {
    arrayToPaginatedData,
    DeleteDialog,
    EmptyActionState,
    PageHeader,
    PaginatedTable,
} from '@/components/common';
import { UseBranchColumns } from '@/components/modules/branch';
import AppLayout from '@/layouts/app-layout';
import {
    create as branchesCreate,
    destroy as branchesDestroy,
    index as branchesIndex,
} from '@/routes/branches';
import { type BreadcrumbItem } from '@/types';
import { type Branch } from '@/types/branch';
import { Head, router } from '@inertiajs/react';
import { FilePlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    branches: Branch[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Branches',
        href: branchesIndex().url,
    },
];

export default function Index({ branches }: Props) {
    const branchesData = branches || [];
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

    const handleDeleteClick = (branch: Branch) => {
        setBranchToDelete(branch);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!branchToDelete) return;

        router.delete(branchesDestroy(branchToDelete.id).url, {
            onSuccess: () => {
                toast.success(
                    `Branch "${branchToDelete.name}" has been deleted successfully.`,
                );
                setDeleteDialogOpen(false);
                setBranchToDelete(null);
            },
            onError: () => {
                toast.error('Failed to delete branch. Please try again.');
            },
        });
    };

    const columns = UseBranchColumns({ onDeleteClick: handleDeleteClick });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Branches" />

            <div className="mx-auto flex h-full w-11/12 flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title="Branches"
                    description="Manage your organization branches"
                    action={{
                        label: 'Add',
                        href: branchesCreate().url,
                        icon: <FilePlus className="mr-1 size-4" />,
                    }}
                />

                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {branchesData.length === 0 ? (
                        <EmptyActionState
                            message="No branches found"
                            buttonText="Add Branch"
                            onButtonClick={() =>
                                router.get(branchesCreate().url)
                            }
                            buttonIcon={<FilePlus className="mr-1 size-4" />}
                        />
                    ) : (
                        <PaginatedTable
                            columns={columns}
                            paginatedData={arrayToPaginatedData(branchesData)}
                            searchPlaceholder="Search branches..."
                            globalSearchKeys={['name', 'code', 'city', 'type']}
                        />
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);
                    if (!open) setBranchToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Branch"
                description={
                    branchToDelete
                        ? `Are you sure you want to delete "${branchToDelete.name}"? This action cannot be undone and may affect related records.`
                        : 'Are you sure you want to delete this branch?'
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </AppLayout>
    );
}
