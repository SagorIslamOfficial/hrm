import { PhotoDialog, TabsNavigation } from '@/components/common';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useUrlTab } from '@/hooks';
import { useState } from 'react';
import {
    AttendanceView,
    ContactsView,
    CustomFieldsView,
    DocumentsView,
    JobView,
    LeavesView,
    NotesView,
    OverviewView,
    PersonalView,
    SalaryView,
} from './view';

interface Contact {
    id: string;
    contact_name: string;
    relationship: string;
    phone: string;
    email: string | null;
    address: string;
    photo?: string;
    photo_url?: string;
    is_primary: boolean;
}

interface Employee {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    photo: string | null;
    photo_url?: string;
    employment_status: string;
    employment_type: string;
    joining_date: string;
    currency?: string;
    department: {
        id: string;
        name: string;
        code: string;
    };
    designation: {
        id: string;
        title: string;
        code: string;
    };
    personal_detail?: {
        date_of_birth: string;
        gender: string;
        marital_status: string;
        blood_group: string;
        national_id: string;
        passport_number: string | null;
        address: string;
        city: string;
        country: string;
    };
    job_detail?: {
        job_title: string;
        branch_id: string;
        supervisor_id: string;
        work_shift: string;
        probation_end_date: string | null;
        contract_end_date: string | null;
    };
    salary_detail?: {
        basic_salary: number;
        allowances: number;
        deductions: number;
        net_salary: number;
        bank_name: string;
        bank_account_number: string;
        bank_branch: string;
        tax_id: string;
    };
    contacts?: Contact[];
    documents?: Array<{
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
    }>;
    notes?: Array<{
        id: string;
        note: string;
        category: string;
        is_private: boolean;
        created_at: string;
        creator?: {
            name: string;
        };
        updated_at?: string;
        updater?: {
            name?: string;
        };
    }>;
    attendance?: Array<{
        id: string;
        date: string;
        check_in: string | null;
        check_out: string | null;
        status: string;
        remarks: string | null;
    }>;
    leaves?: Array<{
        id: string;
        leave_type: string;
        start_date: string;
        end_date: string;
        total_days: number;
        status: string;
        reason: string;
    }>;
    custom_fields?: Array<{
        id: string;
        field_key: string;
        field_value: string;
        field_type: string;
        section: string;
    }>;
    user?: {
        id: number;
        name: string;
        email: string;
        created_at: string;
        roles?: Array<{
            id: number;
            name: string;
        }>;
    };
}

interface EmployeeShowFormProps {
    employee: Employee;
    branches: Array<{ id: string; name: string; code?: string }>;
    branch_id?: string;
    supervisors: Array<{ id: string; name: string; employee_code: string }>;
    className?: string;
    auth?: {
        user?: {
            id?: number;
            name?: string;
            roles?: Array<{ name: string }>;
            is_super_admin?: boolean;
        };
    };
}

export function EmployeeShow({
    employee,
    branches,
    supervisors,
    className,
    auth,
}: EmployeeShowFormProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<{
        url: string;
        name: string;
    } | null>(null);

    // Use URL-based tab persistence hook
    const [activeTab, handleTabChange] = useUrlTab('overview');

    const employeeTabs = [
        { value: 'overview', label: 'Overview' },
        { value: 'personal', label: 'Personal' },
        { value: 'job', label: 'Job' },
        { value: 'salary', label: 'Salary' },
        { value: 'contacts', label: 'Contacts' },
        { value: 'documents', label: 'Documents' },
        { value: 'notes', label: 'Notes' },
        { value: 'attendance', label: 'Attendance' },
        { value: 'leaves', label: 'Leaves' },
        { value: 'customFields', label: 'Custom Fields' },
    ];

    return (
        <div className={className}>
            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="space-y-6"
            >
                <TabsNavigation tabs={employeeTabs} />

                <TabsContent value="overview" className="space-y-4">
                    <OverviewView employee={employee} auth={auth} />
                </TabsContent>

                <TabsContent value="personal" className="space-y-4">
                    <PersonalView personalDetail={employee.personal_detail} />
                </TabsContent>

                <TabsContent value="job" className="space-y-6">
                    <JobView
                        jobDetail={employee.job_detail}
                        supervisors={supervisors}
                        branches={branches}
                    />
                </TabsContent>

                <TabsContent value="salary" className="space-y-4">
                    <SalaryView
                        salaryDetail={employee.salary_detail}
                        currency={employee.currency}
                    />
                </TabsContent>

                <TabsContent value="contacts" className="space-y-4">
                    <ContactsView
                        contacts={employee.contacts}
                        onPhotoClick={setSelectedPhoto}
                    />
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                    <DocumentsView
                        documents={employee.documents}
                        employeeId={employee.id}
                    />
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                    <NotesView notes={employee.notes} />
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                    <AttendanceView attendance={employee.attendance} />
                </TabsContent>

                <TabsContent value="leaves" className="space-y-4">
                    <LeavesView leaves={employee.leaves} />
                </TabsContent>

                <TabsContent value="customFields" className="space-y-4">
                    <CustomFieldsView customFields={employee.custom_fields} />
                </TabsContent>
            </Tabs>

            {/* Photo Popup Dialog */}
            <PhotoDialog
                open={selectedPhoto !== null}
                onOpenChange={(open) => !open && setSelectedPhoto(null)}
                photoUrl={selectedPhoto?.url || null}
                photoName={selectedPhoto?.name || ''}
            />
        </div>
    );
}
