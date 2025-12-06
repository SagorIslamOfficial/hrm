import {
    arrayToPaginatedData,
    DeleteDialog,
    EmptyActionState,
    PageHeader,
    PaginatedTable,
    type PaginatedData,
} from '@/components/common';
import { UseUserColumns, type User } from '@/components/modules/user';
import AppLayout from '@/layouts/app-layout';
import {
    create as usersCreate,
    destroy as usersDestroy,
    index as usersIndex,
} from '@/routes/users/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FilePlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    users: PaginatedData<User> | User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: usersIndex().url,
    },
];

export default function Index({ users }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!userToDelete) return;

        router.delete(usersDestroy(userToDelete.id).url, {
            onSuccess: () => {
                toast.success(
                    `User ${userToDelete.name} has been deleted successfully.`,
                );
                setDeleteDialogOpen(false);
                setUserToDelete(null);
            },
            onError: () => {
                toast.error('Failed to delete user. Please try again.');
            },
        });
    };

    const columns = UseUserColumns({ onDeleteClick: handleDeleteClick });

    // Handle both paginated and array data
    const paginatedData = Array.isArray(users)
        ? arrayToPaginatedData(users)
        : users;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="mx-auto flex h-full w-11/12 flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title="Users"
                    description="Manage system users and their access"
                    action={{
                        label: 'Add',
                        href: usersCreate().url,
                        icon: <FilePlus className="mr-1 size-4" />,
                    }}
                />

                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {paginatedData.data.length === 0 ? (
                        <EmptyActionState
                            message="No users found"
                            buttonText="Add User"
                            onButtonClick={() => router.get(usersCreate().url)}
                            buttonIcon={<FilePlus className="mr-1 size-4" />}
                        />
                    ) : (
                        <PaginatedTable
                            columns={columns}
                            paginatedData={paginatedData}
                            searchPlaceholder="Search users..."
                            globalSearchKeys={['name', 'email', 'roles']}
                        />
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);
                    if (!open) setUserToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete User"
                description={
                    userToDelete
                        ? `Are you sure you want to delete "${userToDelete.name}"? This action cannot be undone.`
                        : 'Are you sure you want to delete this user?'
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </AppLayout>
    );
}
