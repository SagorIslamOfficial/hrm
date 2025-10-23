import { InfoCard } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Image } from 'lucide-react';

interface Employee {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
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
}

interface OverviewViewProps {
    employee: Employee;
    onPhotoClick: (photo: { url: string; name: string }) => void;
}

export function OverviewView({ employee, onPhotoClick }: OverviewViewProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Employee Information">
                <div className="space-y-4">
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
                                        employee.employment_status === 'active'
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
                                    {employee.employment_status === 'inactive'
                                        ? 'InActive'
                                        : employee.employment_status
                                              .split('_')
                                              .map(
                                                  (word) =>
                                                      word
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                      word.slice(1),
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
                                    {employee.first_name} {employee.last_name}
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
                                    {employee.phone || 'Not provided'}
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
                                            src={employee.photo_url}
                                            alt={`${employee.first_name} ${employee.last_name}`}
                                            className="size-30 cursor-pointer rounded-lg transition-opacity hover:opacity-80"
                                            onClick={() =>
                                                onPhotoClick({
                                                    url: employee.photo_url!,
                                                    name: `${employee.first_name} ${employee.last_name}`,
                                                })
                                            }
                                        />
                                        <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Image className="size-6 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </InfoCard>

            <InfoCard title="Employment Details">
                <div className="space-y-4">
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
                                {employee.employment_type.replace('_', ' ')}
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
                </div>
            </InfoCard>
        </div>
    );
}
