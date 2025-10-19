import { DeleteDialog } from '@/components/common';
import type { Employee } from './index';

interface EmployeeDeleteDialogProps {
    open: boolean;
    employee: Employee | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function EmployeeDeleteDialog({
    open,
    employee,
    onOpenChange,
    onConfirm,
}: EmployeeDeleteDialogProps) {
    const description = employee
        ? `Are you sure you want to delete ${employee.first_name} ${employee.last_name}? This action cannot be undone and will permanently remove the employee record.`
        : 'Are you sure you want to delete this employee? This action cannot be undone.';

    return (
        <DeleteDialog
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={onConfirm}
            title="Delete Employee"
            description={description}
        />
    );
}
