import { DataTableActions } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import {
    edit as employmentTypesEdit,
    show as employmentTypesShow,
} from '@/routes/employment-types/index';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

interface EmploymentType {
    id: string;
    name: string;
    code: string;
    description?: string;
    is_active: boolean;
    employees_count?: number;
    created_at: string;
}

interface UseEmploymentTypeColumnsProps {
    onDeleteClick: (employmentType: EmploymentType) => void;
}

export function UseEmploymentTypeColumns({
    onDeleteClick,
}: UseEmploymentTypeColumnsProps): ColumnDef<EmploymentType>[] {
    const handleView = (employmentType: EmploymentType) => {
        router.visit(employmentTypesShow(employmentType.id).url);
    };

    const handleEdit = (employmentType: EmploymentType) => {
        router.visit(employmentTypesEdit(employmentType.id).url);
    };

    return [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <Link
                    href={employmentTypesShow(row.original.id).url}
                    className="font-medium text-primary hover:text-amber-600"
                >
                    {row.getValue('name')}
                </Link>
            ),
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => (
                <code className="rounded bg-muted px-1 py-0.5 text-sm">
                    {row.getValue('code')}
                </code>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => (
                <div className="max-w-xs truncate">
                    {row.getValue('description') || 'No description'}
                </div>
            ),
        },
        {
            accessorKey: 'employees_count',
            header: 'Employees',
            cell: ({ row }) => (
                <span className="text-center">
                    {row.original.employees_count || 0}
                </span>
            ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.getValue('is_active') as boolean;
                return (
                    <Badge variant={isActive ? 'default' : 'secondary'}>
                        {isActive ? 'Active' : 'InActive'}
                    </Badge>
                );
            },
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
