import {
    FormActions,
    TabsNavigation,
    formatDateForInput,
} from '@/components/common';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useUrlTab } from '@/hooks';
import { update as employeesUpdate } from '@/routes/employees/index';
import { router, useForm } from '@inertiajs/react';
// axios removed - use lib helpers
import * as ContactsApi from '@/lib/employee/contacts';
import * as CustomFieldsApi from '@/lib/employee/customFields';
import * as DocumentsApi from '@/lib/employee/documents';
import * as NotesApi from '@/lib/employee/notes';
import processAndReport from '@/lib/employee/processAndReport';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AttendanceEdit,
    BasicEdit,
    ContactsEdit,
    CustomFieldsEdit,
    DocumentsEdit,
    JobEdit,
    LeaveEdit,
    NotesEdit,
    PersonalEdit,
    SalaryEdit,
} from './edit';

interface Contact {
    id: string;
    contact_name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
    photo?: string;
    photo_url?: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
    // Staging properties for pending changes
    _photoFile?: File;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

interface Document {
    id: string;
    doc_type: string;
    title: string;
    file_name: string;
    file_path: string;
    file_url: string;
    file_size: number;
    expiry_date: string | null;
    is_expired: boolean;
    is_expiring_soon: boolean;
    uploader?: {
        id: string;
        name: string;
    };
    created_at: string;
    // Staging properties for pending changes
    _documentFile?: File;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

interface Note {
    id: string;
    note: string;
    category: string;
    is_private: boolean;
    created_at: string;
    updated_at?: string;
    creator?: {
        name?: string;
    };
    updater?: {
        name?: string;
    };
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

interface CustomField {
    id: string;
    field_key: string;
    field_value: string;
    field_type: string;
    section: string;
    _isNew?: boolean;
    _isModified?: boolean;
    _isDeleted?: boolean;
}

interface Employee {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    photo?: string;
    photo_url?: string;
    employment_status: string;
    employment_type: string;
    joining_date: string;
    currency?: string;
    department?: {
        id: string;
        name: string;
    };
    designation?: {
        id: string;
        title: string;
    };
    personal_detail?: {
        date_of_birth?: string;
        gender?: string;
        marital_status?: string;
        blood_group?: string;
        national_id?: string;
        passport_number?: string;
        address?: string;
        city?: string;
        country?: string;
    };
    job_detail?: {
        job_title?: string;
        supervisor_id?: string;
        work_shift?: string;
        probation_end_date?: string;
        contract_end_date?: string;
    };
    salary_detail?: {
        basic_salary?: number;
        allowances?: number;
        deductions?: number;
        net_salary?: number;
        bank_name?: string;
        bank_account_number?: string;
        bank_branch?: string;
        tax_id?: string;
    };
    contacts?: Contact[];
    documents?: Document[];
    notes?: Note[];
    custom_fields?: CustomField[];
}

interface EmployeeEditFormProps {
    employee: Employee;
    departments: Array<{ id: string; name: string }>;
    designations: Array<{ id: string; title: string }>;
    employmentTypes: Array<{ code: string; name: string }>;
    supervisors: Array<{ id: string; name: string; employee_code: string }>;
    auth?: {
        user?: {
            id: string;
            name: string;
            email: string;
            roles?: Array<{ name: string }>;
            is_super_admin?: boolean;
        };
    };
    className?: string;
}

export function EmployeeEditForm({
    employee,
    departments,
    designations,
    employmentTypes,
    supervisors,
    auth,
    className,
}: EmployeeEditFormProps) {
    const [contacts, setContacts] = useState(employee.contacts || []);
    const [documents, setDocuments] = useState(employee.documents || []);
    const [notes, setNotes] = useState(employee.notes || []);
    const [customFields, setCustomFields] = useState(
        employee.custom_fields || [],
    );

    // Use URL-based tab persistence hook
    const [activeTab, handleTabChange] = useUrlTab('basic');

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
        isDirty,
    } = useForm({
        // Basic employee data
        employee_code: employee.employee_code,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone || '',
        photo: null as File | null,
        delete_photo: false,
        _method: 'put',
        department_id: employee.department?.id || '',
        designation_id: employee.designation?.id || '',
        employment_status: employee.employment_status,
        employment_type: employee.employment_type,
        joining_date: formatDateForInput(employee.joining_date),

        // Personal details
        personal_detail: {
            date_of_birth: formatDateForInput(
                employee.personal_detail?.date_of_birth,
            ),
            gender: employee.personal_detail?.gender || '',
            marital_status: employee.personal_detail?.marital_status || '',
            blood_group: employee.personal_detail?.blood_group || '',
            national_id: employee.personal_detail?.national_id || '',
            passport_number: employee.personal_detail?.passport_number || '',
            address: employee.personal_detail?.address || '',
            city: employee.personal_detail?.city || '',
            country: employee.personal_detail?.country || '',
        },

        // Job details
        job_detail: {
            job_title: employee.job_detail?.job_title || '',
            supervisor_id: employee.job_detail?.supervisor_id || '',
            work_shift: employee.job_detail?.work_shift || '',
            probation_end_date: formatDateForInput(
                employee.job_detail?.probation_end_date,
            ),
            contract_end_date: formatDateForInput(
                employee.job_detail?.contract_end_date,
            ),
        },

        // Salary details
        salary_detail: {
            basic_salary: employee.salary_detail?.basic_salary || '',
            allowances: employee.salary_detail?.allowances || '',
            deductions: employee.salary_detail?.deductions || '',
            net_salary: employee.salary_detail?.net_salary || '',
            bank_name: employee.salary_detail?.bank_name || '',
            bank_account_number:
                employee.salary_detail?.bank_account_number || '',
            bank_branch: employee.salary_detail?.bank_branch || '',
            tax_id: employee.salary_detail?.tax_id || '',
        },

        // Currency
        currency: employee.currency || 'BDT',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // First update the employee
            await new Promise<void>((resolve, reject) => {
                post(employeesUpdate(employee.id).url, {
                    forceFormData: true,
                    onSuccess: () => resolve(),
                    onError: () => reject(new Error('Employee update failed')),
                });
            });

            // Then handle staged contacts/documents/notes/custom fields via processAndReport
            await processAndReport<Contact>(
                contacts,
                {
                    isNew: (c) => Boolean(c._isNew),
                    isModified: (c) => Boolean(c._isModified),
                    isDeleted: (c) => Boolean(c._isDeleted),
                    create: (c) =>
                        ContactsApi.createContact(employee.id, {
                            contact_name: c.contact_name,
                            relationship: c.relationship,
                            phone: c.phone,
                            email: c.email || '',
                            address: c.address || '',
                            is_primary: Boolean(c.is_primary),
                            _photoFile: c._photoFile,
                        }),
                    update: (c) =>
                        ContactsApi.updateContact(employee.id, c.id, {
                            contact_name: c.contact_name,
                            relationship: c.relationship,
                            phone: c.phone,
                            email: c.email || '',
                            address: c.address || '',
                            is_primary: Boolean(c.is_primary),
                            _photoFile: c._photoFile,
                        }),
                    remove: (c) => ContactsApi.deleteContact(employee.id, c.id),
                },
                {
                    label: 'contact',
                    getItemLabel: (c) => c.contact_name || 'contact',
                },
            );

            await processAndReport<Document>(
                documents,
                {
                    isNew: (d) => Boolean(d._isNew),
                    isModified: (d) => Boolean(d._isModified),
                    isDeleted: (d) => Boolean(d._isDeleted),
                    create: (d) => DocumentsApi.createDocument(employee.id, d),
                    update: (d) =>
                        DocumentsApi.updateDocument(employee.id, d.id, d),
                    remove: (d) =>
                        DocumentsApi.deleteDocument(employee.id, d.id),
                },
                {
                    label: 'document',
                    getItemLabel: (d) => d.title || 'document',
                },
            );

            await processAndReport<Note>(
                notes,
                {
                    isNew: (n) => Boolean(n._isNew),
                    isModified: (n) => Boolean(n._isModified),
                    isDeleted: (n) => Boolean(n._isDeleted),
                    create: (n) =>
                        NotesApi.createNote(employee.id, {
                            note: n.note,
                            category: n.category,
                            is_private: n.is_private,
                        }),
                    update: (n) =>
                        NotesApi.updateNote(employee.id, n.id, {
                            note: n.note,
                            category: n.category,
                            is_private: n.is_private,
                        }),
                    remove: (n) => NotesApi.deleteNote(employee.id, n.id),
                },
                {
                    label: 'note',
                    getItemLabel: (n) =>
                        n.category || n.note?.slice(0, 30) || 'note',
                },
            );

            await processAndReport<CustomField>(
                customFields,
                {
                    isNew: (f) => Boolean(f._isNew),
                    isModified: (f) => Boolean(f._isModified),
                    isDeleted: (f) => Boolean(f._isDeleted),
                    create: (f) =>
                        CustomFieldsApi.createCustomField(employee.id, {
                            employee_id: employee.id,
                            field_key: f.field_key,
                            field_value: f.field_value,
                            field_type: f.field_type,
                            section: f.section,
                        }),
                    update: (f) =>
                        CustomFieldsApi.updateCustomField(employee.id, f.id, {
                            field_key: f.field_key,
                            field_value: f.field_value,
                            field_type: f.field_type,
                            section: f.section,
                        }),
                    remove: (f) =>
                        CustomFieldsApi.deleteCustomField(employee.id, f.id),
                },
                {
                    label: 'custom field',
                    getItemLabel: (f) => f.field_key || 'field',
                },
            );

            router.reload({
                only: ['employee'],
                onSuccess: (page) => {
                    const freshEmployee = page.props
                        .employee as typeof employee;
                    if (freshEmployee?.contacts) {
                        setContacts(freshEmployee.contacts);
                    }
                    if (freshEmployee?.documents) {
                        setDocuments(freshEmployee.documents);
                    }
                    if (freshEmployee?.notes) {
                        setNotes(freshEmployee.notes);
                    }
                    if (freshEmployee?.custom_fields) {
                        setCustomFields(freshEmployee.custom_fields);
                    }
                    toast.success(
                        'Employee updated successfully with all changes!',
                    );
                },
                onError: () => {
                    toast.error(
                        'Failed to refresh data. Please refresh the page.',
                    );
                },
            });
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('Failed to update employee. Please try again.');
        }
    };

    const handleDeleteContact = (contactId: string) => {
        // Mark contact as deleted (staged)
        setContacts(
            contacts.map((contact) =>
                contact.id === contactId
                    ? { ...contact, _isDeleted: true }
                    : contact,
            ),
        );
        toast.success('Contact deletion staged - save employee to apply');
        handleTabChange('contacts');
    };

    const handleContactAdd = (contactData: Contact) => {
        // Add new staged contact
        setContacts([...contacts, contactData]);
        handleTabChange('contacts');
    };

    const handleContactEdit = (contactData: Contact) => {
        // Update existing contact (staged)
        setContacts(
            contacts.map((contact) =>
                contact.id === contactData.id ? contactData : contact,
            ),
        );
        handleTabChange('contacts');
    };

    const handleDocumentAdd = (documentData: Document) => {
        // Add new staged document
        setDocuments([...documents, documentData]);
        handleTabChange('documents');
    };

    const handleDocumentEdit = (documentData: Document) => {
        // Update existing document (staged)
        setDocuments(
            documents.map((doc) =>
                doc.id === documentData.id ? documentData : doc,
            ),
        );
        handleTabChange('documents');
    };

    const handleDeleteDocument = (documentId: string) => {
        // Mark document as deleted (staged)
        setDocuments(
            documents.map((doc) =>
                doc.id === documentId ? { ...doc, _isDeleted: true } : doc,
            ),
        );
        toast.success('Document deletion staged - save employee to apply');
        handleTabChange('documents');
    };

    const handleNoteAdd = (noteData: Note) => {
        // Add new staged note - set creator to current user
        const newNote = {
            ...noteData,
            creator: {
                name: auth?.user?.name || 'Unknown',
            },
            _isNew: true,
        };
        setNotes([...notes, newNote]);
        handleTabChange('notes');
    };

    const handleNoteEdit = (noteData: Note) => {
        // Update existing note (staged) - preserve relationships
        setNotes(
            notes.map((note) =>
                note.id === noteData.id
                    ? {
                          ...note,
                          ...noteData,
                          _isModified: true,
                      }
                    : note,
            ),
        );
        handleTabChange('notes');
    };

    const handleDeleteNote = (noteId: string) => {
        // Mark note as deleted (staged)
        setNotes(
            notes.map((note) =>
                note.id === noteId ? { ...note, _isDeleted: true } : note,
            ),
        );
        toast.success('Note deletion staged - save employee to apply');
        handleTabChange('notes');
    };

    const handleCustomFieldAdd = (customFieldData: CustomField) => {
        // Add new staged custom field
        setCustomFields([...customFields, customFieldData]);
        handleTabChange('customFields');
    };

    const handleCustomFieldEdit = (customFieldData: CustomField) => {
        // Update existing custom field (staged)
        setCustomFields(
            customFields.map((field) =>
                field.id === customFieldData.id ? customFieldData : field,
            ),
        );
        handleTabChange('customFields');
    };

    const handleDeleteCustomField = (customFieldId: string) => {
        // Mark custom field as deleted (staged)
        setCustomFields(
            customFields.map((field) =>
                field.id === customFieldId
                    ? { ...field, _isDeleted: true }
                    : field,
            ),
        );
        toast.success('Custom field deletion staged - save employee to apply');
        handleTabChange('customFields');
    };

    const handleReset = () => {
        reset();
        clearErrors();
    };

    // Check if form has any changes
    const hasChanges =
        isDirty || // Form data has changed
        contacts.some((c) => c._isNew || c._isModified || c._isDeleted) || // Contacts have changed
        documents.some((d) => d._isNew || d._isModified || d._isDeleted) || // Documents have changed
        notes.some((n) => n._isNew || n._isModified || n._isDeleted) || // Notes have changed
        customFields.some((f) => f._isNew || f._isModified || f._isDeleted); // Custom fields have changed

    const isSuperAdminOrOwner =
        auth?.user?.is_super_admin ||
        auth?.user?.roles?.some((role) => role.name === 'Admin');

    const employeeTabs = [
        { value: 'basic', label: 'Basic' },
        { value: 'personal', label: 'Personal' },
        { value: 'job', label: 'Job' },
        { value: 'salary', label: 'Salary' },
        { value: 'contacts', label: 'Contacts' },
        { value: 'documents', label: 'Documents' },
        { value: 'notes', label: 'Notes' },
        { value: 'attendance', label: 'Attendance' },
        { value: 'leave', label: 'Leave' },
        { value: 'customFields', label: 'Custom Fields' },
    ];

    return (
        <div className={className}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="space-y-6"
                >
                    <TabsNavigation tabs={employeeTabs} />

                    <TabsContent value="basic" className="space-y-6">
                        <BasicEdit
                            data={{
                                employee_code: data.employee_code,
                                email: data.email,
                                first_name: data.first_name,
                                last_name: data.last_name,
                                phone: data.phone,
                                department_id: data.department_id,
                                designation_id: data.designation_id,
                                employment_status: data.employment_status,
                                employment_type: data.employment_type,
                                joining_date: data.joining_date,
                                photo: data.photo,
                                delete_photo: data.delete_photo,
                            }}
                            existingPhotoUrl={employee.photo_url}
                            setData={setData}
                            errors={errors}
                            departments={departments}
                            designations={designations}
                            employmentTypes={employmentTypes}
                            auth={auth}
                        />
                    </TabsContent>

                    <TabsContent value="personal" className="space-y-6">
                        <PersonalEdit
                            data={{
                                personal_detail: data.personal_detail,
                            }}
                            setData={setData}
                        />
                    </TabsContent>

                    <TabsContent value="job" className="space-y-6">
                        <JobEdit
                            data={{
                                job_detail: data.job_detail,
                            }}
                            setData={setData}
                            supervisors={supervisors}
                            isSuperAdminOrOwner={isSuperAdminOrOwner || false}
                        />
                    </TabsContent>

                    <TabsContent value="salary" className="space-y-6">
                        <SalaryEdit
                            data={{
                                salary_detail: data.salary_detail,
                            }}
                            currency={data.currency}
                            setData={setData}
                        />
                    </TabsContent>

                    <TabsContent value="contacts" className="space-y-6">
                        <ContactsEdit
                            contacts={contacts}
                            onContactAdd={handleContactAdd}
                            onContactEdit={handleContactEdit}
                            onContactDelete={handleDeleteContact}
                        />
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-6">
                        <DocumentsEdit
                            documents={documents}
                            onDocumentAdd={handleDocumentAdd}
                            onDocumentEdit={handleDocumentEdit}
                            onDocumentDelete={handleDeleteDocument}
                        />
                    </TabsContent>

                    <TabsContent value="notes" className="space-y-6">
                        <NotesEdit
                            notes={notes}
                            onNoteAdd={handleNoteAdd}
                            onNoteEdit={handleNoteEdit}
                            onNoteDelete={handleDeleteNote}
                            currentUser={{
                                id: auth?.user?.id || '',
                                name: auth?.user?.name,
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="attendance" className="space-y-6">
                        <AttendanceEdit />
                    </TabsContent>

                    <TabsContent value="leave" className="space-y-6">
                        <LeaveEdit />
                    </TabsContent>

                    <TabsContent value="customFields" className="space-y-6">
                        <CustomFieldsEdit
                            customFields={customFields}
                            onCustomFieldAdd={handleCustomFieldAdd}
                            onCustomFieldEdit={handleCustomFieldEdit}
                            onCustomFieldDelete={handleDeleteCustomField}
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
