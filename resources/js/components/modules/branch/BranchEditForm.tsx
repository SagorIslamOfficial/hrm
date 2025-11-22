import { FormActions, TabsNavigation } from '@/components/common';
import type { Note } from '@/components/common/interfaces';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useUrlTab } from '@/hooks';
import * as CustomFieldsApi from '@/lib/branch/customFields';
import * as DepartmentsApi from '@/lib/branch/departments';
import * as DocumentsApi from '@/lib/branch/documents';
import * as NotesApi from '@/lib/branch/notes';
import processAndReport from '@/lib/branch/processAndReport';
import { update as branchesUpdate } from '@/routes/branches';
import { type User } from '@/types';
import {
    type Branch,
    type BranchCustomField,
    type BranchDocument,
    type BranchEditFormData,
    type BranchOption,
    type BranchType,
    type Department,
    type Employee,
} from '@/types/branch';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    BasicEdit,
    CustomFieldsEdit,
    DepartmentsEdit,
    DetailsEdit,
    DocumentsEdit,
    NotesEdit,
    SettingsEdit,
} from './edit';

interface Props {
    branch: Branch;
    employees: Employee[];
    branches: BranchOption[];
    branchTypes: BranchType[];
    departments?: Department[];
    currentUser?: User;
    className?: string;
}

export function BranchEditForm({
    branch,
    employees,
    branches,
    branchTypes,
    departments = [],
    currentUser,
    className,
}: Props) {
    const [activeTab, handleTabChange] = useUrlTab('basic');

    // Staged departments state
    const [stagedDepartments, setStagedDepartments] = useState<Department[]>(
        branch.departments || [],
    );

    // Staged notes state
    const [stagedNotes, setStagedNotes] = useState<Note[]>(branch.notes || []);

    // Staged documents state
    const [stagedDocuments, setStagedDocuments] = useState(
        branch.documents || [],
    );

    // Staged custom fields state
    const [stagedCustomFields, setStagedCustomFields] = useState(
        branch.custom_fields || [],
    );

    const { data, setData, post, processing, errors } =
        useForm<BranchEditFormData>({
            name: branch?.name || '',
            code: branch?.code || '',
            type: branch?.type || '',
            description: branch?.description || '',
            parent_id: branch?.parent_id,
            manager_id: branch?.manager_id,
            address_line_1: branch?.address_line_1 || '',
            address_line_2: branch?.address_line_2 || '',
            city: branch?.city || '',
            state: branch?.state || '',
            country: branch?.country || '',
            postal_code: branch?.postal_code || '',
            timezone: branch?.timezone || '',
            phone: branch?.phone || '',
            phone_2: branch?.phone_2 || '',
            email: branch?.email || '',
            opening_date: branch?.opening_date,
            status: branch?.status || 'active',
            is_active: branch?.is_active ?? true,
            max_employees: branch?.max_employees,
            budget: branch?.budget,
            cost_center: branch?.cost_center || '',
            tax_registration_number: branch?.tax_registration_number || '',
            detail: branch?.detail || {
                latitude: undefined,
                longitude: undefined,
                working_hours: undefined,
                facilities: undefined,
                total_area: undefined,
                total_floors: undefined,
                floor_number: '',
                accessibility_features: '',
                monthly_rent: undefined,
                monthly_utilities: undefined,
                monthly_maintenance: undefined,
                security_deposit: undefined,
                building_name: '',
                building_type: '',
                lease_start_date: undefined,
                lease_end_date: undefined,
                lease_terms: '',
                property_contact_name: '',
                property_contact_phone: '',
                property_contact_email: '',
                property_contact_address: '',
            },
            property_contact_photo: null as File | null,
            delete_property_contact_photo: false,
            _method: 'put',
            settings: branch?.settings || {
                allow_overtime: true,
                overtime_rate: 1.5,
                allow_remote_work: false,
                remote_work_days_per_week: null,
                standard_work_start: '09:00',
                standard_work_end: '18:00',
                standard_work_hours: 8,
                leave_policies: null,
                approval_hierarchy: null,
                security_features: [
                    { name: 'ID Card Required' },
                    { name: 'Visitor Registration' },
                ],
                currency: 'BDT',
                payment_method: 'bank',
                salary_payment_day: null,
                primary_language: 'en',
                supported_languages: [],
                emergency_contact_name: '',
                emergency_contact_phone: '',
                nearest_hospital: '',
                nearest_police_station: '',
                custom_settings: null,
            },
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Send POST request with forceFormData
            await new Promise<void>((resolve, reject) => {
                post(branchesUpdate(branch.id).url, {
                    forceFormData: true,
                    onSuccess: () => resolve(),
                    onError: (errors: Record<string, string>) => {
                        console.error('Validation errors:', errors);
                        reject(
                            new Error(
                                'Branch update failed due to validation errors. Please check the form for details.',
                            ),
                        );
                    },
                });
            });

            // Process departments
            await processAndReport<Department>(
                stagedDepartments,
                {
                    isNew: (d) => Boolean(d._isNew),
                    isModified: (d) => Boolean(d._isModified),
                    isDeleted: (d) => Boolean(d._isDeleted),
                    create: (d) =>
                        DepartmentsApi.attachDepartment(branch.id, {
                            department_id: d.id,
                            budget_allocation:
                                d.pivot?.budget_allocation || null,
                            is_primary: d.pivot?.is_primary || false,
                        }),
                    update: (d) =>
                        DepartmentsApi.updateDepartment(branch.id, d.id, {
                            budget_allocation:
                                d.pivot?.budget_allocation || null,
                            is_primary: d.pivot?.is_primary || false,
                        }),
                    remove: (d) =>
                        DepartmentsApi.detachDepartment(branch.id, d.id),
                },
                {
                    label: 'department',
                    getItemLabel: (d) => d.name || 'department',
                },
            );

            // Process notes
            await processAndReport<Note>(
                stagedNotes,
                {
                    isNew: (n) => Boolean(n._isNew),
                    isModified: (n) => Boolean(n._isModified),
                    isDeleted: (n) => Boolean(n._isDeleted),
                    create: (n) =>
                        NotesApi.createNote(branch.id, {
                            title: n.title || '',
                            note: n.note,
                            category: n.category || 'general',
                            is_private: n.is_private ?? false,
                        }),
                    update: (n) =>
                        NotesApi.updateNote(branch.id, n.id!, {
                            title: n.title || '',
                            note: n.note,
                            category: n.category || 'general',
                            is_private: n.is_private ?? false,
                        }),
                    remove: (n) => NotesApi.deleteNote(branch.id, n.id!),
                },
                {
                    label: 'note',
                    getItemLabel: (n) => n.title || n.category || 'note',
                },
            );

            // Process documents
            await processAndReport(
                stagedDocuments,
                {
                    isNew: (d) => Boolean(d._isNew),
                    isModified: (d) => Boolean(d._isModified),
                    isDeleted: (d) => Boolean(d._isDeleted),
                    create: async (d) => {
                        const formData = new FormData();
                        formData.append('branch_id', branch.id);
                        formData.append('doc_type', d.doc_type);
                        formData.append('title', d.title);
                        if (d._documentFile)
                            formData.append('file', d._documentFile);
                        if (d.expiry_date)
                            formData.append('expiry_date', d.expiry_date);
                        return DocumentsApi.createDocument(branch.id, formData);
                    },
                    update: async (d) => {
                        const formData = new FormData();
                        formData.append('doc_type', d.doc_type);
                        formData.append('title', d.title);
                        if (d._documentFile)
                            formData.append('file', d._documentFile);
                        if (d.expiry_date)
                            formData.append('expiry_date', d.expiry_date);
                        return DocumentsApi.updateDocument(
                            branch.id,
                            d.id,
                            formData,
                        );
                    },
                    remove: (d) => DocumentsApi.deleteDocument(branch.id, d.id),
                },
                {
                    label: 'document',
                    getItemLabel: (d) => d.title || 'document',
                },
            );

            // Process custom fields
            await processAndReport(
                stagedCustomFields,
                {
                    isNew: (f) => Boolean(f._isNew),
                    isModified: (f) => Boolean(f._isModified),
                    isDeleted: (f) => Boolean(f._isDeleted),
                    create: (f) =>
                        CustomFieldsApi.createCustomField({
                            branch_id: branch.id,
                            field_key: f.field_key,
                            field_value: f.field_value || null,
                            field_type: f.field_type,
                            section: f.section,
                        }),
                    update: (f) =>
                        CustomFieldsApi.updateCustomField(branch.id, f.id, {
                            field_key: f.field_key,
                            field_value: f.field_value || null,
                            field_type: f.field_type,
                            section: f.section,
                        }),
                    remove: (f) =>
                        CustomFieldsApi.deleteCustomField(branch.id, f.id),
                },
                {
                    label: 'custom field',
                    getItemLabel: (f) => f.field_key || 'field',
                },
            );

            toast.success('Branch updated successfully!');
            router.reload({ only: ['branch'] });
        } catch (error) {
            toast.error(
                'Some changes may not have been saved. Please refresh and try again.',
            );
            console.error('Error:', error);
        }
    };

    const handleReset = () => {
        router.reload({ only: ['branch'] });
    };

    // Check if form has any changes
    const hasChanges =
        JSON.stringify(data) !==
            JSON.stringify({
                name: branch?.name || '',
                code: branch?.code || '',
                type: branch?.type || '',
                description: branch?.description || '',
                parent_id: branch?.parent_id || null,
                manager_id: branch?.manager_id || null,
                address_line_1: branch?.address_line_1 || '',
                address_line_2: branch?.address_line_2 || '',
                city: branch?.city || '',
                state: branch?.state || '',
                country: branch?.country || '',
                postal_code: branch?.postal_code || '',
                timezone: branch?.timezone || '',
                phone: branch?.phone || '',
                phone_2: branch?.phone_2 || '',
                email: branch?.email || '',
                opening_date: branch?.opening_date || null,
                status: branch?.status || 'active',
                is_active: branch?.is_active ?? true,
                max_employees: branch?.max_employees || null,
                budget: branch?.budget || null,
                cost_center: branch?.cost_center || '',
                tax_registration_number: branch?.tax_registration_number || '',
                detail: branch?.detail || {
                    latitude: null,
                    longitude: null,
                    working_hours: null,
                    facilities: null,
                    total_area: null,
                    total_floors: null,
                    floor_number: '',
                    accessibility_features: '',
                    monthly_rent: null,
                    monthly_utilities: null,
                    monthly_maintenance: null,
                    security_deposit: null,
                    building_name: '',
                    building_type: '',
                    lease_start_date: null,
                    lease_end_date: null,
                    lease_terms: '',
                    property_contact_name: '',
                    property_contact_phone: '',
                    property_contact_email: '',
                    property_contact_address: '',
                },
                property_contact_photo: null,
                delete_property_contact_photo: false,
                _method: 'put',
                settings: branch?.settings || {
                    allow_overtime: true,
                    overtime_rate: 1.5,
                    allow_remote_work: false,
                    remote_work_days_per_week: null,
                    standard_work_start: '09:00',
                    standard_work_end: '18:00',
                    standard_work_hours: 8,
                    leave_policies: null,
                    approval_hierarchy: null,
                    security_features: [
                        { name: 'ID Card Required' },
                        { name: 'Visitor Registration' },
                    ],
                    currency: 'BDT',
                    payment_method: 'bank',
                    salary_payment_day: null,
                    primary_language: 'en',
                    supported_languages: [],
                    emergency_contact_name: '',
                    emergency_contact_phone: '',
                    nearest_hospital: '',
                    nearest_police_station: '',
                    custom_settings: null,
                },
            }) ||
        stagedDepartments.some(
            (dept) => dept._isNew || dept._isModified || dept._isDeleted,
        ) ||
        stagedNotes.some(
            (note) => note._isNew || note._isModified || note._isDeleted,
        ) ||
        stagedDocuments.some(
            (doc) => doc._isNew || doc._isModified || doc._isDeleted,
        ) ||
        stagedCustomFields.some(
            (field) => field._isNew || field._isModified || field._isDeleted,
        );

    const handleNoteAdd = (noteData: Note) => {
        // Add new staged note - set creator to current user and generate temporary ID
        const newNote = {
            ...noteData,
            id: `temp-${Date.now()}-${Math.random()}`, // Temporary ID for new notes
            creator: {
                name: currentUser?.name || 'Unknown',
            },
            _isNew: true,
        };
        setStagedNotes([...stagedNotes, newNote]);
    };

    const handleNoteEdit = (noteData: Note) => {
        // Update existing note (staged) - preserve relationships
        setStagedNotes(
            stagedNotes.map((note) =>
                note.id === noteData.id
                    ? {
                          ...note,
                          ...noteData,
                          _isModified: true,
                      }
                    : note,
            ),
        );
    };

    const handleNoteDelete = (noteId: string) => {
        // Mark note as deleted (staged)
        setStagedNotes(
            stagedNotes.map((note) =>
                note.id === noteId ? { ...note, _isDeleted: true } : note,
            ),
        );
        toast.success('Note deletion staged - save branch to apply');
    };

    const handleDocumentAdd = (documentData: Partial<BranchDocument>) => {
        const newDocument = {
            ...documentData,
            id: `temp-${Date.now()}-${Math.random()}`,
            _isNew: true,
        };
        setStagedDocuments([...stagedDocuments, newDocument as BranchDocument]);
    };

    const handleDocumentEdit = (documentData: Partial<BranchDocument>) => {
        setStagedDocuments(
            stagedDocuments.map((doc) =>
                doc.id === documentData.id
                    ? { ...doc, ...documentData, _isModified: true }
                    : doc,
            ),
        );
    };

    const handleDocumentDelete = (documentId: string) => {
        setStagedDocuments(
            stagedDocuments.map((doc) =>
                doc.id === documentId ? { ...doc, _isDeleted: true } : doc,
            ),
        );
        toast.success('Document deletion staged - save branch to apply');
    };

    const handleCustomFieldAdd = (fieldData: Partial<BranchCustomField>) => {
        const newField = {
            ...fieldData,
            id: `temp-${Date.now()}-${Math.random()}`,
            _isNew: true,
        };
        setStagedCustomFields([
            ...stagedCustomFields,
            newField as BranchCustomField,
        ]);
    };

    const handleCustomFieldEdit = (fieldData: Partial<BranchCustomField>) => {
        setStagedCustomFields(
            stagedCustomFields.map((field) =>
                field.id === fieldData.id
                    ? { ...field, ...fieldData, _isModified: true }
                    : field,
            ),
        );
    };

    const handleCustomFieldDelete = (fieldId: string) => {
        setStagedCustomFields(
            stagedCustomFields.map((field) =>
                field.id === fieldId ? { ...field, _isDeleted: true } : field,
            ),
        );
        toast.success('Custom field deletion staged - save branch to apply');
    };

    const branchTabs = [
        { value: 'basic', label: 'Basic' },
        { value: 'details', label: 'Details' },
        { value: 'departments', label: 'Departments' },
        { value: 'settings', label: 'Settings' },
        { value: 'documents', label: 'Documents' },
        { value: 'notes', label: 'Notes' },
        { value: 'custom-fields', label: 'Custom Fields' },
    ];

    return (
        <div className={className}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="space-y-6"
                >
                    <TabsNavigation tabs={branchTabs} />

                    <TabsContent value="basic" className="space-y-6">
                        <BasicEdit
                            data={data}
                            errors={errors}
                            setData={setData}
                            employees={employees}
                            branches={branches}
                            branchTypes={branchTypes}
                        />
                    </TabsContent>

                    <TabsContent value="details" className="space-y-6">
                        <DetailsEdit
                            data={data}
                            errors={errors}
                            setData={setData}
                            existingPhotoUrl={branch?.detail?.photo_url}
                        />
                    </TabsContent>

                    <TabsContent value="departments" className="space-y-6">
                        <DepartmentsEdit
                            departments={stagedDepartments}
                            availableDepartments={departments}
                            onDepartmentsChange={setStagedDepartments}
                        />
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                        <SettingsEdit
                            data={data}
                            errors={errors}
                            setData={setData}
                        />
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-6">
                        <DocumentsEdit
                            documents={stagedDocuments}
                            onDocumentAdd={handleDocumentAdd}
                            onDocumentEdit={handleDocumentEdit}
                            onDocumentDelete={handleDocumentDelete}
                        />
                    </TabsContent>

                    <TabsContent value="custom-fields" className="space-y-6">
                        <CustomFieldsEdit
                            customFields={stagedCustomFields}
                            onCustomFieldAdd={handleCustomFieldAdd}
                            onCustomFieldEdit={handleCustomFieldEdit}
                            onCustomFieldDelete={handleCustomFieldDelete}
                        />
                    </TabsContent>

                    <TabsContent value="notes" className="space-y-6">
                        <NotesEdit
                            notes={stagedNotes}
                            onNoteAdd={handleNoteAdd}
                            onNoteEdit={handleNoteEdit}
                            onNoteDelete={handleNoteDelete}
                            currentUser={currentUser}
                        />
                    </TabsContent>
                </Tabs>

                <FormActions
                    onReset={handleReset}
                    submitLabel="Update"
                    processing={processing}
                    disabled={!hasChanges}
                />
            </form>
        </div>
    );
}
