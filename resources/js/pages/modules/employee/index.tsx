import {
    DeleteDialog,
    EmptyActionState,
    PageHeader,
} from '@/components/common';
import { TableBlueprint } from '@/components/common/TableBlueprint';
import {
    UseEmployeeColumns,
    type Employee,
} from '@/components/modules/employee';
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
                        <EmptyActionState
                            message="No employees found"
                            buttonText="Add Employee"
                            onButtonClick={() =>
                                router.get(employeesCreate().url)
                            }
                            buttonIcon={<FilePlus className="mr-1 size-4" />}
                        />
                    ) : (
                        <TableBlueprint
                            columns={columns}
                            data={employees}
                            searchPlaceholder="Search employees..."
                            globalSearchKeys={[
                                'first_name',
                                'last_name',
                                'email',
                                'employee_code',
                            ]}
                        />
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);
                    if (!open) setEmployeeToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Employee"
                description={
                    employeeToDelete
                        ? `Are you sure you want to delete "${employeeToDelete.first_name} ${employeeToDelete.last_name}"? This action cannot be undone and may affect related records.`
                        : 'Are you sure you want to delete this item?'
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </AppLayout>
    );
}
