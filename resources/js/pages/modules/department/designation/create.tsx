import {
    FormActions,
    FormField,
    InfoCard,
    PageHeader,
} from '@/components/common';
import AppLayout from '@/layouts/app-layout';
import {
    create as designationsCreate,
    index as designationsIndex,
    store as designationsStore,
} from '@/routes/designations/index';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { toast } from 'sonner';

interface Department {
    id: string;
    name: string;
}

interface Props {
    departments: Department[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Designations',
        href: designationsIndex().url,
    },
    {
        title: 'Create Designation',
        href: designationsCreate().url,
    },
];

export default function Create({ departments }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            title: '',
            code: '',
            description: '',
            department_id: '',
            is_active: true,
        });

    const isFormValid = useMemo(() => {
        return data.title.trim() !== '' && data.code.trim() !== '';
    }, [data.title, data.code]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(designationsStore().url, {
            onSuccess: () => {
                toast.success('Designation created successfully!');
            },
            onError: () => {
                toast.error('Failed to create designation. Please try again.');
            },
        });
    };

    const handleReset = () => {
        reset();
        clearErrors();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Designation" />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto p-4">
                <PageHeader
                    title="Create Designation"
                    description="Add a new designation with basic information."
                    backUrl={designationsIndex().url}
                    backLabel="Cancel"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InfoCard
                        title="Designation Information"
                        className="rounded-xl border border-sidebar-border/70 p-6"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                                type="text"
                                id="title"
                                label="Designation Title"
                                value={data.title}
                                onChange={(value: string) =>
                                    setData('title', value)
                                }
                                error={errors.title}
                                required
                                placeholder="Enter designation title (e.g., Senior Developer)"
                            />

                            <FormField
                                type="text"
                                id="code"
                                label="Designation Code"
                                value={data.code}
                                onChange={(value: string) =>
                                    setData('code', value)
                                }
                                error={errors.code}
                                required
                                placeholder="Enter designation code (e.g., SD, TL, PM)"
                            />

                            <FormField
                                type="combobox"
                                id="department_id"
                                label="Department"
                                value={data.department_id}
                                onChange={(value: string) =>
                                    setData('department_id', value)
                                }
                                error={errors.department_id}
                                options={departments.map((department) => ({
                                    value: department.id,
                                    label: department.name,
                                }))}
                                searchPlaceholder="Search departments..."
                                emptyText="No departments found."
                            />

                            <FormField
                                type="select"
                                id="is_active"
                                label="Status"
                                required
                                value={data.is_active ? 'true' : 'false'}
                                onChange={(value: string) =>
                                    setData('is_active', value === 'true')
                                }
                                error={errors.is_active}
                                options={[
                                    { value: 'true', label: 'Active' },
                                    { value: 'false', label: 'Inactive' },
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
                                    placeholder="Enter designation description (optional)"
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
