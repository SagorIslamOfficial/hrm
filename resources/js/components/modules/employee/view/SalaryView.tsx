import { EmptyActionState, InfoCard } from '@/components/common';
import { Separator } from '@/components/ui/separator';
import { getCurrencySymbol } from '@/config/currency';
import { useCurrency } from '@/hooks/useCurrency';

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
    currency?: string;
}

export function SalaryView({
    salaryDetail,
    currency: currencyProp,
}: SalaryViewProps) {
    const defaultCurrency = useCurrency();
    const currency = currencyProp || defaultCurrency;
    const formatAmountOnly = (amount: number) => {
        const num = Number(amount ?? 0);
        const hasFraction = !Number.isInteger(num) && !Number.isNaN(num);
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: hasFraction ? 2 : 0,
            maximumFractionDigits: hasFraction ? 2 : 0,
        }).format(num);
    };
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
                                <span className="mr-1 font-medium text-primary">
                                    {currency} {getCurrencySymbol(currency)}
                                </span>
                                <span>
                                    {formatAmountOnly(
                                        salaryDetail.basic_salary,
                                    )}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Allowances
                            </label>
                            <p className="text-sm font-medium">
                                <span className="mr-1 font-medium text-primary">
                                    {currency} {getCurrencySymbol(currency)}
                                </span>
                                <span>
                                    {formatAmountOnly(salaryDetail.allowances)}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Deductions
                            </label>
                            <p className="text-sm font-medium">
                                <span className="mr-1 font-medium text-primary">
                                    {currency} {getCurrencySymbol(currency)}
                                </span>
                                <span>
                                    {formatAmountOnly(salaryDetail.deductions)}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Net Salary
                            </label>
                            <p className="text-lg font-bold">
                                <span className="mr-1 font-medium text-primary">
                                    {currency} {getCurrencySymbol(currency)}
                                </span>
                                <span>
                                    {formatAmountOnly(salaryDetail.net_salary)}
                                </span>
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
                <EmptyActionState
                    message="Add salary details to manage employee compensation."
                    buttonText="Add Salary Details"
                />
            )}
        </InfoCard>
    );
}
