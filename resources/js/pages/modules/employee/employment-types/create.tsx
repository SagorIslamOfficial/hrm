import { FormActions, InfoCard, PageHeader } from '@/components/common';
import EmploymentTypeEditForm from '@/components/modules/employee/EmploymentTypeEditForm';
import AppLayout from '@/layouts/app-layout';
import {
    create as employmentTypesCreate,
    index as employmentTypesIndex,
    store as employmentTypesStore,
} from '@/routes/employment-types/index';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { toast } from 'sonner';

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
        title: 'Create Employment Type',
        href: employmentTypesCreate().url,
    },
];

export default function Create() {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            code: '',
            description: '',
            is_active: '1',
        });

    // Check if required fields are filled
    const isFormValid = useMemo(() => {
        return data.name.trim() !== '' && data.code.trim() !== '';
    }, [data.name, data.code]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(employmentTypesStore().url, {
            onSuccess: () => {
                toast.success('Employment type created successfully!');
                reset();
                clearErrors();
            },
            onError: () => {
                toast.error(
                    'Failed to create employment type. Please try again.',
                );
            },
        });
    };

    const handleReset = () => {
        reset();
        clearErrors();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Employment Type" />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title="Create Employment Type"
                    description="Add a new employment type to the system"
                    backUrl={employmentTypesIndex().url}
                    backLabel="Cancel"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InfoCard
                        title="Employment Type Details"
                        className="rounded-xl border border-sidebar-border/70 p-6"
                    >
                        <EmploymentTypeEditForm
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
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
