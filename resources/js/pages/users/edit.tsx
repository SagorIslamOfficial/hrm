import { PageHeader } from '@/components/common';
import {
    type Role,
    type UnlinkedEmployee,
    type User,
    UserEditForm,
} from '@/components/modules/user';
import AppLayout from '@/layouts/app-layout';
import {
    edit as usersEdit,
    index as usersIndex,
    show as usersShow,
    update as usersUpdate,
} from '@/routes/users/index';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Props {
    user: User;
    roles: Role[];
    employees: UnlinkedEmployee[];
}

export default function Edit({ user, roles, employees }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: usersIndex().url,
        },
        {
            title: user.name,
            href: usersShow(user.id).url,
        },
        {
            title: 'Edit',
            href: usersEdit(user.id).url,
        },
    ];

    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            role: user.roles[0]?.name || '',
            employee_id: user.employee_id || '',
            status: user.status || 'active',
        });

    // Update form when user prop changes
    useEffect(() => {
        setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            role: user.roles[0]?.name || '',
            employee_id: user.employee_id || '',
            status: user.status || 'active',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.id]);

    const handleDataChange = (field: string, value: string) => {
        setData(
            field as
                | 'name'
                | 'email'
                | 'password'
                | 'password_confirmation'
                | 'role'
                | 'employee_id'
                | 'status',
            value,
        );
    };

    const handleSubmit = () => {
        put(usersUpdate(user.id).url, {
            onSuccess: () => {
                toast.success('User updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update user. Please try again.');
            },
        });
    };

    const handleReset = () => {
        reset();
        clearErrors();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User - ${user.name}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto p-4">
                <PageHeader
                    title={`Edit User: ${user.name}`}
                    description="Update user information, roles, and employee link."
                    backUrl={usersShow(user.id).url}
                    backLabel="Cancel"
                />

                <UserEditForm
                    roles={roles}
                    employees={employees}
                    processing={processing}
                    errors={errors}
                    data={data}
                    initialData={{
                        name: user.name,
                        email: user.email,
                        password: '',
                        password_confirmation: '',
                        role: user.roles[0]?.name || '',
                        employee_id: user.employee_id || '',
                        status: user.status || 'active',
                    }}
                    onDataChange={handleDataChange}
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                />
            </div>
        </AppLayout>
    );
}
