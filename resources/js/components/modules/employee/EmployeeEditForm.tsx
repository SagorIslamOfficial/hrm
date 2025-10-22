import {
    FormActions,
    TabsNavigation,
    formatDateForInput,
} from '@/components/common';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useUrlTab } from '@/hooks';
import { update as employeesUpdate } from '@/routes/employees/index';
import { router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import { AdditionalTab } from './AdditionalTab';
import { AttendanceTab } from './AttendanceTab';
import { BasicTab } from './BasicTab';
import { ContactsTab } from './ContactsTab';
import { DocumentsTab } from './DocumentsTab';
import { JobTab } from './JobTab';
import { LeaveTab } from './LeaveTab';
import { NotesTab } from './NotesTab';
import { PersonalTab } from './PersonalTab';
import { SalaryTab } from './SalaryTab';

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
        employment_type?: string;
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
    documents?: Array<{
        id: string;
        document_type: string;
        document_name: string;
        file_path: string;
        uploaded_at: string;
    }>;
    notes?: Array<{
        id: string;
        title: string;
        content: string;
        created_at: string;
    }>;
    customFields?: Array<{
        id: string;
        field_name: string;
        field_value: string;
        field_type: string;
    }>;
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

export default function EmployeeEditForm({
    employee,
    departments,
    designations,
    employmentTypes,
    supervisors,
    auth,
    className,
}: EmployeeEditFormProps) {
    const [contacts, setContacts] = useState(employee.contacts || []);

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
            employment_type:
                employee.job_detail?.employment_type ||
                employee.employment_type,
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

            // Then handle staged contacts
            const stagedContacts = contacts.filter(
                (contact) =>
                    contact._isNew || contact._isModified || contact._isDeleted,
            );

            for (const contact of stagedContacts) {
                try {
                    // Skip contacts that are both new and deleted
                    if (contact._isNew && contact._isDeleted) {
                        continue;
                    }

                    if (contact._isDeleted && !contact._isNew) {
                        // Delete existing contact
                        await axios.delete(
                            `/dashboard/employees/${employee.id}/contacts/${contact.id}`,
                        );
                    } else if (contact._isNew && !contact._isDeleted) {
                        // Create new contact
                        const formData = new FormData();
                        formData.append('contact_name', contact.contact_name);
                        formData.append('relationship', contact.relationship);
                        formData.append('phone', contact.phone);
                        formData.append('email', contact.email || '');
                        formData.append('address', contact.address || '');
                        formData.append(
                            'is_primary',
                            contact.is_primary ? '1' : '0',
                        );

                        if (contact._photoFile) {
                            formData.append('photo', contact._photoFile);
                        }

                        await axios.post(
                            `/dashboard/employees/${employee.id}/contacts`,
                            formData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            },
                        );
                    } else if (contact._isModified) {
                        // Update existing contact
                        const formData = new FormData();
                        formData.append('contact_name', contact.contact_name);
                        formData.append('relationship', contact.relationship);
                        formData.append('phone', contact.phone);
                        formData.append('email', contact.email || '');
                        formData.append('address', contact.address || '');
                        formData.append(
                            'is_primary',
                            contact.is_primary ? '1' : '0',
                        );
                        formData.append('_method', 'put');

                        if (contact._photoFile) {
                            formData.append('photo', contact._photoFile);
                        }

                        await axios.post(
                            `/dashboard/employees/${employee.id}/contacts/${contact.id}`,
                            formData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            },
                        );
                    }
                } catch (contactError: unknown) {
                    const error = contactError as {
                        response?: {
                            data?: {
                                errors?: Record<string, string[]>;
                            };
                        };
                    };

                    // Show specific validation error if available
                    const validationErrors = error?.response?.data?.errors;
                    if (
                        validationErrors &&
                        Object.keys(validationErrors).length > 0
                    ) {
                        const firstError =
                            Object.values(validationErrors)[0][0];
                        toast.error(`Failed to sync contact: ${firstError}`);
                    } else {
                        toast.error(
                            `Failed to sync contact: ${contact.contact_name}`,
                        );
                    }
                }
            }

            router.reload({
                only: ['employee'],
                onSuccess: (page) => {
                    const freshEmployee = page.props
                        .employee as typeof employee;
                    if (freshEmployee?.contacts) {
                        setContacts(freshEmployee.contacts);
                    }
                    toast.success(
                        'Employee and contacts updated successfully!',
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

    const handleReset = () => {
        reset();
        clearErrors();
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

    // Check if form has any changes
    const hasChanges =
        isDirty || // Form data has changed
        contacts.some((c) => c._isNew || c._isModified || c._isDeleted); // Contacts have changed

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
        { value: 'additional', label: 'Additional' },
    ];

    return (
        <div className={className}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="space-y-6"
                >
                    {/* Tabs Navigation */}
                    <TabsNavigation tabs={employeeTabs} />

                    {/* Tabs Content */}
                    <TabsContent value="basic" className="space-y-6">
                        <BasicTab
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

                    {/* Personal Tab */}
                    <TabsContent value="personal" className="space-y-6">
                        <PersonalTab
                            data={{
                                personal_detail: data.personal_detail,
                            }}
                            setData={setData}
                        />
                    </TabsContent>

                    {/* Job Tab */}
                    <TabsContent value="job" className="space-y-6">
                        <JobTab
                            data={{
                                job_detail: data.job_detail,
                            }}
                            setData={setData}
                            supervisors={supervisors}
                            employmentTypes={employmentTypes}
                            isSuperAdminOrOwner={isSuperAdminOrOwner || false}
                        />
                    </TabsContent>

                    {/* Salary Tab */}
                    <TabsContent value="salary" className="space-y-6">
                        <SalaryTab
                            data={{
                                salary_detail: data.salary_detail,
                            }}
                            setData={setData}
                        />
                    </TabsContent>

                    {/* Contacts Tab */}
                    <TabsContent value="contacts" className="space-y-6">
                        <ContactsTab
                            contacts={contacts}
                            onContactAdd={handleContactAdd}
                            onContactEdit={handleContactEdit}
                            onContactDelete={handleDeleteContact}
                        />
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="space-y-6">
                        <DocumentsTab />
                    </TabsContent>

                    {/* Notes Tab */}
                    <TabsContent value="notes" className="space-y-6">
                        <NotesTab />
                    </TabsContent>

                    {/* Attendance Tab */}
                    <TabsContent value="attendance" className="space-y-6">
                        <AttendanceTab />
                    </TabsContent>

                    {/* Leave Tab */}
                    <TabsContent value="leave" className="space-y-6">
                        <LeaveTab />
                    </TabsContent>

                    {/* Additional Tab */}
                    <TabsContent value="additional" className="space-y-6">
                        <AdditionalTab />
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
