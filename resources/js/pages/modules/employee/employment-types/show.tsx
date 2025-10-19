import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import {
    edit as employmentTypesEdit,
    index as employmentTypesIndex,
} from '@/routes/employment-types/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit, FileText, MoveLeft } from 'lucide-react';

interface EmploymentType {
    id: string;
    name: string;
    code: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    employees_count?: number;
}

interface Props {
    employmentType: EmploymentType;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: '/dashboard/employees',
    },
    {
        title: 'Employment Types',
        href: employmentTypesIndex().url,
    },
    {
        title: 'View Employment Type',
        href: '', // Will be set dynamically
    },
];

export default function Show({ employmentType }: Props) {
    // Update breadcrumb with actual employment type name
    breadcrumbs[2] = {
        title: employmentType.name,
        href: '', // Current page
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={employmentType.name} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {employmentType.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Employment type details and information
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" asChild>
                            <Link href={employmentTypesIndex().url}>
                                <MoveLeft className="mr-1 size-4" />
                                Back
                            </Link>
                        </Button>

                        <Button size="sm" asChild>
                            <Link
                                href={
                                    employmentTypesEdit(employmentType.id).url
                                }
                            >
                                <Edit className="mr-2 size-3" />
                                Edit Type
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card
                            className="h-[stretch]"
                            style={{ height: '-webkit-fill-available' }}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="size-5" />
                                    Employment Type Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">
                                            Name
                                        </h3>
                                        <p className="text-lg font-semibold">
                                            {employmentType.name}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">
                                            Code
                                        </h3>
                                        <p className="text-lg font-semibold">
                                            <code className="rounded bg-muted px-2 py-1 text-sm">
                                                {employmentType.code}
                                            </code>
                                        </p>
                                    </div>
                                </div>

                                {employmentType.description && (
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">
                                            Description
                                        </h3>
                                        <p className="text-sm leading-relaxed">
                                            {employmentType.description}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">
                                            Status
                                        </h3>
                                        <div className="mt-1">
                                            <Badge
                                                variant={
                                                    employmentType.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {employmentType.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">
                                            Employees
                                        </h3>
                                        <p className="text-lg font-semibold">
                                            {employmentType.employees_count ??
                                                0}{' '}
                                            employees
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card
                            className="h-[stretch]"
                            style={{ height: '-webkit-fill-available' }}
                        >
                            <CardHeader>
                                <CardTitle>Timestamps</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Created
                                    </h3>
                                    <p className="text-sm">
                                        {new Date(
                                            employmentType.created_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Last Updated
                                    </h3>
                                    <p className="text-sm">
                                        {new Date(
                                            employmentType.updated_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
