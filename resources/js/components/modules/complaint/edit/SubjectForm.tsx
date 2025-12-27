import { FormField } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type {
    Branch,
    ComplaintSubject,
    Department,
    Employee,
} from '@/types/complaint';
import { ChevronDown } from 'lucide-react';
import { WitnessManager } from './WitnessManager';

interface SubjectFormProps {
    subject: ComplaintSubject;
    subjectIndex: number;
    employees: Employee[];
    departments: Department[];
    branches: Branch[];
    subjectTypes?: { value: string; label: string }[];
    subjects: ComplaintSubject[];
    openSections: Record<number | string, boolean>;
    onSectionToggle: (key: number | string, open: boolean) => void;
    onFieldUpdate: (
        index: number,
        field: keyof ComplaintSubject,
        value: string | boolean,
    ) => void;
    onWitnessAdd: (index: number) => void;
    onWitnessRemove: (subjectIndex: number, witnessIndex: number) => void;
    onWitnessUpdate: (
        subjectIndex: number,
        witnessIndex: number,
        field: string,
        value: string,
    ) => void;
}

export function SubjectForm({
    subject,
    subjectIndex,
    employees,
    departments,
    branches,
    subjectTypes = [],
    subjects,
    openSections,
    onSectionToggle,
    onFieldUpdate,
    onWitnessAdd,
    onWitnessRemove,
    onWitnessUpdate,
}: SubjectFormProps) {
    const detailsKey = subjectIndex * 1000;
    const isDetailsOpen = openSections[detailsKey] ?? true;

    return (
        <div className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-3">
                <FormField
                    type="select"
                    id={`subject_${subjectIndex}_type`}
                    label="Subject Type"
                    value={subject.subject_type || 'employee'}
                    onChange={(value) =>
                        onFieldUpdate(subjectIndex, 'subject_type', value)
                    }
                    options={[...subjectTypes]}
                    required
                />

                {subject.subject_type === 'employee' ? (
                    <FormField
                        type="combobox"
                        id={`subject_${subject.id}_person`}
                        key={`person_${subject.id}`}
                        label="Employee"
                        value={subject.subject_id || ''}
                        onChange={(value: string) =>
                            onFieldUpdate(subjectIndex, 'subject_id', value)
                        }
                        required
                        options={employees
                            .filter(
                                (emp) =>
                                    !subjects.some(
                                        (s, i) =>
                                            i !== subjectIndex &&
                                            s.subject_id === emp.id,
                                    ),
                            )
                            .map((emp) => ({
                                value: emp.id,
                                label: `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
                            }))}
                        searchPlaceholder="Search employees..."
                        emptyText="No employees found."
                    />
                ) : subject.subject_type === 'department' ? (
                    <FormField
                        type="combobox"
                        id={`subject_${subject.id}_department`}
                        key={`department_${subject.id}`}
                        label="Department"
                        value={subject.subject_id || ''}
                        onChange={(value: string) =>
                            onFieldUpdate(subjectIndex, 'subject_id', value)
                        }
                        required
                        options={departments
                            .filter(
                                (dept) =>
                                    !subjects.some(
                                        (s, i) =>
                                            i !== subjectIndex &&
                                            s.subject_type === 'department' &&
                                            s.subject_id === dept.id,
                                    ),
                            )
                            .map((dept) => ({
                                value: dept.id,
                                label: `${dept.name}${dept.code ? ` (${dept.code})` : ''}`,
                            }))}
                        searchPlaceholder="Search departments..."
                        emptyText="No departments found."
                    />
                ) : subject.subject_type === 'branch' ? (
                    <FormField
                        type="combobox"
                        id={`subject_${subject.id}_branch`}
                        key={`branch_${subject.id}`}
                        label="Branch"
                        value={subject.subject_id || ''}
                        onChange={(value: string) =>
                            onFieldUpdate(subjectIndex, 'subject_id', value)
                        }
                        required
                        options={branches
                            .filter(
                                (br) =>
                                    !subjects.some(
                                        (s, i) =>
                                            i !== subjectIndex &&
                                            s.subject_type === 'branch' &&
                                            s.subject_id === br.id,
                                    ),
                            )
                            .map((br) => ({
                                value: br.id,
                                label: `${br.name}${br.code ? ` (${br.code})` : ''}`,
                            }))}
                        searchPlaceholder="Search branches..."
                        emptyText="No branches found."
                    />
                ) : (
                    <FormField
                        type="text"
                        id={`subject_${subjectIndex}_name`}
                        label="Subject Name"
                        value={subject.subject_name || ''}
                        onChange={(value: string) =>
                            onFieldUpdate(subjectIndex, 'subject_name', value)
                        }
                        placeholder={`e.g., Name of the ${subject.subject_type}`}
                        required
                    />
                )}

                <FormField
                    type="text"
                    id={`subject_${subjectIndex}_relationship`}
                    label="Relationship"
                    required
                    value={subject.relationship_to_complainant || ''}
                    onChange={(value: string) =>
                        onFieldUpdate(
                            subjectIndex,
                            'relationship_to_complainant',
                            value,
                        )
                    }
                    placeholder="e.g., Manager, Colleague"
                />
            </div>

            <div className="flex items-center">
                <FormField
                    type="checkbox"
                    id={`subject_${subjectIndex}_is_primary`}
                    label="Primary Subject"
                    value={subject.is_primary || false}
                    onChange={(value: boolean) =>
                        onFieldUpdate(subjectIndex, 'is_primary', value)
                    }
                    helperText="Is this the main subject this complaint is about?"
                />
            </div>

            <FormField
                type="textarea"
                id={`subject_${subjectIndex}_issue`}
                label="Specific Issue"
                value={subject.specific_issue || ''}
                required
                onChange={(value: string) =>
                    onFieldUpdate(subjectIndex, 'specific_issue', value)
                }
                placeholder="What specific issue involves this subject?"
                rows={2}
            />

            {/* Additional Details Section */}
            <Collapsible
                open={isDetailsOpen}
                onOpenChange={(open) => onSectionToggle(detailsKey, open)}
            >
                <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                    >
                        <span>Additional Details</span>
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`}
                        />
                    </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-4 pt-4">
                    <FormField
                        type="textarea"
                        id={`subject_${subjectIndex}_desired_outcome`}
                        label="Desired Outcome"
                        value={subject.desired_outcome || ''}
                        onChange={(value: string) =>
                            onFieldUpdate(
                                subjectIndex,
                                'desired_outcome',
                                value,
                            )
                        }
                        placeholder="What resolution are you seeking?"
                        rows={2}
                    />

                    {/* Witnesses */}
                    <WitnessManager
                        witnesses={subject.witnesses || []}
                        employees={employees}
                        subjectType={subject.subject_type || 'other'}
                        subjectEmployeeId={subject.subject_id || ''}
                        onAdd={() => onWitnessAdd(subjectIndex)}
                        onRemove={(idx) => onWitnessRemove(subjectIndex, idx)}
                        onUpdate={(idx, field, value) =>
                            onWitnessUpdate(subjectIndex, idx, field, value)
                        }
                        subjectIndex={subjectIndex}
                    />

                    <FormField
                        type="checkbox"
                        id={`subject_${subjectIndex}_previous_attempts`}
                        label="Previous attempts made to resolve this issue"
                        value={!!subject.previous_attempts_to_resolve}
                        onChange={(value: boolean) =>
                            onFieldUpdate(
                                subjectIndex,
                                'previous_attempts_to_resolve',
                                value,
                            )
                        }
                    />

                    {subject.previous_attempts_to_resolve && (
                        <FormField
                            type="textarea"
                            id={`subject_${subjectIndex}_previous_resolution_attempts`}
                            label="Previous Resolution Attempts"
                            value={subject.previous_resolution_attempts || ''}
                            onChange={(value: string) =>
                                onFieldUpdate(
                                    subjectIndex,
                                    'previous_resolution_attempts',
                                    value,
                                )
                            }
                            placeholder="Describe previous resolution attempts..."
                            rows={2}
                        />
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
