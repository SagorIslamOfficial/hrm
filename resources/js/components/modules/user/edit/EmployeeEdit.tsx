import { DeleteDialog, FormField, InfoCard } from '@/components/common';
import { type UnlinkedEmployee } from '@/components/modules/user';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface EmployeeEditProps {
    data: {
        name: string;
        email: string;
        employee_id: string;
    };
    errors: Record<string, string>;
    employees: UnlinkedEmployee[];
    onDataChange: (field: string, value: string) => void;
}

export function EmployeeEdit({
    data,
    errors,
    employees,
    onDataChange,
}: EmployeeEditProps) {
    const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);

    const employeeOptions = employees.map((emp) => ({
        value: emp.id,
        label: `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
    }));

    const selectedEmployee =
        data.employee_id &&
        employees.find((emp) => emp.id === data.employee_id);
    const selectedEmployeeName = selectedEmployee
        ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
        : null;

    const handleEmployeeChange = (value: string) => {
        const actualValue = value === 'none' ? '' : value;
        onDataChange('employee_id', actualValue);

        // Auto-populate name, email, and status from selected employee
        if (actualValue) {
            const selected = employees.find((emp) => emp.id === actualValue);
            if (selected) {
                const employeeName = `${selected.first_name} ${selected.last_name}`;
                const status = selected.employment_status || 'active';
                onDataChange('name', employeeName);
                onDataChange('email', selected.email);
                onDataChange('status', status);
                toast.info(
                    `Auto-populated from employee: ${employeeName} (${selected.email}) (${status})`,
                );
            }
        }
    };

    const handleUnlinkConfirm = () => {
        onDataChange('employee_id', '');
        toast.success('Employee link removed');
    };

    return (
        <>
            <InfoCard title="Link to Employee">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                            Link or change the employee record associated with
                            this user
                        </p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    className="max-w-xs"
                                >
                                    When you select an employee, the employee
                                    name and email address will automatically
                                    replace the current name and email address.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <FormField
                            id="employee_id"
                            label="Employee"
                            type="combobox"
                            className="col-span-3"
                            value={data.employee_id || 'none'}
                            onChange={handleEmployeeChange}
                            error={errors.employee_id}
                            options={[
                                {
                                    value: 'none',
                                    label: 'No employee link',
                                },
                                ...employeeOptions,
                            ]}
                        />

                        {selectedEmployee && (
                            <Button
                                type="button"
                                variant="destructive"
                                className="col-span-1 mt-6 cursor-pointer"
                                onClick={() => setUnlinkDialogOpen(true)}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Unlink
                            </Button>
                        )}
                    </div>
                </div>
            </InfoCard>

            <DeleteDialog
                open={unlinkDialogOpen}
                onOpenChange={setUnlinkDialogOpen}
                onConfirm={handleUnlinkConfirm}
                title="Unlink Employee"
                description={
                    selectedEmployeeName
                        ? `Are you sure you want to unlink "${selectedEmployeeName}" from this user account? The user name and email will remain as they are.`
                        : 'Are you sure you want to unlink this employee?'
                }
                confirmLabel="Unlink"
                cancelLabel="Cancel"
            />
        </>
    );
}
