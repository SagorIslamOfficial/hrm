import { EmptyActionState, InfoCard } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/config/currency';
import { useCurrency } from '@/hooks/useCurrency';
import { show as departmentsShow } from '@/routes/departments/index';
import { type Department } from '@/types/branch';
import { Link } from '@inertiajs/react';
import {
    Building2,
    DollarSign,
    ExternalLink,
    PieChart,
    User,
    Users,
} from 'lucide-react';

interface DepartmentsViewProps {
    departments?: Department[];
    stats?: {
        budget?: number;
        allocated_budget?: number;
        remaining_budget?: number;
    };
}

export function DepartmentsView({ departments, stats }: DepartmentsViewProps) {
    const currency = useCurrency();

    return (
        <InfoCard title={`Departments (${departments?.length || 0})`}>
            {departments && departments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {departments.map((department) => (
                        <Card
                            key={department.id}
                            className="transition-shadow hover:shadow-md"
                        >
                            <CardHeader className="pb-3">
                                {/* Badges at the top */}
                                <div className="mb-2 flex gap-1">
                                    {department.pivot?.is_primary && (
                                        <Badge
                                            variant="default"
                                            className="text-xs"
                                        >
                                            Primary
                                        </Badge>
                                    )}
                                    <Badge
                                        variant={
                                            department.status === 'active'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        className="text-xs"
                                    >
                                        {department.status}
                                    </Badge>
                                </div>

                                {/* Department name with link icon */}
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg">
                                        <Link
                                            href={
                                                departmentsShow(department.id)
                                                    .url
                                            }
                                            className="transition-colors hover:text-primary"
                                        >
                                            {department.name}
                                        </Link>
                                    </CardTitle>
                                    <Link
                                        href={
                                            departmentsShow(department.id).url
                                        }
                                        className="text-muted-foreground transition-colors hover:text-primary"
                                        title="View Department Details"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
                                </div>

                                {department.code && (
                                    <p className="font-mono text-sm text-muted-foreground">
                                        {department.code}
                                    </p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Manager Info */}
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        Manager:
                                    </span>
                                    <span
                                        className={`font-medium ${department.manager ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        {department.manager
                                            ? `${department.manager.first_name} ${department.manager.last_name}`
                                            : 'Not assigned'}
                                    </span>
                                </div>

                                {/* Employee Count */}
                                {department.employee_count !== undefined && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                            {department.employee_count} employee
                                            {department.employee_count !== 1
                                                ? 's'
                                                : ''}
                                        </span>
                                    </div>
                                )}

                                {/* Budget Information */}
                                {department.pivot?.budget_allocation !==
                                    null && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Allocation:
                                            </span>
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    Number(
                                                        department.pivot
                                                            ?.budget_allocation ??
                                                            0,
                                                    ),
                                                    currency,
                                                )}
                                            </span>
                                        </div>

                                        {/* Allocation percentages */}
                                        {(() => {
                                            const pivotAlloc = Number(
                                                department.pivot
                                                    ?.budget_allocation ?? 0,
                                            );
                                            const deptBudget = Number(
                                                department.budget ?? 0,
                                            );
                                            const branchBudget = Number(
                                                stats?.budget ?? 0,
                                            );

                                            const getColorClass = (
                                                percentage: number,
                                            ) => {
                                                if (percentage > 150)
                                                    return 'text-red-600';
                                                if (percentage > 100)
                                                    return 'text-orange-600';
                                                return 'text-green-600';
                                            };

                                            return (
                                                <div className="space-y-1 text-xs">
                                                    {deptBudget > 0 &&
                                                        pivotAlloc > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <PieChart
                                                                    className={`h-3 w-3 ${getColorClass((pivotAlloc / deptBudget) * 100)}`}
                                                                />
                                                                <span
                                                                    className={getColorClass(
                                                                        (pivotAlloc /
                                                                            deptBudget) *
                                                                            100,
                                                                    )}
                                                                >
                                                                    {(
                                                                        (pivotAlloc /
                                                                            deptBudget) *
                                                                        100
                                                                    ).toFixed(
                                                                        1,
                                                                    )}
                                                                    % of
                                                                    department
                                                                    budget
                                                                </span>
                                                            </div>
                                                        )}
                                                    {branchBudget > 0 &&
                                                        pivotAlloc > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <PieChart
                                                                    className={`h-3 w-3 ${getColorClass((pivotAlloc / branchBudget) * 100)}`}
                                                                />
                                                                <span
                                                                    className={getColorClass(
                                                                        (pivotAlloc /
                                                                            branchBudget) *
                                                                            100,
                                                                    )}
                                                                >
                                                                    {(
                                                                        (pivotAlloc /
                                                                            branchBudget) *
                                                                        100
                                                                    ).toFixed(
                                                                        1,
                                                                    )}
                                                                    % of branch
                                                                    budget
                                                                </span>
                                                            </div>
                                                        )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* Department Budget */}
                                {department.budget !== undefined && (
                                    <div className="flex items-center gap-2 border-t pt-2 text-sm">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                            Dept Budget:
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(
                                                Number(department.budget),
                                                currency,
                                            )}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyActionState
                    message="No departments linked to this branch yet."
                    buttonText="Link Departments"
                />
            )}
        </InfoCard>
    );
}
