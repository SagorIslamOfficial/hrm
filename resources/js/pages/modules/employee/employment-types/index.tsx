import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import {
    create as employmentTypesCreate,
    destroy as employmentTypesDestroy,
    edit as employmentTypesEdit,
    index as employmentTypesIndex,
    show as employmentTypesShow,
} from '@/routes/employment-types/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, FilePlus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface EmploymentType {
    id: string;
    name: string;
    code: string;
    description?: string;
    is_active: boolean;
    created_at: string;
}

interface Props {
    employmentTypes: EmploymentType[];
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
];

export default function Index({ employmentTypes = [] }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employmentTypeToDelete, setEmploymentTypeToDelete] =
        useState<EmploymentType | null>(null);

    const handleDeleteClick = (employmentType: EmploymentType) => {
        setEmploymentTypeToDelete(employmentType);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!employmentTypeToDelete) return;

        router.delete(employmentTypesDestroy(employmentTypeToDelete.id).url, {
            onSuccess: () => {
                toast.success(
                    `Employment type "${employmentTypeToDelete.name}" has been deleted successfully.`,
                );
                setDeleteDialogOpen(false);
                setEmploymentTypeToDelete(null);
            },
            onError: () => {
                toast.error(
                    'Failed to delete employment type. Please try again.',
                );
            },
        });
    };

    const columns: ColumnDef<EmploymentType>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <Link
                    href={employmentTypesShow(row.original.id).url}
                    className="font-medium text-blue-600 hover:text-amber-600"
                >
                    {row.getValue('name')}
                </Link>
            ),
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => (
                <code className="rounded bg-muted px-1 py-0.5 text-sm">
                    {row.getValue('code')}
                </code>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => (
                <div className="max-w-xs truncate">
                    {row.getValue('description') || 'No description'}
                </div>
            ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.getValue('is_active') as boolean;
                return (
                    <Badge variant={isActive ? 'default' : 'secondary'}>
                        {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const employmentType = row.original;
                return (
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link
                                href={
                                    employmentTypesShow(employmentType.id).url
                                }
                            >
                                <Eye className="size-4" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link
                                href={
                                    employmentTypesEdit(employmentType.id).url
                                }
                            >
                                <Pencil className="size-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(employmentType)}
                            className="cursor-pointer text-destructive hover:text-destructive"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employment Types" />

            <div className="mx-auto flex h-full w-11/12 flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Employment Types</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage employment type configurations
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" asChild>
                            <Link href={employmentTypesCreate().url}>
                                <FilePlus className="mr-1 size-4" />
                                Add Employment Type
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {employmentTypes.length === 0 ? (
                        <div className="flex h-24 flex-col items-center justify-center space-y-2">
                            <PlaceholderPattern className="size-12 stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            <p className="text-sm text-muted-foreground">
                                No employment types found
                            </p>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={employmentTypes}
                            searchPlaceholder="Search employment types..."
                        />
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Employment Type
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{employmentTypeToDelete?.name}</strong>?
                            This action cannot be undone and may affect existing
                            employees.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>
                            Delete Employment Type
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
