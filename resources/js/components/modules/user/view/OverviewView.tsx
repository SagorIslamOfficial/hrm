import { InfoCard, StatusBadge } from '@/components/common';
import DetailRow from '@/components/common/DetailRow';
import { type User } from '@/components/modules/user';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { show as employeesShow } from '@/routes/employees/index';
import { edit as usersEdit, show as usersShow } from '@/routes/users/index';
import { Link } from '@inertiajs/react';
import { LinkIcon, UserX } from 'lucide-react';

interface OverviewViewProps {
    user: User;
    onPhotoClick?: (url: string) => void;
}

export function OverviewView({ user }: OverviewViewProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="User Information">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow label="Name" value={user.name} />
                        <DetailRow label="Email" value={user.email} />
                    </div>

                    <Separator />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div>
                            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                                Role
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {user.roles && user.roles.length > 0 ? (
                                    <StatusBadge status={user.roles[0].name} />
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        No role assigned
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                                Status
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <StatusBadge status={user.status} />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <DetailRow
                                label="Created"
                                value={new Date(
                                    user.created_at,
                                ).toLocaleDateString()}
                            />
                            <DetailRow
                                label="Created by"
                                value={
                                    user.creator ? (
                                        <Link
                                            href={
                                                usersShow(user.creator.id).url
                                            }
                                            className="text-primary hover:underline"
                                        >
                                            {user.creator.name} (ID:{' '}
                                            {user.creator.id})
                                        </Link>
                                    ) : (
                                        'System'
                                    )
                                }
                            />
                        </div>

                        <DetailRow
                            label="Photo"
                            value={user.name}
                            imageSrc={user.photo_url || ''}
                            imageAlt={user.name}
                            imageClassName="size-30 rounded-lg"
                            showValue={false}
                        />
                    </div>
                </div>
            </InfoCard>

            <InfoCard title="Linked Employee">
                {user.employee ? (
                    <div className="space-y-4">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <DetailRow
                                label="Employee Name"
                                value={`${user.employee.first_name} ${user.employee.last_name}`}
                            />
                            <DetailRow
                                label="Employee Code"
                                value={user.employee.employee_code}
                            />
                            <DetailRow
                                label="Email"
                                value={user.employee.email || 'N/A'}
                            />
                            {user.employee.department && (
                                <DetailRow
                                    label="Department"
                                    value={user.employee.department.name}
                                />
                            )}
                            {user.employee.designation && (
                                <DetailRow
                                    label="Designation"
                                    value={user.employee.designation.title}
                                />
                            )}
                        </div>

                        <Link
                            href={employeesShow(user.employee.id).url}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            View Employee Details →
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                <UserX className="size-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    No Linked Employee
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    This user is not linked to any employee
                                    record.
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={usersEdit(user.id).url}>
                                <LinkIcon className="mr-1 h-4 w-4" />
                                Link
                            </Link>
                        </Button>
                    </div>
                )}
            </InfoCard>
        </div>
    );
}
