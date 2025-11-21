import {
    FormActions,
    FormField,
    InfoCard,
    PageHeader,
} from '@/components/common';
import AppLayout from '@/layouts/app-layout';
import {
    create as branchesCreate,
    index as branchesIndex,
    store as branchesStore,
} from '@/routes/branches';
import { type BreadcrumbItem } from '@/types';
import {
    type BranchOption,
    type BranchType,
    type Employee,
} from '@/types/branch';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { toast } from 'sonner';

interface Props {
    employees: Employee[];
    branches: BranchOption[];
    branchTypes: BranchType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Branches',
        href: branchesIndex().url,
    },
    {
        title: 'Create Branch',
        href: branchesCreate().url,
    },
];

export default function Create({ employees, branches, branchTypes }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            code: '',
            type: '',
            description: '',
            parent_id: '',
            manager_id: '',
            status: 'active',
        });

    const isFormValid = useMemo(() => {
        return (
            data.name.trim() !== '' &&
            data.code.trim() !== '' &&
            data.type !== '' &&
            data.status !== ''
        );
    }, [data.name, data.code, data.type, data.status]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(branchesStore().url, {
            onSuccess: () => {
                toast.success(
                    'Branch created successfully! Redirecting to complete profile...',
                );
            },
            onError: () => {
                toast.error('Failed to create branch. Please try again.');
            },
        });
    };

    const handleReset = () => {
        reset();
        clearErrors();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Branch" />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto p-4">
                <PageHeader
                    title="Create Branch"
                    description="Add a new branch with basic information. You'll be able to complete the full profile after creation."
                    backUrl={branchesIndex().url}
                    backLabel="Cancel"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InfoCard
                        title="Branch Information"
                        className="rounded-xl border border-sidebar-border/70 p-6"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                                type="text"
                                id="name"
                                label="Branch Name"
                                value={data.name}
                                onChange={(value: string) =>
                                    setData('name', value)
                                }
                                error={errors.name}
                                required
                                placeholder="Enter branch name (e.g., Headquarters)"
                            />

                            <FormField
                                type="text"
                                id="code"
                                label="Branch Code"
                                value={data.code}
                                onChange={(value: string) =>
                                    setData('code', value)
                                }
                                error={errors.code}
                                required
                                placeholder="Enter branch code (e.g., HQ001)"
                            />

                            <FormField
                                type="select"
                                id="type"
                                label="Branch Type"
                                required
                                value={data.type}
                                onChange={(value: string) =>
                                    setData('type', value)
                                }
                                error={errors.type}
                                options={branchTypes}
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
                                    {
                                        value: 'under_construction',
                                        label: 'Under Construction',
                                    },
                                    { value: 'closed', label: 'Closed' },
                                ]}
                            />

                            <FormField
                                type="combobox"
                                id="parent_id"
                                label="Parent Branch"
                                value={data.parent_id}
                                onChange={(value: string) =>
                                    setData('parent_id', value)
                                }
                                error={errors.parent_id}
                                options={branches.map((branch) => ({
                                    value: branch.id,
                                    label: `${branch.name} (${branch.code})`,
                                }))}
                                searchPlaceholder="Search parent branch..."
                                emptyText="No branches found."
                            />

                            <FormField
                                type="combobox"
                                id="manager_id"
                                label="Branch Manager"
                                value={data.manager_id}
                                onChange={(value: string) =>
                                    setData('manager_id', value)
                                }
                                error={errors.manager_id}
                                options={employees.map((employee) => ({
                                    value: employee.id,
                                    label: `${employee.first_name} ${employee.last_name} (${employee.employee_code})`,
                                }))}
                                searchPlaceholder="Search managers..."
                                emptyText="No employees found."
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
                                    placeholder="Enter branch description (optional)"
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
