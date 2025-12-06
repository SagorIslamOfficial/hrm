import { PageHeader } from '@/components/common';
import { type User, UserShow } from '@/components/modules/user';
import AppLayout from '@/layouts/app-layout';
import {
    edit as usersEdit,
    index as usersIndex,
    show as usersShow,
} from '@/routes/users/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit } from 'lucide-react';

interface Props {
    user: User;
}

export default function Show({ user }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: usersIndex().url,
        },
        {
            title: user.name,
            href: usersShow(user.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User - ${user.name}`} />

            <div className="mx-auto flex h-full w-7xl flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                <PageHeader
                    title={user.name}
                    description="View user details and activity history"
                    backUrl={usersIndex().url}
                    backLabel="Back"
                    action={{
                        label: 'Edit',
                        href: usersEdit(user.id).url,
                        icon: <Edit className="mr-1 size-4" />,
                    }}
                />

                <UserShow
                    user={user}
                    className="rounded-xl border border-sidebar-border/70 p-6"
                />
            </div>
        </AppLayout>
    );
}
