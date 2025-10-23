import { InfoCard } from '@/components/common';
import { Separator } from '@/components/ui/separator';

interface SalaryDetail {
    basic_salary: number;
    allowances: number;
    deductions: number;
    net_salary: number;
    bank_name: string;
    bank_account_number: string;
    bank_branch: string;
    tax_id: string;
}

interface SalaryViewProps {
    salaryDetail?: SalaryDetail;
}

export function SalaryView({ salaryDetail }: SalaryViewProps) {
    return (
        <InfoCard title="Salary Information">
            {salaryDetail ? (
                <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Basic Salary
                            </label>
                            <p className="text-sm font-medium">
                                ${salaryDetail.basic_salary.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Allowances
                            </label>
                            <p className="text-sm font-medium">
                                ${salaryDetail.allowances.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Deductions
                            </label>
                            <p className="text-sm font-medium">
                                ${salaryDetail.deductions.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Net Salary
                            </label>
                            <p className="text-lg font-bold">
                                ${salaryDetail.net_salary.toLocaleString()}
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
                                {salaryDetail.bank_name}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Account Number
                            </label>
                            <p className="text-sm font-medium">
                                {salaryDetail.bank_account_number}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Bank Branch
                            </label>
                            <p className="text-sm font-medium">
                                {salaryDetail.bank_branch}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Tax ID
                            </label>
                            <p className="text-sm font-medium">
                                {salaryDetail.tax_id}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    No salary details available
                </p>
            )}
        </InfoCard>
    );
}
