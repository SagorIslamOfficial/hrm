import {
    CreatedByField,
    DateField,
    FormActions,
    InfoCard,
    PageHeader,
    PhotoUploadField,
    SelectField,
    TextField,
} from '@/components/common';
import AppLayout from '@/layouts/app-layout';
import {
    create as employeesCreate,
    index as employeesIndex,
    store as employeesStore,
} from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    departments: Array<{ id: string; name: string }>;
    designations: Array<{ id: string; title: string }>;
    employmentTypes: Array<{ code: string; name: string }>;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: employeesIndex().url,
    },
    {
        title: 'Create Employee',
        href: employeesCreate().url,
    },
];

export default function Create({
    departments,
    designations,
    employmentTypes,
    auth,
}: Props) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Get first employment type as default
    const defaultEmploymentType =
        employmentTypes.length > 0 ? employmentTypes[0].code : '';

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            employee_code: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            photo: null as File | null,
            department_id: '',
            designation_id: '',
            employment_status: 'active',
            employment_type: defaultEmploymentType,
            joining_date: today,
        });

    // Check if all required fields are filled
    const isFormValid = useMemo(() => {
        return (
            data.employee_code.trim() !== '' &&
            data.first_name.trim() !== '' &&
            data.last_name.trim() !== '' &&
            data.email.trim() !== '' &&
            data.department_id !== '' &&
            data.designation_id !== '' &&
            data.employment_status !== '' &&
            data.employment_type !== '' &&
            data.joining_date !== ''
        );
    }, [
        data.employee_code,
        data.first_name,
        data.last_name,
        data.email,
        data.department_id,
        data.designation_id,
        data.employment_status,
        data.employment_type,
        data.joining_date,
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(employeesStore().url, {
            onSuccess: () => {
                toast.success(
                    'Employee created successfully! Redirecting to complete profile...',
                );
            },
            onError: () => {
                toast.error('Failed to create employee. Please try again.');
            },
        });
    };

    const handleReset = () => {
        reset();
        clearErrors();
        setPreviewUrl(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Employee" />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto p-4">
                <PageHeader
                    title="Create Employee"
                    description="Add a new employee with basic information. You'll be able to complete their full profile after creation."
                    backUrl={employeesIndex().url}
                    backLabel="Cancel"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InfoCard
                        title="Employee Information"
                        className="rounded-xl border border-sidebar-border/70 p-6"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <TextField
                                id="employee_code"
                                label="Employee Code"
                                value={data.employee_code}
                                onChange={(value) =>
                                    setData('employee_code', value)
                                }
                                error={errors.employee_code}
                                required
                                placeholder="Enter employee code (e.g., EMP001)"
                            />

                            <TextField
                                id="email"
                                label="Email Address"
                                type="email"
                                value={data.email}
                                onChange={(value) => setData('email', value)}
                                error={errors.email}
                                required
                                placeholder="Enter email address (e.g., me@sagorislam.dev)"
                            />

                            <TextField
                                id="first_name"
                                label="First Name"
                                value={data.first_name}
                                onChange={(value) =>
                                    setData('first_name', value)
                                }
                                error={errors.first_name}
                                required
                                placeholder="Enter first name (e.g., Sagor)"
                            />

                            <TextField
                                id="last_name"
                                label="Last Name"
                                value={data.last_name}
                                onChange={(value) =>
                                    setData('last_name', value)
                                }
                                error={errors.last_name}
                                required
                                placeholder="Enter last name (e.g., Islam)"
                            />

                            <TextField
                                id="phone"
                                label="Phone Number"
                                type="tel"
                                value={data.phone}
                                onChange={(value) => setData('phone', value)}
                                error={errors.phone}
                                placeholder="Enter phone number (e.g., +8801933126160)"
                            />

                            <SelectField
                                id="department_id"
                                label="Department"
                                required
                                value={data.department_id}
                                onChange={(value) =>
                                    setData('department_id', value)
                                }
                                options={departments.map((dept) => ({
                                    value: dept.id,
                                    label: dept.name,
                                }))}
                            />

                            <SelectField
                                id="designation_id"
                                label="Designation"
                                required
                                value={data.designation_id}
                                onChange={(value) =>
                                    setData('designation_id', value)
                                }
                                options={designations.map((desig) => ({
                                    value: desig.id,
                                    label: desig.title,
                                }))}
                            />

                            <SelectField
                                id="employment_status"
                                label="Employment Status"
                                required
                                value={data.employment_status}
                                onChange={(value) =>
                                    setData('employment_status', value)
                                }
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'InActive' },
                                    {
                                        value: 'terminated',
                                        label: 'Terminated',
                                    },
                                    { value: 'on_leave', label: 'On Leave' },
                                ]}
                            />

                            <SelectField
                                id="employment_type"
                                label="Employment Type"
                                required
                                value={data.employment_type}
                                onChange={(value) =>
                                    setData('employment_type', value)
                                }
                                options={employmentTypes.map((type) => ({
                                    value: type.code,
                                    label: type.name,
                                }))}
                            />

                            <DateField
                                id="joining_date"
                                label="Joining Date"
                                value={data.joining_date}
                                onChange={(value) =>
                                    setData('joining_date', value)
                                }
                                error={errors.joining_date}
                                required
                            />

                            <PhotoUploadField
                                value={data.photo}
                                onChange={(file) => {
                                    setData('photo', file);
                                    if (file) {
                                        const url = URL.createObjectURL(file);
                                        setPreviewUrl(url);
                                    }
                                }}
                                onDelete={() => {
                                    setData('photo', null);
                                    setPreviewUrl(null);
                                }}
                                helpText="Upload a profile photo (max 2MB, JPEG/PNG/WebP)"
                                error={errors.photo}
                                previewUrl={previewUrl}
                            />

                            <CreatedByField userName={auth?.user?.name} />
                        </div>
                    </InfoCard>

                    <FormActions
                        onReset={handleReset}
                        submitLabel="Create Employee"
                        processing={processing}
                        disabled={!isFormValid}
                    />
                </form>
            </div>
        </AppLayout>
    );
}
