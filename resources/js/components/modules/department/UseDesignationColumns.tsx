import {
    DataTableActions,
    StatusBadge,
    formatDateForDisplay,
} from '@/components/common';
import {
    edit as designationsEdit,
    show as designationsShow,
} from '@/routes/designations/index';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

export interface Designation {
    id: string;
    title: string;
    code: string;
    description?: string;
    department_id?: string;
    department?: {
        id: string;
        name: string;
    };
    is_active: boolean;
    employee_count?: number;
    employees_count?: number;
    employees?: Array<{ id: string; first_name: string; last_name: string }>;
    deleted_at?: string | null;
    created_at?: string;
}

interface UseDesignationColumnsProps {
    onDeleteClick: (designation: Designation) => void;
}

export function UseDesignationColumns({
    onDeleteClick,
}: UseDesignationColumnsProps): ColumnDef<Designation>[] {
    const handleView = (designation: Designation) => {
        router.visit(designationsShow(designation.id).url);
    };

    const handleEdit = (designation: Designation) => {
        router.visit(designationsEdit(designation.id).url);
    };

    return [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <Link
                    href={designationsShow(row.original.id).url}
                    className="font-medium text-foreground hover:text-primary"
                >
                    {row.original.title}
                </Link>
            ),
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => (
                <span className="font-mono text-sm">{row.original.code}</span>
            ),
        },
        {
            accessorKey: 'department.name',
            header: 'Department',
            cell: ({ row }) => (
                <span className="text-muted-foreground">
                    {row.original.department?.name || 'N/A'}
                </span>
            ),
        },
        {
            accessorKey: 'employee_count',
            header: 'Employees',
            cell: ({ row }) => (
                <span className="text-center">
                    {row.original.employees_count ||
                        row.original.employee_count ||
                        0}
                </span>
            ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <StatusBadge
                    status={row.original.is_active ? 'active' : 'inactive'}
                />
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: ({ row }) => (
                <span className="text-muted-foreground">
                    {row.original.created_at
                        ? formatDateForDisplay(row.original.created_at)
                        : 'N/A'}
                </span>
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
