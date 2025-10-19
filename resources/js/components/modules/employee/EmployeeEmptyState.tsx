import { EmptyState } from '@/components/common';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { create as employeesCreate } from '@/routes/employees/index';
import { FilePlus } from 'lucide-react';

interface EmployeeEmptyStateProps {
    title?: string;
    description?: string;
}

export function EmployeeEmptyState({
    title = 'No employees found',
    description = "You haven't added any employees yet. Add one to get started.",
}: EmployeeEmptyStateProps) {
    return (
        <EmptyState
            icon={
                <PlaceholderPattern className="size-12 stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            }
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
