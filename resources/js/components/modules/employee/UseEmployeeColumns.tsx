import { DataTableActions, StatusBadge } from '@/components/common';
import {
    edit as employeesEdit,
    show as employeesShow,
} from '@/routes/employees/index';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import type { Employee } from './index';

interface UseEmployeeColumnsProps {
    onDeleteClick: (employee: Employee) => void;
}

export function UseEmployeeColumns({
    onDeleteClick,
}: UseEmployeeColumnsProps): ColumnDef<Employee>[] {
    const handleView = (employee: Employee) => {
        router.visit(employeesShow(employee.id).url);
    };

    const handleEdit = (employee: Employee) => {
        router.visit(employeesEdit(employee.id).url);
    };
    return [
        {
            accessorKey: 'employee_code',
            header: 'Employee Code',
            cell: ({ row }) => (
                <Link
                    href={employeesShow(row.original.id).url}
                    className="font-medium text-primary hover:text-amber-600"
                >
                    {row.getValue('employee_code')}
                </Link>
            ),
        },
        {
            id: 'name',
            accessorFn: (row) => `${row.first_name} ${row.last_name}`,
            header: 'Name',
            cell: ({ row }) => (
                <div>
                    {row.original.first_name} {row.original.last_name}
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => <div>{row.getValue('email')}</div>,
        },
        {
            accessorKey: 'department_name',
            header: 'Department',
            cell: ({ row }) => (
                <div>{row.getValue('department_name') || 'N/A'}</div>
            ),
        },
        {
            accessorKey: 'designation_title',
            header: 'Designation',
            cell: ({ row }) => (
                <div>{row.getValue('designation_title') || 'N/A'}</div>
            ),
        },
        {
            accessorKey: 'employment_status',
            header: 'Status',
            cell: ({ row }) => (
                <StatusBadge status={row.getValue('employment_status')} />
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <DataTableActions
                    item={row.original}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={onDeleteClick}
                />
            ),
        },
    ];
}
