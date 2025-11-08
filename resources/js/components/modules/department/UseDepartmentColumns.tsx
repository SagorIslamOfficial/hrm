import {
    DataTableActions,
    StatusBadge,
    formatDateForDisplay,
} from '@/components/common';
import { getCurrencySymbol } from '@/config/currency';
import { useCurrency } from '@/hooks/useCurrency';
import {
    edit as departmentsEdit,
    show as departmentsShow,
} from '@/routes/departments/index';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

export interface Department {
    id: string;
    name: string;
    code?: string;
    description?: string;
    manager?: {
        id: string;
        first_name: string;
        last_name: string;
    };
    budget?: number;
    location?: string;
    status: string;
    is_active: boolean;
    employee_count?: number;
    employees?: Array<{ id: string; first_name: string; last_name: string }>;
    deleted_at?: string | null;
    created_at?: string;
}

interface UseDepartmentColumnsProps {
    onDeleteClick: (department: Department) => void;
}

export function UseDepartmentColumns({
    onDeleteClick,
}: UseDepartmentColumnsProps): ColumnDef<Department>[] {
    const currency = useCurrency();

    const handleView = (department: Department) => {
        router.visit(departmentsShow(department.id).url);
    };

    const handleEdit = (department: Department) => {
        router.visit(departmentsEdit(department.id).url);
    };

    return [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <Link
                    href={departmentsShow(row.original.id).url}
                    className="font-medium text-primary hover:text-amber-600"
                >
                    {row.getValue('name')}
                </Link>
            ),
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => <div>{row.getValue('code') || 'N/A'}</div>,
        },
        {
            id: 'manager',
            accessorFn: (row) =>
                row.manager
                    ? `${row.manager.first_name} ${row.manager.last_name}`
                    : 'Not assigned',
            header: 'Manager',
            cell: ({ row }) => <div>{row.getValue('manager')}</div>,
        },
        {
            id: 'employees',
            accessorFn: (row) => row.employees?.length || 0,
            header: 'Employees',
            cell: ({ row }) => <div>{row.getValue('employees')}</div>,
        },
        {
            accessorKey: 'budget',
            header: 'Budget',
            cell: ({ row }) => {
                const budget = row.getValue('budget') as number;
                return (
                    <div>
                        {budget
                            ? `${getCurrencySymbol(currency)}${budget.toLocaleString()}`
                            : `${getCurrencySymbol(currency)}0`}
                    </div>
                );
            },
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }) => <div>{row.getValue('location') || 'N/A'}</div>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: ({ row }) => (
                <div>
                    {formatDateForDisplay(row.getValue('created_at') as string)}
                </div>
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
