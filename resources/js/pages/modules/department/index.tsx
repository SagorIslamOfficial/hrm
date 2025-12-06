import {
    arrayToPaginatedData,
    DeleteDialog,
    EmptyActionState,
    PageHeader,
    PaginatedTable,
} from '@/components/common';
import {
    UseDepartmentColumns,
    type Department,
} from '@/components/modules/department';
import AppLayout from '@/layouts/app-layout';
import {
    create as departmentsCreate,
    destroy as departmentsDestroy,
    index as departmentsIndex,
} from '@/routes/departments/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FilePlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    departments: Department[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: departmentsIndex().url,
    },
];

export default function Index({ departments = [] }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] =
        useState<Department | null>(null);

    const handleDeleteClick = (department: Department) => {
        setDepartmentToDelete(department);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!departmentToDelete) return;

        router.delete(departmentsDestroy(departmentToDelete.id).url, {
            onSuccess: () => {
                toast.success(
                    `Department "${departmentToDelete.name}" has been deleted successfully.`,
                );
                setDeleteDialogOpen(false);
                setDepartmentToDelete(null);
            },
            onError: () => {
                toast.error('Failed to delete department. Please try again.');
            },
        });
    };

    const columns = UseDepartmentColumns({ onDeleteClick: handleDeleteClick });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />

            <div className="mx-auto flex h-full w-11/12 flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title="Departments"
                    description="Manage your departments"
                    action={{
                        label: 'Add',
                        href: departmentsCreate().url,
                        icon: <FilePlus className="mr-1 size-4" />,
                    }}
                />

                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {departments.length === 0 ? (
                        <EmptyActionState
                            message="No departments found"
                            buttonText="Add Department"
                            onButtonClick={() =>
                                router.get(departmentsCreate().url)
                            }
                            buttonIcon={<FilePlus className="mr-1 size-4" />}
                        />
                    ) : (
                        <PaginatedTable
                            columns={columns}
                            paginatedData={arrayToPaginatedData(departments)}
                            searchPlaceholder="Search departments..."
                            globalSearchKeys={['name', 'code', 'location']}
                        />
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);
                    if (!open) setDepartmentToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Department"
                description={
                    departmentToDelete
                        ? `Are you sure you want to delete "${departmentToDelete.name}"? This action cannot be undone and may affect related records.`
                        : 'Are you sure you want to delete this department?'
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </AppLayout>
    );
}
