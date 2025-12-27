import { EmptyActionState, InfoCard } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    Witness,
} from '@/types/complaint';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { SubjectForm } from './SubjectForm';

interface SubjectsEditProps {
    subjects: ComplaintSubject[];
    employees: Employee[];
    departments: Department[];
    branches: Branch[];
    onSubjectsChange: (subjects: ComplaintSubject[]) => void;
    subjectTypes?: { value: string; label: string }[];
}

export default function SubjectsEdit({
    subjects,
    employees,
    departments,
    branches,
    onSubjectsChange,
    subjectTypes = [],
}: SubjectsEditProps) {
    const [openSubjects, setOpenSubjects] = useState<Record<number, boolean>>(
        {},
    );

    // Add subject
    const addSubject = () => {
        const newSubject: ComplaintSubject = {
            id: `temp-${Date.now()}`,
            complaint_id: '',
            subject_id: '',
            subject_type: 'employee', // Default to employee
            subject_name: '',
            relationship_to_complainant: '',
            specific_issue: '',
            desired_outcome: '',
            witnesses: [],
            previous_attempts_to_resolve: false,
            previous_resolution_attempts: '',
            is_primary: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            _isNew: true,
        };

        // Add the new subject
        const newSubjects = [...subjects, newSubject];
        onSubjectsChange(newSubjects);

        // Open the new subject by default
        setOpenSubjects((prev) => ({
            ...prev,
            [newSubjects.length - 1]: true,
        }));
    };

    // Remove subject
    const removeSubject = (index: number) => {
        const newSubjects = subjects.filter((_, i) => i !== index);
        onSubjectsChange(newSubjects);
    };

    // Update local subject
    const updateLocalSubject = (
        index: number,
        field: keyof ComplaintSubject,
        value: string | boolean | Witness[],
    ) => {
        const updated = [...subjects];

        // Handle Type Change - Reset related fields
        if (field === 'subject_type') {
            updated[index] = {
                ...updated[index],
                [field]: value as string,
                subject_id: '', // Reset ID
                subject_name: '', // Reset Name
                _isModified: !updated[index]._isNew,
            };
        }
        // If setting is_primary to true, set all others to false
        else if (field === 'is_primary' && value === true) {
            updated.forEach((subj, i) => {
                if (i === index) {
                    updated[i] = {
                        ...updated[i],
                        [field]: value,
                        _isModified: !subj._isNew,
                    };
                } else if (subj.is_primary) {
                    updated[i] = {
                        ...updated[i],
                        is_primary: false,
                        _isModified: !subj._isNew,
                    };
                }
            });
        } else {
            updated[index] = {
                ...updated[index],
                [field]: value,
                _isModified: !updated[index]._isNew,
            };
        }

        onSubjectsChange(updated);
    };

    // Add witness
    const addWitness = (subjectIndex: number) => {
        const witnesses = subjects[subjectIndex].witnesses || [];
        updateLocalSubject(subjectIndex, 'witnesses', [
            ...witnesses,
            { name: '', contact: '', relationship: '' },
        ]);
    };

    // Remove witness
    const removeWitness = (subjectIndex: number, witnessIndex: number) => {
        const witnesses = subjects[subjectIndex].witnesses || [];
        updateLocalSubject(
            subjectIndex,
            'witnesses',
            witnesses.filter((_, i) => i !== witnessIndex),
        );
    };

    // Update witness
    const updateWitness = (
        subjectIndex: number,
        witnessIndex: number,
        field: keyof Witness,
        value: string,
    ) => {
        const witnesses = [...(subjects[subjectIndex].witnesses || [])];
        witnesses[witnessIndex] = {
            ...witnesses[witnessIndex],
            [field]: value,
        };
        updateLocalSubject(subjectIndex, 'witnesses', witnesses);
    };

    return (
        <>
            <InfoCard
                title="Complaint Subjects"
                description="Who or what is this complaint about? (At least one required)"
                action={
                    <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer border-2 border-blue-700"
                        onClick={addSubject}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subject
                    </Button>
                }
            >
                {subjects.length > 0 ? (
                    <div className="space-y-4">
                        {subjects.map((subject, index) => {
                            const showAccordion = subjects.length > 1;
                            const isOpen = showAccordion
                                ? (openSubjects[index] ?? false)
                                : true;

                            // Get display name based on type
                            let displayName = '';
                            if (
                                subject.subject_type === 'employee' &&
                                subject.subject_id
                            ) {
                                const emp = employees.find(
                                    (e) => e.id === subject.subject_id,
                                );
                                displayName = emp
                                    ? `${emp.first_name} ${emp.last_name}`
                                    : '';
                            } else if (
                                subject.subject_type === 'department' &&
                                subject.subject_id
                            ) {
                                const dept = departments.find(
                                    (d) => d.id === subject.subject_id,
                                );
                                displayName = dept?.name || '';
                            } else if (
                                subject.subject_type === 'branch' &&
                                subject.subject_id
                            ) {
                                const branch = branches.find(
                                    (b) => b.id === subject.subject_id,
                                );
                                displayName = branch?.name || '';
                            } else if (subject.subject_name) {
                                displayName = subject.subject_name;
                            }

                            return (
                                <Card
                                    key={subject.id || `new-${index}`}
                                    className="py-3 shadow-none"
                                >
                                    <Collapsible
                                        open={isOpen}
                                        onOpenChange={(open) =>
                                            setOpenSubjects((prev) => ({
                                                ...prev,
                                                [index]: open,
                                            }))
                                        }
                                    >
                                        <CardContent>
                                            {/* Accordion Header */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {showAccordion && (
                                                        <CollapsibleTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <ChevronDown
                                                                    className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                                                />
                                                                <span className="sr-only">
                                                                    Toggle
                                                                    subject
                                                                </span>
                                                            </Button>
                                                        </CollapsibleTrigger>
                                                    )}

                                                    {/* Subject Name */}
                                                    <h4 className="font-medium">
                                                        Subject {index + 1}
                                                        {displayName && (
                                                            <span className="ml-2 font-normal text-muted-foreground">
                                                                - {displayName}
                                                            </span>
                                                        )}
                                                        {subject.is_primary && (
                                                            <span className="ml-2 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                                                Primary
                                                            </span>
                                                        )}
                                                        {subject._isNew && (
                                                            <span className="ml-2 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs text-green-600">
                                                                New
                                                            </span>
                                                        )}
                                                        {subject._isModified &&
                                                            !subject._isNew && (
                                                                <span className="ml-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">
                                                                    Modified
                                                                </span>
                                                            )}
                                                    </h4>
                                                </div>

                                                {/* Remove Subject Button */}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="cursor-pointer"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeSubject(index)
                                                    }
                                                    disabled={
                                                        subjects.length === 1
                                                    }
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Accordion Content */}
                                            <CollapsibleContent
                                                className={
                                                    showAccordion && !isOpen
                                                        ? 'hidden'
                                                        : 'block'
                                                }
                                            >
                                                <SubjectForm
                                                    subject={subject}
                                                    subjectIndex={index}
                                                    employees={employees}
                                                    departments={departments}
                                                    branches={branches}
                                                    subjectTypes={subjectTypes}
                                                    subjects={subjects}
                                                    openSections={openSubjects}
                                                    onSectionToggle={(
                                                        key,
                                                        open,
                                                    ) =>
                                                        setOpenSubjects(
                                                            (prev) => ({
                                                                ...prev,
                                                                [key]: open,
                                                            }),
                                                        )
                                                    }
                                                    onFieldUpdate={
                                                        updateLocalSubject
                                                    }
                                                    onWitnessAdd={addWitness}
                                                    onWitnessRemove={
                                                        removeWitness
                                                    }
                                                    onWitnessUpdate={(
                                                        subjectIndex,
                                                        witnessIndex,
                                                        field,
                                                        value,
                                                    ) =>
                                                        updateWitness(
                                                            subjectIndex,
                                                            witnessIndex,
                                                            field as keyof Witness,
                                                            value,
                                                        )
                                                    }
                                                />
                                            </CollapsibleContent>
                                        </CardContent>
                                    </Collapsible>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyActionState
                        message="No subjects added yet."
                        buttonText="Add Subject"
                        onButtonClick={addSubject}
                    />
                )}
            </InfoCard>
        </>
    );
}
