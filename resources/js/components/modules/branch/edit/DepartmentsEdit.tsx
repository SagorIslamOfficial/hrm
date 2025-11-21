import {
    DataTableActions,
    DeleteDialog,
    InfoCard,
    ResourceDialog,
    StatusBadge,
} from '@/components/common';
import { BranchDepartmentForm } from '@/components/common/BranchDepartmentForm';
import { EmptyActionState } from '@/components/common/EmptyActionState';
import { TableBlueprint } from '@/components/common/TableBlueprint';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/config/currency';
import { useCurrency } from '@/hooks/useCurrency';
import { show as departmentsShow } from '@/routes/departments/index';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Department } from '../index';

interface Props {
    departments: Department[];
    availableDepartments: Department[];
    onDepartmentsChange?: (departments: Department[]) => void;
}

export function DepartmentsEdit({
    departments = [],
    availableDepartments = [],
    onDepartmentsChange,
}: Props) {
    // Local state for staged departments
    const [stagedDepartments, setStagedDepartments] =
        useState<Department[]>(departments);

    const currency = useCurrency();

    // Update local state when props change
    useEffect(() => {
        setStagedDepartments(departments);
    }, [departments]);
    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(
        null,
    );

    const activeDepartments = stagedDepartments.filter(
        (department) => !department._isDeleted,
    );

    const assignedDepartmentIds = new Set(activeDepartments.map((d) => d.id));

    const filteredAvailableDepartments = availableDepartments.filter(
        (dept) => !assignedDepartmentIds.has(dept.id),
    );

    const openEditDialog = (department: Department) => {
        setEditDialogOpen(department.id);
    };

    const handleDelete = (departmentId: string) => {
        // Stage the change locally
        const updatedDepartments = stagedDepartments.map((dept) =>
            dept.id === departmentId ? { ...dept, _isDeleted: true } : dept,
        );
        setStagedDepartments(updatedDepartments);
        onDepartmentsChange?.(updatedDepartments);

        // Show success message
        toast.success(
            'Department marked for removal. Changes will be saved when you update the branch.',
        );

        setDeleteDialogOpen(null);
    };

    const columns: ColumnDef<Department>[] = [
        {
            accessorKey: 'name',
            header: 'Department Name',
            cell: ({ row }) => {
                const department = row.original;

                return (
                    <div className="p-2">
                        <Link
                            href={departmentsShow(row.original.id).url}
                            className="font-medium text-primary hover:text-amber-600"
                        >
                            {row.getValue('name')}
                        </Link>
                        <div className="mt-1 flex gap-1">
                            {department._isNew && (
                                <span className="inline-flex items-center rounded bg-green-100 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                    New
                                </span>
                            )}
                            {department._isModified && (
                                <span className="inline-flex items-center rounded bg-yellow-100 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                    Modified
                                </span>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {row.getValue('code') || 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <StatusBadge
                    status={row.getValue('is_active') ? 'active' : 'inactive'}
                />
            ),
        },
        {
            accessorKey: 'employee_count',
            header: 'Employees',
            cell: ({ row }) => (
                <div className="text-sm text-gray-700">
                    {row.getValue('employee_count') ?? 0}
                </div>
            ),
        },
        {
            accessorKey: 'manager',
            header: 'Manager',
            cell: ({ row }) => (
                <div className="text-sm text-gray-700">
                    {row.original.manager
                        ? `${row.original.manager.first_name || ''} ${row.original.manager.last_name || ''}`.trim()
                        : '—'}
                </div>
            ),
        },
        {
            accessorKey: 'budget_allocation',
            header: 'Budget',
            cell: ({ row }) => (
                <div className="text-sm text-gray-700">
                    {formatCurrency(
                        Number(row.original.pivot?.budget_allocation ?? 0),
                        currency,
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'is_primary',
            header: 'Primary',
            cell: ({ row }) => (
                <div className="text-sm text-gray-700">
                    {row.original.pivot?.is_primary ? 'Yes' : 'No'}
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const department = row.original;

                return (
                    <DataTableActions
                        item={department}
                        onEdit={() => openEditDialog(department)}
                        onDelete={() => setDeleteDialogOpen(department.id)}
                        showView={false}
                        editLabel="Edit"
                        deleteLabel="Remove"
                    />
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <InfoCard
                title="Assigned Departments"
                action={
                    <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer border-2 border-blue-700"
                        onClick={() => setIsAddDialogOpen(true)}
                    >
                        Add Department
                    </Button>
                }
            >
                {activeDepartments.length > 0 ? (
                    <TableBlueprint
                        columns={columns}
                        data={activeDepartments}
                        searchPlaceholder="Search departments..."
                        globalSearchKeys={['name', 'code', 'is_active']}
                        className="px-0"
                        getRowProps={() => {
                            return {};
                        }}
                    />
                ) : (
                    <EmptyActionState
                        message="Add department details to track more information."
                        buttonText="Add Department Details"
                    />
                )}

                {/* Summary */}
                {activeDepartments.length > 0 && (
                    <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                            {activeDepartments.length} department
                            {activeDepartments.length !== 1 ? 's' : ''} assigned
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            {availableDepartments.length -
                                activeDepartments.length}{' '}
                            more available
                        </p>
                    </div>
                )}
            </InfoCard>

            {/* Add Department Dialog */}
            <ResourceDialog
                mode="add"
                open={isAddDialogOpen}
                resourceLabel="Department"
                subjectLabel="branch"
            >
                <BranchDepartmentForm
                    onSuccess={(assignmentData) => {
                        // Stage the change locally
                        const selectedDept = availableDepartments.find(
                            (dept) => dept.id === assignmentData.department_id,
                        );
                        if (selectedDept) {
                            const newDepartment: Department = {
                                ...selectedDept,
                                pivot: {
                                    budget_allocation:
                                        assignmentData.budget_allocation ??
                                        undefined,
                                    is_primary: assignmentData.is_primary,
                                },
                                _isNew: true,
                            };
                            const updatedDepartments = [
                                ...stagedDepartments,
                                newDepartment,
                            ];
                            setStagedDepartments(updatedDepartments);
                            onDepartmentsChange?.(updatedDepartments);
                        }

                        setIsAddDialogOpen(false);
                    }}
                    onCancel={() => setIsAddDialogOpen(false)}
                    availableDepartments={filteredAvailableDepartments}
                />
            </ResourceDialog>

            {/* Edit Department Dialog */}
            <ResourceDialog
                mode="edit"
                open={!!editDialogOpen}
                resourceLabel="Department"
                subjectLabel="branch"
            >
                <BranchDepartmentForm
                    assignment={
                        editDialogOpen
                            ? {
                                  department_id: editDialogOpen,
                                  budget_allocation:
                                      stagedDepartments.find(
                                          (d) => d.id === editDialogOpen,
                                      )?.pivot?.budget_allocation ?? null,
                                  is_primary:
                                      stagedDepartments.find(
                                          (d) => d.id === editDialogOpen,
                                      )?.pivot?.is_primary || false,
                                  department: stagedDepartments.find(
                                      (d) => d.id === editDialogOpen,
                                  ),
                              }
                            : undefined
                    }
                    onSuccess={(assignmentData) => {
                        // Stage the change locally
                        const updatedDepartments = stagedDepartments.map(
                            (dept) =>
                                dept.id === editDialogOpen
                                    ? {
                                          ...dept,
                                          pivot: {
                                              budget_allocation:
                                                  assignmentData.budget_allocation ??
                                                  undefined,
                                              is_primary:
                                                  assignmentData.is_primary,
                                          },
                                          _isModified: true,
                                      }
                                    : dept,
                        );
                        setStagedDepartments(updatedDepartments);
                        onDepartmentsChange?.(updatedDepartments);

                        setEditDialogOpen(null);
                    }}
                    onCancel={() => setEditDialogOpen(null)}
                    availableDepartments={availableDepartments}
                />
            </ResourceDialog>

            {/* Delete Department Dialog */}
            <DeleteDialog
                open={!!deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) setDeleteDialogOpen(null);
                }}
                onConfirm={() => {
                    if (deleteDialogOpen) {
                        handleDelete(deleteDialogOpen);
                    }
                }}
                title="Remove Department"
                description="Are you sure you want to remove this department from the branch? This action cannot be undone."
                confirmLabel="Remove Department"
            />
        </div>
    );
}
