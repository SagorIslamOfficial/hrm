import { InfoCard, MembersDrawer } from '@/components/common';
import DetailRow from '@/components/common/DetailRow';
import { formatDateTimeForDisplay } from '@/components/common/utils/dateUtils';
import { titleCase } from '@/components/common/utils/formatUtils';
import { Separator } from '@/components/ui/separator';
import { getCurrencySymbol } from '@/config/currency';
import { useCurrency } from '@/hooks/useCurrency';
import { type Branch } from '@/types/branch';
import { useState } from 'react';

interface OverviewViewProps {
    branch: Branch;
    stats?: {
        allocated_budget?: number;
        remaining_budget?: number;
    };
}

export function OverviewView({ branch, stats }: OverviewViewProps) {
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const currency = useCurrency();

    const formatAmountOnly = (amount: number) => {
        const num = Number(amount ?? 0);
        const hasFraction = !Number.isInteger(num) && !Number.isNaN(num);
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: hasFraction ? 2 : 0,
            maximumFractionDigits: hasFraction ? 2 : 0,
        }).format(num);
    };

    const handleEmployeesClick = () => {
        setIsMembersModalOpen(true);
    };

    const handleManagerClick = () => {
        setIsMembersModalOpen(true);
    };

    const formatBranchType = (type: string) => titleCase(type);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Branch Information">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow label="Branch Name" value={branch.name} />

                        <DetailRow label="Status" statusValue={branch.status} />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow label="Code" value={branch.code} />

                        <DetailRow
                            label="Type"
                            value={formatBranchType(branch.type)}
                        />

                        <DetailRow
                            label="Employees"
                            value={
                                <button
                                    onClick={handleEmployeesClick}
                                    className="cursor-pointer text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
                                >
                                    {branch.employee_count || 0} member
                                    {branch.employee_count !== 1 ? 's' : ''}
                                </button>
                            }
                        />

                        <DetailRow
                            label="Departments"
                            value={`${branch.department_count || 0} department${branch.department_count !== 1 ? 's' : ''}`}
                        />

                        <DetailRow
                            label="Manager"
                            value={
                                branch.manager ? (
                                    <button
                                        onClick={handleManagerClick}
                                        className="cursor-pointer text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
                                    >
                                        {branch.manager.first_name}{' '}
                                        {branch.manager.last_name}
                                    </button>
                                ) : (
                                    <span className="text-muted-foreground">
                                        Not assigned
                                    </span>
                                )
                            }
                        />

                        <DetailRow
                            label="Parent Branch"
                            value={
                                branch.parent_branch
                                    ? `${branch.parent_branch.name} (${branch.parent_branch.code})`
                                    : 'None'
                            }
                        />
                    </div>
                </div>
            </InfoCard>

            <InfoCard title="Contact & Location">
                <div className="space-y-4">
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailRow label="Phone" value={branch.phone} />
                            <DetailRow label="Phone 2" value={branch.phone_2} />
                            <DetailRow label="Email" value={branch.email} />
                            <DetailRow
                                label="Timezone"
                                value={branch.timezone || 'UTC'}
                            />
                        </div>

                        <DetailRow
                            label="Address"
                            value={branch.full_address || 'No address'}
                        />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow
                            label="Opening Date"
                            value={
                                branch.opening_date
                                    ? formatDateTimeForDisplay(
                                          branch.opening_date,
                                      )
                                    : 'N/A'
                            }
                        />

                        <DetailRow
                            label="Max Employees"
                            value={branch.max_employees || 'N/A'}
                        />
                    </div>
                </div>
            </InfoCard>

            <InfoCard title="Financial Information">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow
                            label="Budget"
                            value={
                                branch.budget ? (
                                    <span>
                                        {currency} {getCurrencySymbol(currency)}
                                        <span className="font-medium text-primary">
                                            {formatAmountOnly(branch.budget)}
                                        </span>
                                    </span>
                                ) : (
                                    '—'
                                )
                            }
                        />

                        <DetailRow
                            label="Allocated"
                            className="text-red-600"
                            value={`${currency} ${getCurrencySymbol(currency)}${formatAmountOnly(
                                stats?.allocated_budget ?? 0,
                            )}`}
                        />

                        <DetailRow
                            label="Remaining"
                            className="text-green-600"
                            value={`${currency} ${getCurrencySymbol(currency)}${formatAmountOnly(
                                stats?.remaining_budget ?? branch.budget ?? 0,
                            )}`}
                        />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailRow
                                label="Cost Center"
                                value={branch.cost_center || 'N/A'}
                            />

                            <DetailRow
                                label="Tax Registration Number"
                                value={branch.tax_registration_number || 'N/A'}
                            />
                        </div>

                        <DetailRow
                            label="Description"
                            value={branch.description || 'No description'}
                        />
                    </div>
                </div>
            </InfoCard>

            <InfoCard title="Hierarchy">
                <div className="space-y-4">
                    <DetailRow
                        label="Parent Branch"
                        value={
                            branch.parent_branch
                                ? `${branch.parent_branch.name} (${branch.parent_branch.code})`
                                : 'Main Branch'
                        }
                    />

                    <Separator />

                    <DetailRow
                        label="Child Branches"
                        value={
                            branch.child_branches &&
                            branch.child_branches.length > 0 ? (
                                <ul className="space-y-1">
                                    {branch.child_branches.map((child) => (
                                        <li key={child.id}>
                                            {child.name} ({child.code})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                'No child branches'
                            )
                        }
                    />

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow
                            label="Created At"
                            value={formatDateTimeForDisplay(branch.created_at)}
                        />

                        <DetailRow
                            label="Updated At"
                            value={formatDateTimeForDisplay(branch.updated_at)}
                        />
                    </div>
                </div>
            </InfoCard>

            <MembersDrawer
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
                employees={
                    branch.departments?.flatMap(
                        (dept) => dept.employees || [],
                    ) || []
                }
                manager={branch.manager}
                departmentName={branch.name}
                title="Branch Members"
                hideDepartmentBadge={true}
            />
        </div>
    );
}
