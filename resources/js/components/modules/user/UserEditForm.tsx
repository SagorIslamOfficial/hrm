import { FormActions } from '@/components/common';
import { type Role, type UnlinkedEmployee } from '@/components/modules/user';
import { useMemo } from 'react';
import {
    BasicEdit,
    EmployeeEdit,
    PasswordEdit,
    RoleEdit,
    StatusEdit,
} from './edit';

interface UserEditFormProps {
    roles: Role[];
    employees: UnlinkedEmployee[];
    processing: boolean;
    errors: Record<string, string>;
    data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        role: string;
        employee_id: string;
        status: string;
    };
    initialData: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        role: string;
        employee_id: string;
        status: string;
    };
    onDataChange: (field: string, value: string) => void;
    onSubmit: () => void;
    onReset: () => void;
}

export function UserEditForm({
    roles,
    employees,
    processing,
    errors,
    data,
    initialData,
    onDataChange,
    onSubmit,
    onReset,
}: UserEditFormProps) {
    const isFormValid = useMemo(() => {
        const passwordValid =
            data.password === '' ||
            (data.password.length >= 8 &&
                data.password === data.password_confirmation);
        return (
            data.name.trim() !== '' &&
            data.email.trim() !== '' &&
            passwordValid &&
            data.role.trim() !== ''
        );
    }, [
        data.name,
        data.email,
        data.password,
        data.password_confirmation,
        data.role,
    ]);

    const hasChanges = useMemo(() => {
        return (
            data.name !== initialData.name ||
            data.email !== initialData.email ||
            data.password !== initialData.password ||
            data.password_confirmation !== initialData.password_confirmation ||
            data.role !== initialData.role ||
            data.employee_id !== initialData.employee_id ||
            data.status !== initialData.status
        );
    }, [data, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 rounded-xl border border-sidebar-border/70 p-6 lg:grid-cols-2">
                    <BasicEdit
                        data={data}
                        errors={errors}
                        onDataChange={onDataChange}
                    />

                    <PasswordEdit
                        data={data}
                        errors={errors}
                        onDataChange={onDataChange}
                    />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <RoleEdit
                            data={data}
                            errors={errors}
                            roles={roles}
                            onDataChange={onDataChange}
                        />

                        <StatusEdit
                            status={data.status}
                            onStatusChange={(status) =>
                                onDataChange('status', status)
                            }
                        />
                    </div>

                    <EmployeeEdit
                        data={data}
                        errors={errors}
                        employees={employees}
                        onDataChange={onDataChange}
                    />
                </div>

                {/* Form Actions */}
                <div className="mt-6">
                    <FormActions
                        submitting={processing}
                        disabled={!isFormValid || !hasChanges}
                        onReset={onReset}
                        submitLabel="Update"
                        resetLabel="Reset"
                    />
                </div>
            </form>
        </>
    );
}
