import { InfoCard, MembersDrawer } from '@/components/common';
import DetailRow from '@/components/common/DetailRow';
import { formatDateTimeForDisplay } from '@/components/common/utils/dateUtils';
import { Employee } from '@/components/modules/employee';
import { Separator } from '@/components/ui/separator';
import { getCurrencySymbol } from '@/config/currency';
import { useCurrency } from '@/hooks/useCurrency';
import { useState } from 'react';

interface Department {
    id: string;
    name: string;
    code?: string;
    description?: string;
    location?: string;
    budget?: number;
    status: string;
    manager?: Employee;
    employees?: Employee[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface OverviewViewProps {
    department: Department;
}

export function OverviewView({ department }: OverviewViewProps) {
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
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Department Information">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow
                            label="Department Name"
                            value={department.name}
                        />

                        <DetailRow
                            label="Status"
                            statusValue={department.status}
                        />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow label="Code" value={department.code} />

                        <DetailRow
                            label="Location"
                            value={department.location}
                        />

                        <DetailRow
                            label="Employees"
                            value={
                                <button
                                    onClick={handleEmployeesClick}
                                    className="cursor-pointer text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
                                >
                                    {department.employees
                                        ? `${department.employees.length} member${department.employees.length !== 1 ? 's' : ''}`
                                        : '0 members'}
                                </button>
                            }
                        />

                        <DetailRow
                            label="Manager"
                            value={
                                department.manager ? (
                                    <button
                                        onClick={handleManagerClick}
                                        className="cursor-pointer text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
                                    >
                                        {department.manager.first_name}{' '}
                                        {department.manager.last_name}
                                    </button>
                                ) : (
                                    <span className="text-muted-foreground">
                                        Not assigned
                                    </span>
                                )
                            }
                        />
                    </div>
                </div>
            </InfoCard>

            <InfoCard title="Additional Information">
                <div className="space-y-4">
                    <div className="space-y-3">
                        <DetailRow
                            label="Description"
                            value={department.description || 'No description'}
                        />
                        <DetailRow
                            label="Budget"
                            value={
                                department.budget ? (
                                    <span>
                                        {currency} {getCurrencySymbol(currency)}
                                        <span className="font-medium text-primary">
                                            {formatAmountOnly(
                                                department.budget,
                                            )}
                                        </span>
                                    </span>
                                ) : (
                                    '—'
                                )
                            }
                        />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow
                            label="Created At"
                            value={formatDateTimeForDisplay(
                                department.created_at,
                            )}
                        />

                        <DetailRow
                            label="Updated At"
                            value={formatDateTimeForDisplay(
                                department.updated_at,
                            )}
                        />
                    </div>
                </div>
            </InfoCard>

            <MembersDrawer
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
                employees={department.employees || []}
                manager={department.manager}
                departmentName={department.name}
            />
        </div>
    );
}
