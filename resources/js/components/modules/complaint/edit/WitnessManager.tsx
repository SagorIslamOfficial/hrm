import { FormField } from '@/components/common';
import { Button } from '@/components/ui/button';
import type { Employee, Witness } from '@/types/complaint';
import { Plus, Trash2 } from 'lucide-react';

interface WitnessManagerProps {
    witnesses: Witness[];
    employees: Employee[];
    subjectType: string;
    subjectEmployeeId: string;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUpdate: (index: number, field: keyof Witness, value: string) => void;
    subjectIndex: number;
}

export function WitnessManager({
    witnesses,
    employees,
    subjectType,
    subjectEmployeeId,
    onAdd,
    onRemove,
    onUpdate,
    subjectIndex,
}: WitnessManagerProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Witnesses</label>
                <Button
                    type="button"
                    variant="secondary"
                    className="cursor-pointer"
                    size="sm"
                    onClick={onAdd}
                >
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                </Button>
            </div>

            {witnesses?.map((witness, wIndex) => {
                const selectedEmployee = employees.find(
                    (e) => e.id === witness.name,
                );

                return (
                    <div key={wIndex} className="rounded-md border p-3">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                Witness {wIndex + 1}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemove(wIndex)}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-4">
                            <FormField
                                type="combobox"
                                id={`subject_${subjectIndex}_witness_${wIndex}_name`}
                                label="Witness Name"
                                value={witness.name}
                                onChange={(value: string) =>
                                    onUpdate(wIndex, 'name', value)
                                }
                                options={employees
                                    .filter(
                                        (emp) =>
                                            // Exclude the subject person if they are an employee
                                            (subjectType === 'employee'
                                                ? emp.id !== subjectEmployeeId
                                                : true) &&
                                            // Exclude already selected witnesses (except current one)
                                            !witnesses.some(
                                                (w, wi) =>
                                                    wi !== wIndex &&
                                                    w.name === emp.id,
                                            ),
                                    )
                                    .map((emp) => ({
                                        value: emp.id,
                                        label: `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
                                    }))}
                                searchPlaceholder="Search witnesses..."
                                emptyText="No employees found."
                            />
                            <FormField
                                type="text"
                                id={`subject_${subjectIndex}_witness_${wIndex}_email`}
                                label="Email (Auto)"
                                value={selectedEmployee?.email || ''}
                                onChange={() => {}}
                                disabled
                                placeholder="Auto-populated"
                            />
                            <FormField
                                type="text"
                                id={`subject_${subjectIndex}_witness_${wIndex}_phone`}
                                label="Phone (Auto)"
                                value={selectedEmployee?.phone || ''}
                                onChange={() => {}}
                                disabled
                                placeholder="Auto-populated"
                            />
                            <FormField
                                type="text"
                                id={`subject_${subjectIndex}_witness_${wIndex}_relationship`}
                                label="Relationship"
                                value={witness.relationship || ''}
                                onChange={(value: string) =>
                                    onUpdate(wIndex, 'relationship', value)
                                }
                                placeholder="Relationship"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
