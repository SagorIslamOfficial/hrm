import {
    DataTableActions,
    StatusBadge,
    formatDateForDisplay,
} from '@/components/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/config/currency';
import { useCurrency } from '@/hooks/useCurrency';
import { show as branchShow } from '@/routes/branches';
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
        photo?: string;
        photo_url?: string;
    };
    budget?: number;
    location?: string;
    status: string;
    is_active: boolean;
    employee_count?: number;
    employees?: Array<{ id: string; first_name: string; last_name: string }>;
    settings?: {
        id?: string;
        branch_id?: string;
        branch?: {
            id: string;
            name: string;
            code?: string;
        };
    };
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

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

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
                            ? formatCurrency(budget, currency)
                            : formatCurrency(0, currency)}
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
            id: 'branch',
            accessorFn: (row) => row.settings?.branch?.name || 'Not assigned',
            header: 'Branch',
            cell: ({ row }) => {
                const branch = row.original.settings?.branch;
                if (!branch || !row.original.settings?.branch_id) {
                    return (
                        <div className="text-muted-foreground">
                            Not assigned
                        </div>
                    );
                }
                return (
                    <Link
                        href={branchShow(branch.id).url}
                        className="font-medium text-primary hover:text-amber-600"
                    >
                        {branch.name}
                    </Link>
                );
            },
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
