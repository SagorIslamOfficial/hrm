import { DataTableActions, StatusBadge } from '@/components/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    edit as employeesEdit,
    show as employeesShow,
} from '@/routes/employees/index';
import { show as usersShow } from '@/routes/users/index';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { UserCheck, UserX } from 'lucide-react';
import type { Employee } from './index';

interface UseEmployeeColumnsProps {
    onDeleteClick: (employee: Employee) => void;
}

export function UseEmployeeColumns({
    onDeleteClick,
}: UseEmployeeColumnsProps): ColumnDef<Employee>[] {
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

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
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={row.original.photo_url}
                            alt={`${row.original.first_name} ${row.original.last_name}`}
                        />
                        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                            {getInitials(
                                row.original.first_name,
                                row.original.last_name,
                            )}
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                        {row.original.first_name} {row.original.last_name}
                    </span>
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
            id: 'user',
            accessorFn: (row) => (row.user ? row.user.name : ''),
            header: 'User Account',
            cell: ({ row }) => {
                const user = row.original.user;
                if (!user) {
                    return (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <UserX className="h-4 w-4" />
                            <span className="text-sm">No account</span>
                        </div>
                    );
                }
                return (
                    <Link
                        href={usersShow(user.id).url}
                        className="flex items-center gap-1.5 text-green-600 hover:text-green-700"
                    >
                        <UserCheck className="h-4 w-4" />
                        <span className="text-sm">{user.name}</span>
                    </Link>
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
