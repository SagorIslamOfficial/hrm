import {
    DeleteDialog,
    EmptyActionState,
    PageHeader,
} from '@/components/common';
import { TableBlueprint } from '@/components/common/TableBlueprint';
import {
    UseDesignationColumns,
    type Designation,
} from '@/components/modules/department';
import AppLayout from '@/layouts/app-layout';
import {
    create as designationsCreate,
    destroy as designationsDestroy,
    index as designationsIndex,
} from '@/routes/designations/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FilePlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    designations: Designation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Designations',
        href: designationsIndex().url,
    },
];

export default function Index({ designations = [] }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [designationToDelete, setDesignationToDelete] =
        useState<Designation | null>(null);

    const handleDeleteClick = (designation: Designation) => {
        setDesignationToDelete(designation);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!designationToDelete) return;

        router.delete(designationsDestroy(designationToDelete.id).url, {
            onSuccess: () => {
                toast.success(
                    `Designation "${designationToDelete.title}" has been deleted successfully.`,
                );
                setDeleteDialogOpen(false);
                setDesignationToDelete(null);
            },
            onError: () => {
                toast.error('Failed to delete designation. Please try again.');
            },
        });
    };

    const columns = UseDesignationColumns({ onDeleteClick: handleDeleteClick });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Designations" />

            <div className="mx-auto flex h-full w-11/12 flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title="Designations"
                    description="Manage your designations"
                    action={{
                        label: 'Add',
                        href: designationsCreate().url,
                        icon: <FilePlus className="mr-1 size-4" />,
                    }}
                />

                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {designations.length === 0 ? (
                        <EmptyActionState
                            message="No designations found"
                            buttonText="Add Designation"
                            onButtonClick={() =>
                                router.get(designationsCreate().url)
                            }
                            buttonIcon={<FilePlus className="mr-1 size-4" />}
                        />
                    ) : (
                        <TableBlueprint
                            columns={columns}
                            data={designations}
                            searchPlaceholder="Search designations..."
                            globalSearchKeys={['title', 'code']}
                        />
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);
                    if (!open) setDesignationToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Designation"
                description={
                    designationToDelete
                        ? `Are you sure you want to delete "${designationToDelete.title}"? This action cannot be undone and may affect related records.`
                        : 'Are you sure you want to delete this designation?'
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </AppLayout>
    );
}
