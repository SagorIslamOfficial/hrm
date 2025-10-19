import { PageHeader } from '@/components/common';
import { create as employeesCreate } from '@/routes/employees/index';
import { FilePlus } from 'lucide-react';

interface EmployeePageHeaderProps {
    title?: string;
    description?: string;
}

export function EmployeePageHeader({
    title = 'Employees',
    description = 'Manage your employee records',
}: EmployeePageHeaderProps) {
    return (
        <PageHeader
            title={title}
            description={description}
            action={{
                label: 'Add Employee',
                href: employeesCreate().url,
                icon: <FilePlus className="mr-1 size-4" />,
            }}
        />
    );
}
