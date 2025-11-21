import { FormActions, FormField } from '@/components/common';
import { useState } from 'react';
import { toast } from 'sonner';

interface Department {
    id: string;
    name: string;
    code?: string;
    is_active?: boolean;
    manager_id?: string | null;
    manager?: {
        id: string;
        first_name?: string;
        last_name?: string;
    } | null;
}

interface BranchDepartmentForm {
    department_id: string;
    budget_allocation: number | null;
    is_primary: boolean;
}

interface BranchDepartmentFormProps {
    assignment?: {
        department_id: string;
        budget_allocation: number | null;
        is_primary: boolean;
        department?: Department;
    };
    onSuccess: (assignmentData: BranchDepartmentForm) => void;
    onCancel: () => void;
    availableDepartments: Department[];
}

export function BranchDepartmentForm({
    assignment,
    onSuccess,
    onCancel,
    availableDepartments,
}: BranchDepartmentFormProps) {
    const [formData, setFormData] = useState<BranchDepartmentForm>({
        department_id: assignment?.department_id || '',
        budget_allocation: assignment?.budget_allocation || null,
        is_primary: assignment?.is_primary || false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async () => {
        setSubmitting(true);
        setErrors({});

        try {
            // Basic validation
            const validationErrors: Record<string, string> = {};
            if (!formData.department_id.trim()) {
                validationErrors.department_id = 'Department is required';
            }

            if (
                formData.budget_allocation !== null &&
                formData.budget_allocation < 0
            ) {
                validationErrors.budget_allocation =
                    'Budget allocation must be a positive number';
            }

            if (
                formData.budget_allocation !== null &&
                formData.budget_allocation > 999999999.99
            ) {
                validationErrors.budget_allocation =
                    'Budget allocation cannot exceed 999,999,999.99';
            }

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            toast.success(
                assignment
                    ? 'Department assignment changes staged - save branch to apply'
                    : 'Department assignment staged - save branch to apply',
            );

            onSuccess(formData);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const isEdit = !!assignment;

    return (
        <div className="space-y-4">
            {!isEdit && (
                <FormField
                    type="select"
                    id="department_id"
                    label="Department"
                    value={formData.department_id}
                    onChange={(value: string) =>
                        setFormData({ ...formData, department_id: value })
                    }
                    placeholder="Select a department..."
                    options={availableDepartments.map((dept) => ({
                        value: dept.id,
                        label: `${dept.name}${dept.code ? ` (${dept.code})` : ''}`,
                    }))}
                    error={errors.department_id}
                    required
                />
            )}

            {isEdit && assignment?.department && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <div className="rounded-md border bg-muted px-3 py-2 text-sm">
                        {assignment.department.name}
                        {assignment.department.code &&
                            ` (${assignment.department.code})`}
                    </div>
                </div>
            )}

            <FormField
                type="number"
                id="budget_allocation"
                label="Budget Allocation"
                value={
                    formData.budget_allocation
                        ? String(formData.budget_allocation)
                        : ''
                }
                onChange={(value: string | number) =>
                    setFormData({
                        ...formData,
                        budget_allocation: value ? Number(value) : null,
                    })
                }
                placeholder="Enter budget amount"
                min={0}
                max={999999999.99}
                step={0.01}
                error={errors.budget_allocation}
            />

            <FormField
                type="checkbox"
                id="is_primary"
                label="Primary Department"
                value={formData.is_primary}
                onChange={(checked: boolean) =>
                    setFormData({ ...formData, is_primary: checked })
                }
            />

            <FormActions
                type="dialog"
                onCancel={onCancel}
                onSubmit={handleSubmit}
                submitLabel={isEdit ? 'Update' : 'Add'}
                submitting={submitting}
            />
        </div>
    );
}
