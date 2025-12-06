import { Head, useForm } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';

import { FormActions, FormField, InfoCard } from '@/components/common';
import HeadingSmall from '@/components/heading-small';
import {
    edit as editUserSystem,
    update as updateUserSystem,
} from '@/routes/user-system';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User System settings',
        href: editUserSystem().url,
    },
];

interface UserSystemSettings {
    user: {
        auto_create_for_employee: 'disabled' | 'with_invite' | 'manual';
        password: {
            generated_length: number;
            send_reset_link: boolean;
        };
        email_sync_source: 'user' | 'employee' | 'first_created';
        default_role: {
            for_employee: string;
        };
    };
}

interface Props {
    settings: UserSystemSettings;
    roles: string[];
}

export default function UserSystem({ settings, roles }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        user: {
            auto_create_for_employee: settings.user.auto_create_for_employee,
            password: {
                generated_length: settings.user.password.generated_length,
                send_reset_link: settings.user.password.send_reset_link,
            },
            email_sync_source: settings.user.email_sync_source,
            default_role: {
                for_employee: settings.user.default_role.for_employee,
            },
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(updateUserSystem().url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleReset = useCallback(() => {
        setData({
            user: {
                auto_create_for_employee:
                    settings.user.auto_create_for_employee,
                password: {
                    generated_length: settings.user.password.generated_length,
                    send_reset_link: settings.user.password.send_reset_link,
                },
                email_sync_source: settings.user.email_sync_source,
                default_role: {
                    for_employee: settings.user.default_role.for_employee,
                },
            },
        });
    }, [settings, setData]);

    const isFormDirty = useMemo(() => {
        return (
            JSON.stringify(data) !==
            JSON.stringify({
                user: {
                    auto_create_for_employee:
                        settings.user.auto_create_for_employee,
                    password: {
                        generated_length:
                            settings.user.password.generated_length,
                        send_reset_link: settings.user.password.send_reset_link,
                    },
                    email_sync_source: settings.user.email_sync_source,
                    default_role: {
                        for_employee: settings.user.default_role.for_employee,
                    },
                },
            })
        );
    }, [data, settings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User System settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="User System settings"
                        description="Configure user system-wide and employee settings"
                    />

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* User Creation Settings */}
                        <InfoCard title="User Creation">
                            <div className="space-y-4">
                                <FormField
                                    type="select"
                                    id="auto_create_for_employee"
                                    label="Auto-create user for employee"
                                    value={data.user.auto_create_for_employee}
                                    onChange={(value: string) =>
                                        setData('user', {
                                            ...data.user,
                                            auto_create_for_employee: value as
                                                | 'disabled'
                                                | 'with_invite'
                                                | 'manual',
                                        })
                                    }
                                    error={
                                        errors['user.auto_create_for_employee']
                                    }
                                    options={[
                                        {
                                            value: 'disabled',
                                            label: 'Disabled - Create users manually',
                                        },
                                        {
                                            value: 'with_invite',
                                            label: 'With invite - Auto-create and send invite email',
                                        },
                                        {
                                            value: 'manual',
                                            label: 'Manual - Show toggle during employee creation',
                                        },
                                    ]}
                                    helperText="Configure whether a user account is automatically created when adding a new employee."
                                />

                                <FormField
                                    type="select"
                                    id="default_role"
                                    label="Default role for employee users"
                                    value={data.user.default_role.for_employee}
                                    onChange={(value: string) =>
                                        setData('user', {
                                            ...data.user,
                                            default_role: {
                                                for_employee: value,
                                            },
                                        })
                                    }
                                    error={
                                        errors['user.default_role.for_employee']
                                    }
                                    options={roles.map((role) => ({
                                        value: role,
                                        label: role,
                                    }))}
                                />
                            </div>
                        </InfoCard>

                        {/* Password Settings */}
                        <InfoCard title="Password Settings">
                            <div className="space-y-4">
                                <FormField
                                    type="number"
                                    id="generated_length"
                                    label="Generated password length"
                                    value={data.user.password.generated_length}
                                    onChange={(value) =>
                                        setData('user', {
                                            ...data.user,
                                            password: {
                                                ...data.user.password,
                                                generated_length:
                                                    parseInt(String(value)) ||
                                                    12,
                                            },
                                        })
                                    }
                                    error={
                                        errors['user.password.generated_length']
                                    }
                                    min={8}
                                    max={32}
                                />

                                <FormField
                                    type="checkbox"
                                    id="send_reset_link"
                                    label="Send password reset link"
                                    value={data.user.password.send_reset_link}
                                    onChange={(value) =>
                                        setData('user', {
                                            ...data.user,
                                            password: {
                                                ...data.user.password,
                                                send_reset_link: value === true,
                                            },
                                        })
                                    }
                                    helperText="Include a password reset link in the welcome email"
                                />
                            </div>
                        </InfoCard>

                        {/* Email Sync Settings */}
                        <InfoCard title="Email Synchronization">
                            <FormField
                                type="select"
                                id="email_sync_source"
                                label="Email sync source"
                                value={data.user.email_sync_source}
                                onChange={(value: string) =>
                                    setData('user', {
                                        ...data.user,
                                        email_sync_source: value as
                                            | 'user'
                                            | 'employee'
                                            | 'first_created',
                                    })
                                }
                                error={errors['user.email_sync_source']}
                                options={[
                                    {
                                        value: 'user',
                                        label: 'User - User email is the source of truth',
                                    },
                                    {
                                        value: 'employee',
                                        label: 'Employee - Employee email is the source of truth',
                                    },
                                    {
                                        value: 'first_created',
                                        label: 'First created - Whichever was created first wins',
                                    },
                                ]}
                                helperText="When a user and employee are linked, which email address should be considered the primary source."
                            />
                        </InfoCard>

                        <FormActions
                            submitting={processing}
                            disabled={!isFormDirty || processing}
                            onReset={handleReset}
                            submitLabel="Save settings"
                            resetLabel="Reset"
                        />
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
