import {
    DataTableActions,
    StatusBadge,
    formatDateForDisplay,
} from '@/components/common';
import { titleCase } from '@/components/common/utils/formatUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCurrencySymbol } from '@/config/currency';
import { useCurrency } from '@/hooks/useCurrency';
import { edit as branchesEdit, show as branchesShow } from '@/routes/branches';
import { type Branch } from '@/types/branch';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

interface UseBranchColumnsProps {
    onDeleteClick: (branch: Branch) => void;
}

export function UseBranchColumns({
    onDeleteClick,
}: UseBranchColumnsProps): ColumnDef<Branch>[] {
    const currency = useCurrency();

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const formatBranchType = (type: string) => titleCase(type);

    const handleView = (branch: Branch) => {
        router.visit(branchesShow(branch.id).url);
    };

    const handleEdit = (branch: Branch) => {
        router.visit(branchesEdit(branch.id).url);
    };

    return [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <Link
                    href={branchesShow(row.original.id).url}
                    className="font-medium text-primary hover:text-amber-600"
                >
                    {row.getValue('name')}
                </Link>
            ),
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => <div>{row.getValue('code')}</div>,
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => (
                <div>
                    {row.original.type_label ||
                        formatBranchType(row.getValue('type'))}
                </div>
            ),
        },
        {
            id: 'manager',
            accessorFn: (row) =>
                row.manager
                    ? `${row.manager.first_name} ${row.manager.last_name}`
                    : 'Not assigned',
            header: 'Manager',
            cell: ({ row }) => {
                if (!row.original.manager) {
                    return (
                        <div className="text-muted-foreground">
                            Not assigned
                        </div>
                    );
                }

                const manager = row.original.manager;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={manager.photo_url}
                                alt={`${manager.first_name} ${manager.last_name}`}
                            />
                            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                                {getInitials(
                                    manager.first_name,
                                    manager.last_name,
                                )}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                            {manager.first_name} {manager.last_name}
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'employees',
            accessorFn: (row) => row.employee_count || 0,
            header: 'Employees',
            cell: ({ row }) => <div>{row.original.employee_count || 0}</div>,
        },
        {
            id: 'departments',
            accessorFn: (row) => row.department_count || 0,
            header: 'Departments',
            cell: ({ row }) => <div>{row.original.department_count || 0}</div>,
        },
        {
            accessorKey: 'city',
            header: 'City',
            cell: ({ row }) => <div>{row.getValue('city') || 'N/A'}</div>,
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
