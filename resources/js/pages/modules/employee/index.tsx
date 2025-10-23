import { PageHeader } from '@/components/common';
import {
    EmployeeDeleteDialog,
    EmployeeEmptyState,
    UseEmployeeColumns,
    type Employee,
} from '@/components/modules/employee';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import {
    create as employeesCreate,
    destroy as employeesDestroy,
    index as employeesIndex,
} from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FilePlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    employees: Employee[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: employeesIndex().url,
    },
];

export default function Index({ employees = [] }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
        null,
    );

    const handleDeleteClick = (employee: Employee) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!employeeToDelete) return;

        router.delete(employeesDestroy(employeeToDelete.id).url, {
            onSuccess: () => {
                toast.success(
                    `Employee ${employeeToDelete.first_name} ${employeeToDelete.last_name} has been deleted successfully.`,
                );
                setDeleteDialogOpen(false);
                setEmployeeToDelete(null);
            },
            onError: () => {
                toast.error('Failed to delete employee. Please try again.');
            },
        });
    };

    const columns = UseEmployeeColumns({ onDeleteClick: handleDeleteClick });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />

            <div className="mx-auto flex h-full w-11/12 flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title="Employees"
                    description="Manage your employee records"
                    action={{
                        label: 'Add',
                        href: employeesCreate().url,
                        icon: <FilePlus className="mr-1 size-4" />,
                    }}
                />

                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {employees.length === 0 ? (
                        <EmployeeEmptyState />
                    ) : (
                        <DataTable
                            columns={columns}
                            data={employees}
                            searchPlaceholder="Search employees..."
                        />
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <EmployeeDeleteDialog
                open={deleteDialogOpen}
                employee={employeeToDelete}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);
                    if (!open) setEmployeeToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
            />
        </AppLayout>
    );
}
