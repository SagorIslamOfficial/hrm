import {
    DeleteDialog,
    EmptyActionState,
    PageHeader,
} from '@/components/common';
import { TableBlueprint } from '@/components/common/TableBlueprint';
import { UseEmploymentTypeColumns } from '@/components/modules/employee';
import AppLayout from '@/layouts/app-layout';
import {
    create as employmentTypesCreate,
    destroy as employmentTypesDestroy,
    index as employmentTypesIndex,
} from '@/routes/employment-types/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FilePlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface EmploymentType {
    id: string;
    name: string;
    code: string;
    description?: string;
    is_active: boolean;
    created_at: string;
}

interface Props {
    employmentTypes: EmploymentType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: '/dashboard/employees',
    },
    {
        title: 'Employment Types',
        href: employmentTypesIndex().url,
    },
];

export default function Index({ employmentTypes = [] }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employmentTypeToDelete, setEmploymentTypeToDelete] =
        useState<EmploymentType | null>(null);

    const handleDeleteClick = (employmentType: EmploymentType) => {
        setEmploymentTypeToDelete(employmentType);
        setDeleteDialogOpen(true);
    };

    const columns = UseEmploymentTypeColumns({
        onDeleteClick: handleDeleteClick,
    });

    const handleDeleteConfirm = () => {
        if (!employmentTypeToDelete) return;

        router.delete(employmentTypesDestroy(employmentTypeToDelete.id).url, {
            onSuccess: () => {
                toast.success(
                    `Employment type "${employmentTypeToDelete.name}" has been deleted successfully.`,
                );
                setDeleteDialogOpen(false);
                setEmploymentTypeToDelete(null);
            },
            onError: () => {
                toast.error(
                    'Failed to delete employment type. Please try again.',
                );
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employment Types" />

            <div className="mx-auto flex h-full w-11/12 flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title="Employment Types"
                    description="Manage your employment type records"
                    action={{
                        label: 'Add',
                        href: employmentTypesCreate().url,
                        icon: <FilePlus className="mr-1 size-4" />,
                    }}
                />

                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {employmentTypes.length === 0 ? (
                        <EmptyActionState
                            message="No employment types found"
                            buttonText="Add Employment Type"
                            onButtonClick={() =>
                                router.get(employmentTypesCreate().url)
                            }
                            buttonIcon={<FilePlus className="mr-1 size-4" />}
                        />
                    ) : (
                        <TableBlueprint
                            columns={columns}
                            data={employmentTypes}
                            searchPlaceholder="Search employment types..."
                            globalSearchKeys={['name', 'code', 'description']}
                        />
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);
                    if (!open) setEmploymentTypeToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Employment Type"
                description={
                    employmentTypeToDelete
                        ? `Are you sure you want to delete "${employmentTypeToDelete.name}"? This action cannot be undone and may affect existing employees.`
                        : 'Are you sure you want to delete this item?'
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </AppLayout>
    );
}
