import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import {
    edit as employeesEdit,
    index as employeesIndex,
    show as employeesShow,
} from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    DollarSign,
    Edit,
    FileText,
    Image,
    Phone,
    Plane,
    Settings,
    StickyNote,
    User,
} from 'lucide-react';
import { useState } from 'react';

interface Employee {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    photo: string | null;
    photo_url?: string;
    employment_status: string;
    employment_type: string;
    joining_date: string;
    department: {
        id: string;
        name: string;
        code: string;
    };
    designation: {
        id: string;
        title: string;
        code: string;
    };
    personal_detail?: {
        date_of_birth: string;
        gender: string;
        marital_status: string;
        blood_group: string;
        national_id: string;
        passport_number: string | null;
        address: string;
        city: string;
        country: string;
    };
    job_detail?: {
        job_title: string;
        employment_type: string;
        work_shift: string;
        probation_end_date: string | null;
        contract_end_date: string | null;
    };
    salary_detail?: {
        basic_salary: number;
        allowances: number;
        deductions: number;
        net_salary: number;
        bank_name: string;
        bank_account_number: string;
        bank_branch: string;
        tax_id: string;
    };
    contacts?: Array<{
        id: string;
        contact_name: string;
        relationship: string;
        phone: string;
        email: string | null;
        address: string;
        photo?: string;
        photo_url?: string;
        is_primary: boolean;
    }>;
    documents?: Array<{
        id: string;
        doc_type: string;
        title: string;
        file_name: string;
        file_size: number;
        expiry_date: string | null;
        created_at: string;
    }>;
    notes?: Array<{
        id: string;
        note: string;
        category: string;
        is_private: boolean;
        created_at: string;
        creator: {
            name: string;
        };
    }>;
    attendance?: Array<{
        id: string;
        date: string;
        check_in: string | null;
        check_out: string | null;
        status: string;
        remarks: string | null;
    }>;
    leaves?: Array<{
        id: string;
        leave_type: string;
        start_date: string;
        end_date: string;
        total_days: number;
        status: string;
        reason: string;
    }>;
    custom_fields?: Array<{
        id: string;
        field_key: string;
        field_value: string;
        field_type: string;
        section: string;
    }>;
}

interface Props {
    employee: Employee;
}

export default function Show({ employee }: Props) {
    const [selectedPhoto, setSelectedPhoto] = useState<{
        url: string;
        name: string;
    } | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Employees',
            href: employeesIndex().url,
        },
        {
            title: `${employee.first_name} ${employee.last_name}`,
            href: employeesShow(employee.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${employee.first_name} ${employee.last_name}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {employee.first_name} {employee.last_name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {employee.employee_code} -{' '}
                                {employee.designation.title} -{' '}
                                {employee.department.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" asChild>
                            <Link href={employeesIndex().url}>
                                <ArrowLeft className="mr-1 size-4" />
                                Back
                            </Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href={employeesEdit(employee.id).url}>
                                <Edit className="mr-1 size-4" />
                                Edit Employee
                            </Link>
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-10">
                        <TabsTrigger
                            value="overview"
                            className="cursor-pointer"
                        >
                            <User className="mr-2 size-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="personal"
                            className="cursor-pointer"
                        >
                            <User className="mr-2 size-4" />
                            Personal
                        </TabsTrigger>
                        <TabsTrigger value="job" className="cursor-pointer">
                            <Briefcase className="mr-2 size-4" />
                            Job
                        </TabsTrigger>
                        <TabsTrigger value="salary" className="cursor-pointer">
                            <DollarSign className="mr-2 size-4" />
                            Salary
                        </TabsTrigger>
                        <TabsTrigger
                            value="contacts"
                            className="cursor-pointer"
                        >
                            <Phone className="mr-2 size-4" />
                            Contacts
                        </TabsTrigger>
                        <TabsTrigger
                            value="documents"
                            className="cursor-pointer"
                        >
                            <FileText className="mr-2 size-4" />
                            Documents
                        </TabsTrigger>
                        <TabsTrigger value="notes" className="cursor-pointer">
                            <StickyNote className="mr-2 size-4" />
                            Notes
                        </TabsTrigger>
                        <TabsTrigger
                            value="attendance"
                            className="cursor-pointer"
                        >
                            <Calendar className="mr-2 size-4" />
                            Attendance
                        </TabsTrigger>
                        <TabsTrigger value="leaves" className="cursor-pointer">
                            <Plane className="mr-2 size-4" />
                            Leaves
                        </TabsTrigger>
                        <TabsTrigger value="custom" className="cursor-pointer">
                            <Settings className="mr-2 size-4" />
                            Custom
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Employee Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Employee Code
                                            </label>
                                            <p className="text-sm font-medium">
                                                {employee.employee_code}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Status
                                            </label>
                                            <div className="mt-1">
                                                <Badge
                                                    className={`text-[13px] ${
                                                        employee.employment_status ===
                                                        'on_leave'
                                                            ? 'border-rose-200 bg-rose-100 text-rose-800 hover:bg-rose-200'
                                                            : ''
                                                    }`}
                                                    variant={
                                                        employee.employment_status ===
                                                        'active'
                                                            ? 'default'
                                                            : employee.employment_status ===
                                                                'inactive'
                                                              ? 'secondary'
                                                              : employee.employment_status ===
                                                                  'on_leave'
                                                                ? 'outline'
                                                                : 'destructive'
                                                    }
                                                >
                                                    {employee.employment_status ===
                                                    'inactive'
                                                        ? 'InActive'
                                                        : employee.employment_status
                                                              .split('_')
                                                              .map(
                                                                  (word) =>
                                                                      word
                                                                          .charAt(
                                                                              0,
                                                                          )
                                                                          .toUpperCase() +
                                                                      word.slice(
                                                                          1,
                                                                      ),
                                                              )
                                                              .join(' ')}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Basic Info Section */}
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Full Name
                                                </label>
                                                <p className="text-sm font-medium">
                                                    {employee.first_name}{' '}
                                                    {employee.last_name}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Email
                                                </label>
                                                <p className="text-sm font-medium">
                                                    {employee.email}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Phone
                                                </label>
                                                <p className="text-sm font-medium">
                                                    {employee.phone ||
                                                        'Not provided'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Photo Section */}
                                        {employee.photo_url && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Photo
                                                </label>
                                                <div className="mt-2">
                                                    <div className="group relative w-fit">
                                                        <img
                                                            src={
                                                                employee.photo_url
                                                            }
                                                            alt={`${employee.first_name} ${employee.last_name}`}
                                                            className="size-30 cursor-pointer rounded-lg transition-opacity hover:opacity-80"
                                                            onClick={() =>
                                                                setSelectedPhoto(
                                                                    {
                                                                        url: employee.photo_url!,
                                                                        name: `${employee.first_name} ${employee.last_name}`,
                                                                    },
                                                                )
                                                            }
                                                        />
                                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <Image className="size-8 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Employment Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Department
                                            </label>
                                            <p className="text-sm font-medium">
                                                {employee.department.name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Designation
                                            </label>
                                            <p className="text-sm font-medium">
                                                {employee.designation.title}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Employment Type
                                            </label>
                                            <p className="text-sm font-medium capitalize">
                                                {employee.employment_type.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Joining Date
                                            </label>
                                            <p className="text-sm font-medium">
                                                {new Date(
                                                    employee.joining_date,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Personal Details Tab */}
                    <TabsContent value="personal" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {employee.personal_detail ? (
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Date of Birth
                                            </label>
                                            <p className="text-sm font-medium">
                                                {new Date(
                                                    employee.personal_detail.date_of_birth,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Gender
                                            </label>
                                            <p className="text-sm font-medium capitalize">
                                                {
                                                    employee.personal_detail
                                                        .gender
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Marital Status
                                            </label>
                                            <p className="text-sm font-medium capitalize">
                                                {
                                                    employee.personal_detail
                                                        .marital_status
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Blood Group
                                            </label>
                                            <p className="text-sm font-medium">
                                                {
                                                    employee.personal_detail
                                                        .blood_group
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                National ID
                                            </label>
                                            <p className="text-sm font-medium">
                                                {
                                                    employee.personal_detail
                                                        .national_id
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Passport Number
                                            </label>
                                            <p className="text-sm font-medium">
                                                {employee.personal_detail
                                                    .passport_number ||
                                                    'Not provided'}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Address
                                            </label>
                                            <p className="text-sm font-medium">
                                                {
                                                    employee.personal_detail
                                                        .address
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                City
                                            </label>
                                            <p className="text-sm font-medium">
                                                {employee.personal_detail.city}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Country
                                            </label>
                                            <p className="text-sm font-medium">
                                                {
                                                    employee.personal_detail
                                                        .country
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No personal details available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Job Details Tab */}
                    <TabsContent value="job" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {employee.job_detail ? (
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Job Title
                                            </label>
                                            <p className="text-sm font-medium">
                                                {employee.job_detail.job_title}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Employment Type
                                            </label>
                                            <p className="text-sm font-medium capitalize">
                                                {employee.job_detail.employment_type.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Work Shift
                                            </label>
                                            <p className="text-sm font-medium capitalize">
                                                {employee.job_detail.work_shift}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Probation End Date
                                            </label>
                                            <p className="text-sm font-medium">
                                                {employee.job_detail
                                                    .probation_end_date
                                                    ? new Date(
                                                          employee.job_detail.probation_end_date,
                                                      ).toLocaleDateString()
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Contract End Date
                                            </label>
                                            <p className="text-sm font-medium">
                                                {employee.job_detail
                                                    .contract_end_date
                                                    ? new Date(
                                                          employee.job_detail.contract_end_date,
                                                      ).toLocaleDateString()
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No job details available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Salary Details Tab */}
                    <TabsContent value="salary" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Salary Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {employee.salary_detail ? (
                                    <div className="space-y-6">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Basic Salary
                                                </label>
                                                <p className="text-sm font-medium">
                                                    $
                                                    {employee.salary_detail.basic_salary.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Allowances
                                                </label>
                                                <p className="text-sm font-medium">
                                                    $
                                                    {employee.salary_detail.allowances.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Deductions
                                                </label>
                                                <p className="text-sm font-medium">
                                                    $
                                                    {employee.salary_detail.deductions.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Net Salary
                                                </label>
                                                <p className="text-lg font-bold">
                                                    $
                                                    {employee.salary_detail.net_salary.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Bank Name
                                                </label>
                                                <p className="text-sm font-medium">
                                                    {
                                                        employee.salary_detail
                                                            .bank_name
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Account Number
                                                </label>
                                                <p className="text-sm font-medium">
                                                    {
                                                        employee.salary_detail
                                                            .bank_account_number
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Bank Branch
                                                </label>
                                                <p className="text-sm font-medium">
                                                    {
                                                        employee.salary_detail
                                                            .bank_branch
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Tax ID
                                                </label>
                                                <p className="text-sm font-medium">
                                                    {
                                                        employee.salary_detail
                                                            .tax_id
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No salary details available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Contacts Tab */}
                    <TabsContent value="contacts" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Emergency Contacts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {employee.contacts &&
                                employee.contacts.length > 0 ? (
                                    <div className="space-y-4">
                                        {employee.contacts.map((contact) => (
                                            <div
                                                key={contact.id}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="flex items-start gap-3">
                                                    {contact.photo_url && (
                                                        <div className="group relative">
                                                            <img
                                                                src={
                                                                    contact.photo_url
                                                                }
                                                                alt={
                                                                    contact.contact_name
                                                                }
                                                                className="size-20 cursor-pointer rounded-full border object-cover transition-opacity hover:opacity-80"
                                                                onClick={() =>
                                                                    setSelectedPhoto(
                                                                        {
                                                                            url: contact.photo_url!,
                                                                            name: contact.contact_name,
                                                                        },
                                                                    )
                                                                }
                                                            />
                                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                                                <Image className="size-6 text-white" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold">
                                                            {
                                                                contact.contact_name
                                                            }
                                                            {contact.is_primary && (
                                                                <Badge
                                                                    className="ml-2"
                                                                    variant="default"
                                                                >
                                                                    Primary
                                                                </Badge>
                                                            )}
                                                        </h4>
                                                        <div className="grid gap-2 text-sm md:grid-cols-2">
                                                            <div>
                                                                <span className="text-muted-foreground">
                                                                    Relationship:
                                                                </span>{' '}
                                                                <span className="capitalize">
                                                                    {
                                                                        contact.relationship
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">
                                                                    Phone:
                                                                </span>{' '}
                                                                {contact.phone}
                                                            </div>
                                                            {contact.email && (
                                                                <div className="md:col-span-2">
                                                                    <span className="text-muted-foreground">
                                                                        Email:
                                                                    </span>{' '}
                                                                    {
                                                                        contact.email
                                                                    }
                                                                </div>
                                                            )}
                                                            <div className="md:col-span-2">
                                                                <span className="text-muted-foreground">
                                                                    Address:
                                                                </span>{' '}
                                                                {
                                                                    contact.address
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No contacts available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Documents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {employee.documents &&
                                employee.documents.length > 0 ? (
                                    <div className="space-y-2">
                                        {employee.documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="flex items-center justify-between rounded-lg border p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="size-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {doc.title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            <Badge
                                                                variant="outline"
                                                                className="mr-2"
                                                            >
                                                                {doc.doc_type}
                                                            </Badge>
                                                            {doc.file_name} •{' '}
                                                            {(
                                                                doc.file_size /
                                                                1024
                                                            ).toFixed(2)}{' '}
                                                            KB
                                                            {doc.expiry_date && (
                                                                <>
                                                                    {' '}
                                                                    • Expires:{' '}
                                                                    {new Date(
                                                                        doc.expiry_date,
                                                                    ).toLocaleDateString()}
                                                                </>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No documents available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notes Tab */}
                    <TabsContent value="notes" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {employee.notes && employee.notes.length > 0 ? (
                                    <div className="space-y-4">
                                        {employee.notes.map((note) => (
                                            <div
                                                key={note.id}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="mb-2 flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <div className="flex gap-2">
                                                            <Badge variant="outline">
                                                                {note.category}
                                                            </Badge>
                                                            {note.is_private && (
                                                                <Badge variant="secondary">
                                                                    Private
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            By{' '}
                                                            {note.creator.name}{' '}
                                                            •{' '}
                                                            {new Date(
                                                                note.created_at,
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm">
                                                    {note.note}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No notes available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Attendance Tab */}
                    <TabsContent value="attendance" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Attendance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {employee.attendance &&
                                employee.attendance.length > 0 ? (
                                    <div className="space-y-2">
                                        {employee.attendance.map((att) => (
                                            <div
                                                key={att.id}
                                                className="flex items-center justify-between rounded-lg border p-3"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="min-w-24">
                                                        <p className="font-medium">
                                                            {new Date(
                                                                att.date,
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Badge
                                                            variant={
                                                                att.status ===
                                                                'present'
                                                                    ? 'default'
                                                                    : att.status ===
                                                                        'late'
                                                                      ? 'secondary'
                                                                      : 'destructive'
                                                            }
                                                        >
                                                            {att.status}
                                                        </Badge>
                                                    </div>
                                                    {att.check_in && (
                                                        <div className="text-sm text-muted-foreground">
                                                            In:{' '}
                                                            {new Date(
                                                                att.check_in,
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}
                                                        </div>
                                                    )}
                                                    {att.check_out && (
                                                        <div className="text-sm text-muted-foreground">
                                                            Out:{' '}
                                                            {new Date(
                                                                att.check_out,
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No attendance records available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Leaves Tab */}
                    <TabsContent value="leaves" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Leave Records</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {employee.leaves &&
                                employee.leaves.length > 0 ? (
                                    <div className="space-y-4">
                                        {employee.leaves.map((leave) => (
                                            <div
                                                key={leave.id}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2">
                                                            <Badge
                                                                variant="outline"
                                                                className="capitalize"
                                                            >
                                                                {
                                                                    leave.leave_type
                                                                }
                                                            </Badge>
                                                            <Badge
                                                                variant={
                                                                    leave.status ===
                                                                    'approved'
                                                                        ? 'default'
                                                                        : leave.status ===
                                                                            'pending'
                                                                          ? 'secondary'
                                                                          : 'destructive'
                                                                }
                                                            >
                                                                {leave.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm font-medium">
                                                            {new Date(
                                                                leave.start_date,
                                                            ).toLocaleDateString()}{' '}
                                                            -{' '}
                                                            {new Date(
                                                                leave.end_date,
                                                            ).toLocaleDateString()}{' '}
                                                            ({leave.total_days}{' '}
                                                            day
                                                            {leave.total_days >
                                                            1
                                                                ? 's'
                                                                : ''}
                                                            )
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {leave.reason}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No leave records available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Custom Fields Tab */}
                    <TabsContent value="custom" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Custom Fields</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {employee.custom_fields &&
                                employee.custom_fields.length > 0 ? (
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {employee.custom_fields.map((field) => (
                                            <div key={field.id}>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    {field.field_key.replace(
                                                        /-/g,
                                                        ' ',
                                                    )}{' '}
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-1"
                                                    >
                                                        {field.section}
                                                    </Badge>
                                                </label>
                                                <p className="text-sm font-medium">
                                                    {field.field_value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No custom fields available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Photo Popup Dialog */}
            <Dialog
                open={selectedPhoto !== null}
                onOpenChange={(open) => !open && setSelectedPhoto(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedPhoto?.name} - Contact Photo
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center">
                        {selectedPhoto && (
                            <img
                                src={selectedPhoto.url}
                                alt={selectedPhoto.name}
                                className="max-h-96 max-w-full rounded-lg border object-contain"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
