import {
    CategorySelector,
    CheckboxGroup,
    FormField,
    InfoCard,
} from '@/components/common';
import { PageProps } from '@/types';
import { PriorityOption } from '@/types/complaint';
import { usePage } from '@inertiajs/react';

interface BasicEditProps {
    data: {
        title: string;
        categories: string[];
        priority: string;
        department_id?: string;
        assigned_to?: string;
        incident_date?: string;
        incident_location?: string;
        brief_description: string;
        is_anonymous?: boolean;
        is_confidential?: boolean;
        is_recurring?: boolean;
    };
    errors: Record<string, string>;
    setData: (key: string, value: unknown) => void;
    predefinedCategories?: string[];
    priorities?: PriorityOption[];
    assignees?: { value: string; label: string }[];
}

export default function BasicEdit({
    data,
    errors,
    setData,
    predefinedCategories = [],
    priorities = [],
    assignees = [],
}: BasicEditProps) {
    const { auth } = usePage<PageProps>().props;
    const canEditPriority = auth.user.roles.some((role: string) =>
        ['Admin', 'HR'].includes(role),
    );

    return (
        <>
            <InfoCard title="Basic Information">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        type="text"
                        id="title"
                        label="Complaint Title"
                        value={data.title || ''}
                        onChange={(value: string) => setData('title', value)}
                        error={errors.title}
                        required
                        placeholder="Brief title describing the complaint"
                    />

                    {canEditPriority && (
                        <FormField
                            type="select"
                            id="priority"
                            label="Priority"
                            value={data.priority || ''}
                            onChange={(value: string) =>
                                setData('priority', value)
                            }
                            error={errors.priority}
                            options={priorities}
                        />
                    )}
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-3">
                    <FormField
                        type="date"
                        id="incident_date"
                        label="Incident Date"
                        value={data.incident_date || ''}
                        onChange={(value: string) =>
                            setData('incident_date', value)
                        }
                        error={errors.incident_date}
                    />

                    <FormField
                        type="text"
                        id="incident_location"
                        label="Incident Location"
                        value={data.incident_location || ''}
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
                        value={data.assigned_to || ''}
                        onChange={(value: string) =>
                            setData('assigned_to', value)
                        }
                        error={errors.assigned_to}
                        options={assignees}
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
                            value: !!data.is_anonymous,
                        },
                        {
                            key: 'is_confidential',
                            label: 'Confidential',
                            description:
                                'Restrict access to authorized personnel only.',
                            value: !!data.is_confidential,
                        },
                        {
                            key: 'is_recurring',
                            label: 'Recurring Issue',
                            description:
                                'This issue has happened multiple times.',
                            value: !!data.is_recurring,
                        },
                    ]}
                    onChange={(key, value) => setData(key, value)}
                    columns={3}
                />

                <FormField
                    type="textarea"
                    className="mt-6"
                    id="brief_description"
                    label="Brief Description"
                    value={data.brief_description || ''}
                    onChange={(value: string) =>
                        setData('brief_description', value)
                    }
                    error={errors.brief_description}
                    placeholder="Provide a brief summary of the complaint"
                    rows={3}
                    required
                />
            </InfoCard>
        </>
    );
}
