import {
    FormActions,
    FormField,
    InfoCard,
    PageHeader,
} from '@/components/common';
import AppLayout from '@/layouts/app-layout';
import {
    create as departmentsCreate,
    index as departmentsIndex,
    store as departmentsStore,
} from '@/routes/departments/index';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { toast } from 'sonner';

interface Employee {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface Props {
    employees: Employee[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: departmentsIndex().url,
    },
    {
        title: 'Create Department',
        href: departmentsCreate().url,
    },
];

export default function Create({ employees }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            code: '',
            description: '',
            manager_id: '',
            budget: '',
            location: '',
            status: 'active',
        });

    const isFormValid = useMemo(() => {
        return (
            data.name.trim() !== '' &&
            data.code.trim() !== '' &&
            data.manager_id !== '' &&
            data.status !== ''
        );
    }, [data.name, data.code, data.manager_id, data.status]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(departmentsStore().url, {
            onSuccess: () => {
                toast.success('Department created successfully!');
            },
            onError: () => {
                toast.error('Failed to create department. Please try again.');
            },
        });
    };

    const handleReset = () => {
        reset();
        clearErrors();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Department" />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto p-4">
                <PageHeader
                    title="Create Department"
                    description="Add a new department with basic information."
                    backUrl={departmentsIndex().url}
                    backLabel="Cancel"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InfoCard
                        title="Department Information"
                        className="rounded-xl border border-sidebar-border/70 p-6"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                                type="text"
                                id="name"
                                label="Department Name"
                                value={data.name}
                                onChange={(value: string) =>
                                    setData('name', value)
                                }
                                error={errors.name}
                                required
                                placeholder="Enter department name (e.g., Engineering)"
                            />

                            <FormField
                                type="text"
                                id="code"
                                label="Department Code"
                                value={data.code}
                                onChange={(value: string) =>
                                    setData('code', value)
                                }
                                error={errors.code}
                                required
                                placeholder="Enter department code (e.g., ENG, HR, IT)"
                            />

                            <FormField
                                type="combobox"
                                id="manager_id"
                                label="Manager"
                                required
                                value={data.manager_id}
                                onChange={(value: string) =>
                                    setData('manager_id', value)
                                }
                                error={errors.manager_id}
                                options={employees.map((employee) => ({
                                    value: employee.id,
                                    label: `${employee.first_name} ${employee.last_name}`,
                                }))}
                                searchPlaceholder="Search managers..."
                                emptyText="No managers found."
                            />

                            <FormField
                                type="number"
                                id="budget"
                                label="Budget"
                                value={data.budget}
                                onChange={(value: string | number) =>
                                    setData('budget', String(value))
                                }
                                error={errors.budget}
                                placeholder="Enter budget amount (e.g., 50000)"
                                min={0}
                                step={0.01}
                            />

                            <FormField
                                type="text"
                                id="location"
                                label="Location"
                                value={data.location}
                                onChange={(value: string) =>
                                    setData('location', value)
                                }
                                error={errors.location}
                                placeholder="Enter location (e.g., Building A, Floor 2)"
                            />

                            <FormField
                                type="select"
                                id="status"
                                label="Status"
                                required
                                value={data.status}
                                onChange={(value: string) =>
                                    setData('status', value)
                                }
                                error={errors.status}
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' },
                                ]}
                            />

                            <div className="md:col-span-2">
                                <FormField
                                    type="textarea"
                                    id="description"
                                    label="Description"
                                    value={data.description}
                                    onChange={(value: string) =>
                                        setData('description', value)
                                    }
                                    error={errors.description}
                                    placeholder="Enter department description (optional)"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </InfoCard>

                    <FormActions
                        onReset={handleReset}
                        submitLabel="Create"
                        processing={processing}
                        disabled={!isFormValid}
                    />
                </form>
            </div>
        </AppLayout>
    );
}
