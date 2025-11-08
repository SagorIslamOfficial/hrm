import { FormActions, TabsNavigation } from '@/components/common';
import type { Note } from '@/components/common/interfaces';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useUrlTab } from '@/hooks';
import {
    show as departmentsShow,
    update as departmentsUpdate,
} from '@/routes/departments/index';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { BasicEdit, DetailsEdit, NotesEdit, SettingsEdit } from './edit';

interface DepartmentDetail {
    founded_date?: string;
    division?: string;
    cost_center?: string;
    internal_code?: string;
    office_phone?: string;
}

interface DepartmentSettings {
    overtime_allowed?: boolean;
    travel_allowed?: boolean;
    home_office_allowed?: boolean;
    meeting_room_count?: number;
    desk_count?: number;
    requires_approval?: boolean;
    approval_level?: string;
}

interface Department {
    id: string;
    name: string;
    code?: string;
    description?: string;
    location?: string;
    budget?: number;
    status: string;
    is_active: boolean;
    manager_id?: string;
    detail?: DepartmentDetail;
    settings?: DepartmentSettings;
    notes?: Note[];
}

interface Employee {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface CurrentUser {
    id: string;
    name?: string;
}

interface Props {
    department: Department;
    employees: Employee[];
    currentUser?: CurrentUser;
    className?: string;
}

const departmentTabs = [
    { value: 'basic', label: 'Basic Info' },
    { value: 'details', label: 'Details' },
    { value: 'settings', label: 'Settings' },
    { value: 'notes', label: 'Notes' },
];

export function DepartmentEditForm({
    department,
    employees,
    currentUser,
    className,
}: Props) {
    const [activeTab, handleTabChange] = useUrlTab('basic');
    const [notes, setNotes] = useState<Note[]>(department.notes || []);

    const { data, setData, processing, errors } = useForm({
        // Basic
        name: department.name,
        code: department.code || '',
        description: department.description || '',
        manager_id: department.manager_id || '',
        location: department.location || '',
        budget: department.budget ? department.budget.toString() : '',
        status: department.status,
        // Details
        founded_date: department.detail?.founded_date || '',
        division: department.detail?.division || '',
        cost_center: department.detail?.cost_center || '',
        internal_code: department.detail?.internal_code || '',
        office_phone: department.detail?.office_phone || '',
        // Settings
        overtime_allowed: department.settings?.overtime_allowed || false,
        travel_allowed: department.settings?.travel_allowed || false,
        home_office_allowed: department.settings?.home_office_allowed || false,
        meeting_room_count:
            department.settings?.meeting_room_count?.toString() || '',
        desk_count: department.settings?.desk_count?.toString() || '',
        requires_approval: department.settings?.requires_approval || false,
        approval_level: department.settings?.approval_level || '',
        // Notes
        notes: department.notes || [],
    });

    const handleNoteAdd = (noteData: Note) => {
        const newNote = {
            ...noteData,
            _isNew: true,
            _isModified: false,
            _isDeleted: false,
        };
        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        setData('notes', updatedNotes);
    };

    const handleNoteEdit = (noteData: Note) => {
        const updatedNotes = notes.map((note) =>
            note.id === noteData.id ? { ...noteData, _isModified: true } : note,
        );
        setNotes(updatedNotes);
        setData('notes', updatedNotes);
    };

    const handleNoteDelete = (noteId: string) => {
        const updatedNotes = notes.map((note) =>
            note.id === noteId ? { ...note, _isDeleted: true } : note,
        );
        setNotes(updatedNotes);
        setData('notes', updatedNotes);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Transform flat data to nested structure for backend
        const payload = {
            // Basic department fields
            name: data.name,
            code: data.code,
            description: data.description,
            manager_id: data.manager_id,
            location: data.location,
            budget: data.budget,
            status: data.status,
            // Nested detail object
            detail: {
                founded_date: data.founded_date,
                division: data.division,
                cost_center: data.cost_center,
                internal_code: data.internal_code,
                office_phone: data.office_phone,
            },
            // Nested settings object
            settings: {
                overtime_allowed: data.overtime_allowed,
                travel_allowed: data.travel_allowed,
                home_office_allowed: data.home_office_allowed,
                meeting_room_count: data.meeting_room_count,
                desk_count: data.desk_count,
                requires_approval: data.requires_approval,
                approval_level: data.approval_level,
            },
            // Notes array
            notes: data.notes,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.put(departmentsUpdate(department.id).url, payload as any, {
            onSuccess: () => {
                toast.success('Department updated successfully');
                router.visit(departmentsShow(department.id).url);
            },
            onError: () => {
                toast.error('Failed to update department');
            },
        });
    };

    const handleReset = () => {
        // Reset form to initial state
        const resetData = {
            name: department.name,
            code: department.code || '',
            description: department.description || '',
            manager_id: department.manager_id || '',
            location: department.location || '',
            budget: department.budget ? department.budget.toString() : '',
            status: department.status,
            founded_date: department.detail?.founded_date || '',
            division: department.detail?.division || '',
            cost_center: department.detail?.cost_center || '',
            internal_code: department.detail?.internal_code || '',
            office_phone: department.detail?.office_phone || '',
            overtime_allowed: department.settings?.overtime_allowed || false,
            travel_allowed: department.settings?.travel_allowed || false,
            home_office_allowed:
                department.settings?.home_office_allowed || false,
            meeting_room_count:
                department.settings?.meeting_room_count?.toString() || '',
            desk_count: department.settings?.desk_count?.toString() || '',
            requires_approval: department.settings?.requires_approval || false,
            approval_level: department.settings?.approval_level || '',
            notes: department.notes || [],
        };
        setData(resetData);
        setNotes(department.notes || []);
        toast.info('Form reset to original values');
    };

    // Check if form has any changes
    const hasChanges =
        data.name !== department.name ||
        data.code !== (department.code || '') ||
        data.description !== (department.description || '') ||
        data.manager_id !== (department.manager_id || '') ||
        data.location !== (department.location || '') ||
        data.budget !==
            (department.budget ? department.budget.toString() : '') ||
        data.status !== department.status ||
        data.founded_date !== (department.detail?.founded_date || '') ||
        data.division !== (department.detail?.division || '') ||
        data.cost_center !== (department.detail?.cost_center || '') ||
        data.internal_code !== (department.detail?.internal_code || '') ||
        data.office_phone !== (department.detail?.office_phone || '') ||
        data.overtime_allowed !==
            (department.settings?.overtime_allowed || false) ||
        data.travel_allowed !==
            (department.settings?.travel_allowed || false) ||
        data.home_office_allowed !==
            (department.settings?.home_office_allowed || false) ||
        data.meeting_room_count !==
            (department.settings?.meeting_room_count?.toString() || '') ||
        data.desk_count !==
            (department.settings?.desk_count?.toString() || '') ||
        data.requires_approval !==
            (department.settings?.requires_approval || false) ||
        data.approval_level !== (department.settings?.approval_level || '') ||
        JSON.stringify(notes) !== JSON.stringify(department.notes || []);

    return (
        <form
            onSubmit={handleSubmit}
            className={`space-y-6 ${className || ''}`}
        >
            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="space-y-6"
            >
                <TabsNavigation tabs={departmentTabs} />

                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <TabsContent value="basic" className="mt-0">
                        <BasicEdit
                            data={{
                                name: data.name,
                                code: data.code,
                                description: data.description,
                                location: data.location,
                                budget: data.budget
                                    ? parseFloat(data.budget)
                                    : undefined,
                                status: data.status,
                                manager_id: data.manager_id,
                            }}
                            errors={errors as Record<string, string>}
                            setData={(key, value) => {
                                if (key === 'budget') {
                                    setData('budget', String(value));
                                } else {
                                    setData(
                                        key as keyof typeof data,
                                        value as string,
                                    );
                                }
                            }}
                            employees={employees}
                        />
                    </TabsContent>

                    <TabsContent value="details" className="mt-0">
                        <DetailsEdit
                            data={{
                                founded_date: data.founded_date,
                                division: data.division,
                                cost_center: data.cost_center,
                                internal_code: data.internal_code,
                                office_phone: data.office_phone,
                            }}
                            errors={errors as Record<string, string>}
                            setData={(key, value) =>
                                setData(
                                    key as keyof typeof data,
                                    (value || '') as string,
                                )
                            }
                        />
                    </TabsContent>

                    <TabsContent value="settings" className="mt-0">
                        <SettingsEdit
                            data={{
                                overtime_allowed: data.overtime_allowed,
                                travel_allowed: data.travel_allowed,
                                home_office_allowed: data.home_office_allowed,
                                meeting_room_count: data.meeting_room_count
                                    ? parseInt(data.meeting_room_count)
                                    : undefined,
                                desk_count: data.desk_count
                                    ? parseInt(data.desk_count)
                                    : undefined,
                                requires_approval: data.requires_approval,
                                approval_level: data.approval_level,
                            }}
                            errors={errors as Record<string, string>}
                            setData={(key, value) => {
                                if (
                                    key === 'meeting_room_count' ||
                                    key === 'desk_count'
                                ) {
                                    setData(key, String(value));
                                } else {
                                    setData(
                                        key as keyof typeof data,
                                        value as boolean | string,
                                    );
                                }
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="notes" className="mt-0">
                        <NotesEdit
                            notes={notes}
                            onNoteAdd={handleNoteAdd}
                            onNoteEdit={handleNoteEdit}
                            onNoteDelete={handleNoteDelete}
                            currentUser={currentUser}
                        />
                    </TabsContent>
                </div>
            </Tabs>

            <FormActions
                onReset={handleReset}
                submitLabel="Update"
                processing={processing}
                disabled={!hasChanges}
            />
        </form>
    );
}
