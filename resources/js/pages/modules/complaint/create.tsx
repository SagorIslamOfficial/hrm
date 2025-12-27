import {
    CategorySelector,
    CheckboxGroup,
    FormActions,
    FormField,
    InfoCard,
    PageHeader,
} from '@/components/common';
import AppLayout from '@/layouts/app-layout';
import {
    create as complaintsCreate,
    index as complaintsIndex,
    store as complaintsStore,
} from '@/routes/complaints';
import type { BreadcrumbItem } from '@/types';
import type { PriorityOption } from '@/types/complaint';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { toast } from 'sonner';

interface Assignee {
    value: string;
    label: string;
}

interface CreateProps {
    predefinedCategories: string[];
    priorities: PriorityOption[];
    assignees: Assignee[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Complaints',
        href: complaintsIndex().url,
    },
    {
        title: 'Create Complaint',
        href: complaintsCreate().url,
    },
];

export default function Create({
    predefinedCategories,
    priorities,
    assignees,
}: CreateProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            title: '',
            categories: [] as string[],
            priority:
                priorities.find((p) => p.value === 'medium')?.value ||
                priorities[0]?.value ||
                'medium',
            incident_date: '',
            incident_location: '',
            brief_description: '',
            assigned_to: '',
            is_anonymous: false,
            is_confidential: true,
            is_recurring: false,
            employee_id: '',
        });

    const isFormValid = useMemo(() => {
        return (
            data.title.trim() !== '' &&
            data.categories.length > 0 &&
            data.brief_description.trim() !== '' &&
            data.assigned_to.trim() !== '' &&
            data.incident_date.trim() !== ''
        );
    }, [
        data.title,
        data.categories,
        data.brief_description,
        data.assigned_to,
        data.incident_date,
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(complaintsStore().url, {
            onSuccess: () => {
                toast.success(
                    'Complaint created successfully! Redirecting to complete details...',
                );
            },
            onError: (validationErrors) => {
                // Show all validation errors as toasts
                Object.entries(validationErrors).forEach(([, message]) => {
                    if (typeof message === 'string') {
                        toast.error(message);
                    }
                });
            },
        });
    };

    const handleReset = () => {
        reset();
        clearErrors();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Complaint" />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto p-4">
                <PageHeader
                    title="Create Complaint"
                    description="File a new complaint with basic information. You'll be able to complete the full details after creation."
                    backUrl={complaintsIndex().url}
                    backLabel="Cancel"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InfoCard title="Basic Information">
                        <div className="mb-6 grid gap-6 md:grid-cols-2">
                            <FormField
                                type="text"
                                id="title"
                                label="Complaint Title"
                                value={data.title}
                                onChange={(value: string) =>
                                    setData('title', value)
                                }
                                error={errors.title}
                                required
                                placeholder="Brief title describing the complaint"
                            />

                            <FormField
                                type="select"
                                id="priority"
                                label="Priority"
                                value={data.priority}
                                onChange={(value: string) =>
                                    setData('priority', value)
                                }
                                error={errors.priority}
                                options={priorities}
                                required
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <FormField
                                type="date"
                                id="incident_date"
                                label="Incident Date"
                                value={data.incident_date}
                                onChange={(value: string) =>
                                    setData('incident_date', value)
                                }
                                error={errors.incident_date}
                                required
                            />

                            <FormField
                                type="text"
                                id="incident_location"
                                label="Incident Location"
                                value={data.incident_location}
                                onChange={(value: string) =>
                                    setData('incident_location', value)
                                }
                                error={errors.incident_location}
                                placeholder="Where did the incident occur?"
                            />

                            <FormField
                                type="select"
                                id="assigned_to"
                                label="Assign To"
                                value={data.assigned_to}
                                onChange={(value: string) =>
                                    setData('assigned_to', value)
                                }
                                error={errors.assigned_to}
                                options={assignees}
                                required
                            />
                        </div>

                        <CategorySelector
                            categories={data.categories}
                            onCategoriesChange={(categories) =>
                                setData('categories', categories)
                            }
                            predefinedCategories={predefinedCategories}
                            error={errors.categories}
                            required
                        />

                        <CheckboxGroup
                            title="Privacy Options"
                            items={[
                                {
                                    key: 'is_anonymous',
                                    label: 'Anonymous Complaint',
                                    description:
                                        'Your identity will be hidden from the investigation.',
                                    value: data.is_anonymous,
                                },
                                {
                                    key: 'is_confidential',
                                    label: 'Confidential',
                                    description:
                                        'Restrict access to authorized personnel only.',
                                    value: data.is_confidential,
                                },
                                {
                                    key: 'is_recurring',
                                    label: 'Recurring Issue',
                                    description:
                                        'This issue has happened multiple times.',
                                    value: data.is_recurring,
                                },
                            ]}
                            onChange={(key, value) => {
                                if (
                                    key === 'is_anonymous' ||
                                    key === 'is_confidential' ||
                                    key === 'is_recurring'
                                ) {
                                    setData(key, value);
                                }
                            }}
                            columns={3}
                        />

                        <div className="mt-6 md:col-span-2">
                            <FormField
                                type="textarea"
                                id="brief_description"
                                label="Brief Description"
                                value={data.brief_description}
                                onChange={(value: string) =>
                                    setData('brief_description', value)
                                }
                                error={errors.brief_description}
                                placeholder="Provide a brief summary of the complaint"
                                rows={3}
                                required
                            />
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
