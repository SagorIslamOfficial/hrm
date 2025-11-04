import { StatusBadge } from '@/components/common';
import { TableBlueprint } from '@/components/common/TableBlueprint';
import { Employee } from '@/components/modules/employee';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { show as employeesShow } from '@/routes/employees/index';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Cable, Crown } from 'lucide-react';

interface MembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    employees: Employee[];
    manager?: Employee;
    departmentName: string;
    title?: string;
    hideDesignationColumn?: boolean;
}

export function MembersDrawer({
    isOpen,
    onClose,
    employees,
    manager,
    departmentName,
    title = 'Department Members',
    hideDesignationColumn = false,
}: MembersModalProps) {
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    // Check if manager is already in the employees list
    const managerInEmployees = manager
        ? employees.some((emp) => emp.id === manager.id)
        : false;

    // Create the display list: manager first (if not already in employees), then employees
    const displayEmployees =
        manager && !managerInEmployees
            ? [manager, ...employees]
            : [...employees];

    const sortedEmployees = displayEmployees.sort((a, b) => {
        if (manager && a.id === manager.id) return -1;
        if (manager && b.id === manager.id) return 1;
        return `${a.first_name} ${a.last_name}`.localeCompare(
            `${b.first_name} ${b.last_name}`,
        );
    });

    const designationColumn: ColumnDef<Employee> = {
        accessorKey: 'designation_title',
        header: 'Designation',
        cell: ({ row }) => (
            <div>{row.getValue('designation_title') || 'N/A'}</div>
        ),
    };

    const columns: ColumnDef<Employee>[] = [
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

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">
                                {row.original.first_name}{' '}
                                {row.original.last_name}
                            </span>
                            {manager && row.original.id === manager.id && (
                                <div className="rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700">
                                    <Crown className="mr-1 inline h-3 w-3" />
                                    Manager
                                </div>
                            )}
                            {row.original.department_name &&
                                row.original.department_name !==
                                    departmentName &&
                                departmentName !== 'All Departments' && (
                                    <div className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                                        <Cable className="mr-1 inline h-3 w-3" />
                                        {row.original.department_name}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-sm">
                    <span className="max-w-48 truncate">
                        {row.getValue('email')}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'department_name',
            header: 'Department',
            cell: ({ row }) => (
                <div className="text-sm">
                    {row.getValue('department_name') || 'N/A'}
                </div>
            ),
        },
        ...(hideDesignationColumn ? [] : [designationColumn]),
        {
            accessorKey: 'employment_status',
            header: 'Status',
            cell: ({ row }) => (
                <StatusBadge status={row.getValue('employment_status')} />
            ),
        },
    ];

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="max-h-[90vh] overflow-hidden">
                <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-2">
                        {title} - {departmentName}
                    </DrawerTitle>
                    <DrawerDescription>
                        <span className="text-primary">{employees.length}</span>{' '}
                        team member
                        {employees.length !== 1 ? 's' : ''} in this department
                        {manager && !managerInEmployees && (
                            <>
                                {' - Manager from '}
                                <span className="font-medium text-primary">
                                    {manager.department_name}
                                </span>
                                {' department'}
                            </>
                        )}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="max-h-[70vh] overflow-y-auto">
                    <TableBlueprint
                        columns={columns}
                        data={sortedEmployees}
                        searchPlaceholder="Search employees..."
                        globalSearchKeys={[
                            'employee_code',
                            'first_name',
                            'last_name',
                            'email',
                            'department_name',
                            ...(hideDesignationColumn
                                ? []
                                : ['designation_title' as keyof Employee]),
                        ]}
                    />
                </div>

                <div className="flex justify-end gap-2 border-t p-4">
                    <Button variant="default" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
