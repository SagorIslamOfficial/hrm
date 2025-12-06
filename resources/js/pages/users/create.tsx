import {
    FormActions,
    FormField,
    InfoCard,
    PageHeader,
} from '@/components/common';
import { type Role, type UnlinkedEmployee } from '@/components/modules/user';
import { StatusEdit } from '@/components/modules/user/edit';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import {
    create as usersCreate,
    index as usersIndex,
    store as usersStore,
} from '@/routes/users/index';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Info } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';

interface Props {
    roles: Role[];
    employees: UnlinkedEmployee[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: usersIndex().url,
    },
    {
        title: 'Create User',
        href: usersCreate().url,
    },
];

export default function Create({ roles, employees }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: '',
            employee_id: '',
            status: 'active',
            send_welcome_email: true,
        });

    const isFormValid = useMemo(() => {
        return (
            data.name.trim() !== '' &&
            data.email.trim() !== '' &&
            data.password.trim() !== '' &&
            data.password === data.password_confirmation &&
            data.role.trim() !== ''
        );
    }, [
        data.name,
        data.email,
        data.password,
        data.password_confirmation,
        data.role,
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(usersStore().url, {
            onSuccess: () => {
                toast.success('User created successfully!');
            },
            onError: () => {
                toast.error('Failed to create user. Please try again.');
            },
        });
    };

    const handleReset = () => {
        reset();
        clearErrors();
    };

    const employeeOptions = employees.map((emp) => ({
        value: emp.id,
        label: `${emp.first_name} ${emp.last_name} (${emp.employee_code})`,
    }));

    const handleEmployeeChange = (value: string) => {
        const actualValue = value === 'none' ? '' : value;
        setData('employee_id', actualValue);

        // Auto-populate name, email, and status from selected employee
        if (actualValue) {
            const selectedEmployee = employees.find(
                (emp) => emp.id === actualValue,
            );
            if (selectedEmployee) {
                const employeeName = `${selectedEmployee.first_name} ${selectedEmployee.last_name}`;
                const status = selectedEmployee.employment_status || 'active';
                setData('name', employeeName);
                setData('email', selectedEmployee.email);
                setData('status', status);
                toast.info(
                    `Auto-populated from employee: ${employeeName} (${selectedEmployee.email}) (${status})`,
                );
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto p-4">
                <PageHeader
                    title="Create User"
                    description="Add a new system user with login credentials and permissions."
                    backUrl={usersIndex().url}
                    backLabel="Cancel"
                />

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 rounded-xl border border-sidebar-border/40 px-10 py-10 shadow-none lg:grid-cols-2">
                        {/* Basic Information */}
                        <InfoCard title="Basic Information">
                            <div className="grid gap-4">
                                <FormField
                                    id="name"
                                    label="Full Name"
                                    type="text"
                                    value={data.name}
                                    onChange={(value) => setData('name', value)}
                                    error={errors.name}
                                    required
                                    placeholder="Enter full name"
                                />

                                <FormField
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    value={data.email}
                                    onChange={(value) =>
                                        setData('email', value)
                                    }
                                    error={errors.email}
                                    required
                                    placeholder="Enter email address"
                                />
                            </div>
                        </InfoCard>

                        {/* Password */}
                        <InfoCard title="Password">
                            <div className="grid gap-4">
                                <FormField
                                    id="password"
                                    label="Password"
                                    type="password"
                                    value={data.password}
                                    onChange={(value) =>
                                        setData('password', value)
                                    }
                                    error={errors.password}
                                    required
                                    placeholder="Enter password"
                                />

                                <FormField
                                    id="password_confirmation"
                                    label="Confirm Password"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(value) =>
                                        setData('password_confirmation', value)
                                    }
                                    error={errors.password_confirmation}
                                    required
                                    placeholder="Confirm password"
                                />

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="send_welcome_email"
                                        checked={data.send_welcome_email}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                'send_welcome_email',
                                                checked === true,
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor="send_welcome_email"
                                        className="text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        Send welcome email with login
                                        credentials
                                    </label>
                                </div>
                            </div>
                        </InfoCard>

                        {/* Role & Status */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <InfoCard title="Role & Permissions">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Select a role for this user
                                    </p>
                                    <FormField
                                        id="role"
                                        label="Role"
                                        type="select"
                                        value={data.role}
                                        onChange={(value) =>
                                            setData('role', value)
                                        }
                                        error={errors.role}
                                        required
                                        options={roles.map((role) => ({
                                            value: role.name,
                                            label: role.name,
                                        }))}
                                    />
                                </div>
                            </InfoCard>

                            <StatusEdit
                                status={data.status}
                                onStatusChange={(status) =>
                                    setData('status', status)
                                }
                            />
                        </div>

                        {/* Link Employee */}
                        <InfoCard title="Link to Employee (Optional)">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground">
                                        Optionally link this user to an existing
                                        employee record
                                    </p>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                className="max-w-xs"
                                            >
                                                When you select an employee, the
                                                employee name and email address
                                                will automatically replace the
                                                current name and email address.
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <FormField
                                    id="employee_id"
                                    label="Employee"
                                    type="combobox"
                                    value={data.employee_id}
                                    onChange={handleEmployeeChange}
                                    error={errors.employee_id}
                                    options={[
                                        {
                                            value: 'none',
                                            label: 'No employee link',
                                        },
                                        ...employeeOptions,
                                    ]}
                                />
                            </div>
                        </InfoCard>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-6">
                        <FormActions
                            submitting={processing}
                            disabled={!isFormValid}
                            onReset={handleReset}
                            submitLabel="Create"
                            resetLabel="Reset"
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
