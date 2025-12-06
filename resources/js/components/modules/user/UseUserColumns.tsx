import { DataTableActions, StatusBadge } from '@/components/common';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    sendWelcomeEmail,
    edit as usersEdit,
    show as usersShow,
} from '@/routes/users/index';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { LinkIcon, SendToBack } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from './index';

interface UseUserColumnsProps {
    onDeleteClick: (user: User) => void;
}

export function UseUserColumns({
    onDeleteClick,
}: UseUserColumnsProps): ColumnDef<User>[] {
    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const handleView = (user: User) => {
        router.visit(usersShow(user.id).url);
    };

    const handleEdit = (user: User) => {
        router.visit(usersEdit(user.id).url);
    };

    return [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                            {getInitials(row.original.name)}
                        </AvatarFallback>
                    </Avatar>
                    <Link
                        href={usersShow(row.original.id).url}
                        className="font-medium text-primary hover:text-amber-600"
                    >
                        {row.getValue('name')}
                    </Link>
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => <div>{row.getValue('email')}</div>,
        },
        {
            id: 'roles',
            accessorFn: (row) => row.roles.map((r) => r.name).join(', '),
            header: 'Roles',
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.roles.map((role) => (
                        <Badge
                            key={role.id}
                            variant="secondary"
                            className="text-xs"
                        >
                            {role.name}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            id: 'status',
            accessorFn: (row) => row.status,
            header: 'Status',
            cell: ({ row }) => (
                <StatusBadge status={row.getValue('status') as string} />
            ),
        },
        {
            id: 'employee',
            accessorFn: (row) =>
                row.employee
                    ? `${row.employee.first_name} ${row.employee.last_name}`
                    : '',
            header: 'Linked Employee',
            cell: ({ row }) => {
                const employee = row.original.employee;
                if (!employee) {
                    return (
                        <span className="text-sm text-muted-foreground">
                            Not linked
                        </span>
                    );
                }
                return (
                    <div className="flex items-center gap-2">
                        <LinkIcon className="h-3 w-3 text-green-600" />
                        <span className="text-sm">
                            {employee.first_name} {employee.last_name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                            {employee.employee_code}
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: 'send_email',
            header: 'Send Email',
            cell: ({ row }) => {
                const user = row.original;
                const handleSendWelcomeEmail = () => {
                    router.post(
                        sendWelcomeEmail(user.id).url,
                        {},
                        {
                            onSuccess: () => {
                                toast.success(
                                    `Welcome email sent to ${user.email}!`,
                                );
                            },
                            onError: () => {
                                toast.error(
                                    'Failed to send welcome email. Please try again.',
                                );
                            },
                        },
                    );
                };

                return (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSendWelcomeEmail}
                        className="cursor-pointer"
                        title="Send welcome email with credentials"
                    >
                        <SendToBack className="h-3.5 w-3.5" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(row.getValue('created_at')).toLocaleDateString()}
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
