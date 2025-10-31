import { InfoCard } from '@/components/common';
import { FormActions } from '@/components/common/FormActions';
import { PageHeader } from '@/components/common/PageHeader';
import EmploymentTypeForm from '@/components/modules/employee/EmploymentTypeEditForm';
import AppLayout from '@/layouts/app-layout';
import {
    edit as employmentTypesEdit,
    index as employmentTypesIndex,
    update as employmentTypesUpdate,
} from '@/routes/employment-types/index';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { toast } from 'sonner';

interface EmploymentType {
    id: string;
    name: string;
    code: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    employmentType: EmploymentType;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: '/dashboard/hr/employee',
    },
    {
        title: 'Employment Types',
        href: employmentTypesIndex().url,
    },
    {
        title: 'Edit Employment Type',
        href: employmentTypesEdit('').url,
    },
];

export default function Edit({ employmentType }: Props) {
    const { data, setData, put, processing, errors, clearErrors } = useForm({
        name: employmentType.name,
        code: employmentType.code,
        description: employmentType.description || '',
        is_active: employmentType.is_active ? '1' : '0',
    });

    // Check if form has changes
    const hasChanges = useMemo(() => {
        return (
            data.name !== employmentType.name ||
            data.code !== employmentType.code ||
            data.description !== (employmentType.description || '') ||
            data.is_active !== (employmentType.is_active ? '1' : '0')
        );
    }, [data, employmentType]);

    const handleReset = () => {
        setData({
            name: employmentType.name,
            code: employmentType.code,
            description: employmentType.description || '',
            is_active: employmentType.is_active ? '1' : '0',
        });
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(employmentTypesUpdate(employmentType.id).url, {
            onSuccess: () => {
                toast.success('Employment type updated successfully!');
            },
            onError: () => {
                toast.error(
                    'Failed to update employment type. Please try again.',
                );
            },
        });
    };

    // Update breadcrumb with actual employment type name
    breadcrumbs[2] = {
        title: `Edit ${employmentType.name}`,
        href: employmentTypesEdit(employmentType.id).url,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${employmentType.name}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title="Edit Employment Type"
                    description={
                        <>
                            Update details for employment type{' '}
                            <span className="font-bold">
                                {employmentType.name}
                            </span>
                        </>
                    }
                    backUrl={employmentTypesIndex().url}
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InfoCard title="Employment Type Details">
                        <EmploymentTypeForm
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </InfoCard>

                    <FormActions
                        onReset={handleReset}
                        submitLabel="Update"
                        processing={processing}
                        disabled={!hasChanges}
                    />
                </form>
            </div>
        </AppLayout>
    );
}
