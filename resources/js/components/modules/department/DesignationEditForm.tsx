import { FormActions, FormField, InfoCard } from '@/components/common';
import { update as designationsUpdate } from '@/routes/designations/index';
import { useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { toast } from 'sonner';

interface Department {
    id: string;
    name: string;
}

interface Designation {
    id: string;
    title: string;
    code: string;
    description?: string;
    department_id?: string;
    is_active: boolean;
}

interface DesignationEditFormProps {
    designation: Designation;
    departments: Department[];
    className?: string;
}

export function DesignationEditForm({
    designation,
    departments,
    className,
}: DesignationEditFormProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm({
            title: designation.title,
            code: designation.code,
            description: designation.description || '',
            department_id: designation.department_id || '',
            is_active: designation.is_active,
        });

    const isFormValid = useMemo(() => {
        return data.title.trim() !== '' && data.code.trim() !== '';
    }, [data.title, data.code]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(designationsUpdate(designation.id).url, {
            onSuccess: () => {
                toast.success('Designation updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update designation. Please try again.');
            },
        });
    };

    const handleReset = () => {
        reset();
        clearErrors();
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
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
                        onChange={(value: string) => setData('title', value)}
                        error={errors.title}
                        required
                        placeholder="Enter designation title (e.g., Senior Developer)"
                    />

                    <FormField
                        type="text"
                        id="code"
                        label="Designation Code"
                        value={data.code}
                        onChange={(value: string) => setData('code', value)}
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
                submitLabel="Update"
                processing={processing}
                disabled={!isFormValid}
            />
        </form>
    );
}
