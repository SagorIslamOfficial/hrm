import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import {
    create as employeesCreate,
    index as employeesIndex,
    store as employeesStore,
} from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Upload, UserPlus } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { toast } from 'sonner';

interface Props {
    departments: Array<{ id: string; name: string }>;
    designations: Array<{ id: string; title: string }>;
    employmentTypes: Array<{ code: string; name: string }>;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: employeesIndex().url,
    },
    {
        title: 'Create Employee',
        href: employeesCreate().url,
    },
];

export default function Create({
    departments,
    designations,
    employmentTypes,
    auth,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Get first employment type as default
    const defaultEmploymentType =
        employmentTypes.length > 0 ? employmentTypes[0].code : '';

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            employee_code: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            photo: null as File | null,
            department_id: '',
            designation_id: '',
            employment_status: 'active',
            employment_type: defaultEmploymentType,
            joining_date: today,
        });

    // Check if all required fields are filled
    const isFormValid = useMemo(() => {
        return (
            data.employee_code.trim() !== '' &&
            data.first_name.trim() !== '' &&
            data.last_name.trim() !== '' &&
            data.email.trim() !== '' &&
            data.department_id !== '' &&
            data.designation_id !== '' &&
            data.employment_status !== '' &&
            data.employment_type !== '' &&
            data.joining_date !== ''
        );
    }, [
        data.employee_code,
        data.first_name,
        data.last_name,
        data.email,
        data.department_id,
        data.designation_id,
        data.employment_status,
        data.employment_type,
        data.joining_date,
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(employeesStore().url, {
            onSuccess: () => {
                toast.success(
                    'Employee created successfully! Redirecting to complete profile...',
                );
            },
            onError: () => {
                toast.error('Failed to create employee. Please try again.');
            },
        });
    };

    const handleReset = () => {
        reset();
        clearErrors();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Employee" />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title="Create Employee"
                    description="Add a new employee with basic information. You'll be able to complete their full profile after creation."
                    backUrl={employeesIndex().url}
                    backLabel="Cancel"
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="size-5" />
                            Employee Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="employee_code">
                                        Employee Code *
                                    </Label>
                                    <Input
                                        id="employee_code"
                                        value={data.employee_code}
                                        onChange={(e) =>
                                            setData(
                                                'employee_code',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter employee code"
                                        required
                                    />
                                    {errors.employee_code && (
                                        <p className="text-sm text-destructive">
                                            {errors.employee_code}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="created_by">
                                        Created By *
                                    </Label>
                                    <Input
                                        id="created_by"
                                        value={
                                            auth?.user?.name || 'Current User'
                                        }
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="first_name">
                                        First Name *
                                    </Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter first name"
                                        required
                                    />
                                    {errors.first_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.first_name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="last_name">
                                        Last Name *
                                    </Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                        placeholder="Enter last name"
                                        required
                                    />
                                    {errors.last_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="Enter email address"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        placeholder="Enter phone number"
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-destructive">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="photo">Photo</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            ref={fileInputRef}
                                            id="photo"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0] || null;
                                                setData('photo', file);
                                            }}
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            <Upload className="size-4" />
                                            {data.photo
                                                ? 'Change Photo'
                                                : 'Upload Photo'}
                                        </Button>
                                        {data.photo && (
                                            <span className="text-sm text-muted-foreground">
                                                {data.photo.name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Upload a profile photo (max 2MB,
                                        JPEG/PNG/WebP)
                                    </p>
                                    {errors.photo && (
                                        <p className="text-sm text-destructive">
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department_id">
                                        Department *
                                    </Label>
                                    <Select
                                        value={data.department_id}
                                        onValueChange={(value) =>
                                            setData('department_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((department) => (
                                                <SelectItem
                                                    key={department.id}
                                                    value={department.id}
                                                >
                                                    {department.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.department_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.department_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="designation_id">
                                        Designation *
                                    </Label>
                                    <Select
                                        value={data.designation_id}
                                        onValueChange={(value) =>
                                            setData('designation_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select designation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {designations.map((designation) => (
                                                <SelectItem
                                                    key={designation.id}
                                                    value={designation.id}
                                                >
                                                    {designation.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.designation_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.designation_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employment_status">
                                        Employment Status *
                                    </Label>
                                    <Select
                                        value={data.employment_status}
                                        onValueChange={(value) =>
                                            setData('employment_status', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="inactive">
                                                Inactive
                                            </SelectItem>
                                            <SelectItem value="terminated">
                                                Terminated
                                            </SelectItem>
                                            <SelectItem value="on_leave">
                                                On Leave
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.employment_status && (
                                        <p className="text-sm text-destructive">
                                            {errors.employment_status}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employment_type">
                                        Employment Type *
                                    </Label>
                                    <Select
                                        value={data.employment_type}
                                        onValueChange={(value) =>
                                            setData('employment_type', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employmentTypes.map((type) => (
                                                <SelectItem
                                                    key={type.code}
                                                    value={type.code}
                                                >
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.employment_type && (
                                        <p className="text-sm text-destructive">
                                            {errors.employment_type}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="joining_date">
                                        Joining Date *
                                    </Label>
                                    <Input
                                        id="joining_date"
                                        type="date"
                                        value={data.joining_date}
                                        onChange={(e) =>
                                            setData(
                                                'joining_date',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {errors.joining_date && (
                                        <p className="text-sm text-destructive">
                                            {errors.joining_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    disabled={processing}
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !isFormValid}
                                >
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Employee'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
