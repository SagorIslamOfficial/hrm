import { FormField, InfoCard } from '@/components/common';
import { SUPPORTED_CURRENCIES } from '@/config/currency';

interface SalaryTabProps {
    data: {
        salary_detail: {
            basic_salary: number | string;
            allowances: number | string;
            deductions: number | string;
            net_salary: number | string;
            bank_name: string;
            bank_account_number: string;
            bank_branch: string;
            tax_id: string;
        };
    };
    currency?: string;
    setData: (
        key: string,
        value:
            | string
            | number
            | boolean
            | File
            | null
            | Record<string, unknown>,
    ) => void;
}

export function SalaryEdit({ data, setData, currency }: SalaryTabProps) {
    // Helper function to update nested salary_detail object
    const updateSalaryDetail = (field: string, value: string | number) => {
        const updatedDetail = {
            ...data.salary_detail,
            [field]: value,
        };

        // Auto-calculate net salary when basic, allowances, or deductions change
        if (
            field === 'basic_salary' ||
            field === 'allowances' ||
            field === 'deductions'
        ) {
            const basicSalary =
                field === 'basic_salary'
                    ? Number(value)
                    : Number(updatedDetail.basic_salary);
            const allowances =
                field === 'allowances'
                    ? Number(value)
                    : Number(updatedDetail.allowances);
            const deductions =
                field === 'deductions'
                    ? Number(value)
                    : Number(updatedDetail.deductions);

            updatedDetail.net_salary = basicSalary + allowances - deductions;
        }

        setData('salary_detail', updatedDetail);
    };

    const handleCurrencyChange = (newCurrency: string) => {
        setData('currency', newCurrency);
    };

    return (
        <InfoCard title="Salary & Banking Details">
            <div className="grid gap-6 md:grid-cols-2">
                <FormField
                    type="combobox"
                    id="currency"
                    label="Currency"
                    required
                    value={currency || ''}
                    onChange={handleCurrencyChange}
                    options={SUPPORTED_CURRENCIES.map((curr) => ({
                        value: curr.code,
                        label: `${curr.code} - ${curr.name}`,
                    }))}
                    searchPlaceholder="Search currencies..."
                    emptyText="No currency found."
                />

                <FormField
                    type="number"
                    id="basic_salary"
                    label="Basic Salary"
                    required
                    value={data.salary_detail.basic_salary}
                    onChange={(value) =>
                        updateSalaryDetail('basic_salary', value)
                    }
                    placeholder="e.g., 50000"
                    min={0}
                />

                <FormField
                    type="number"
                    id="allowances"
                    label="Allowances"
                    value={data.salary_detail.allowances}
                    onChange={(value) =>
                        updateSalaryDetail('allowances', value)
                    }
                    placeholder="e.g., 10000"
                    min={0}
                />

                <FormField
                    type="number"
                    id="deductions"
                    label="Deductions"
                    value={data.salary_detail.deductions}
                    onChange={(value) =>
                        updateSalaryDetail('deductions', value)
                    }
                    placeholder="e.g., 5000"
                    min={0}
                />

                <FormField
                    type="number"
                    id="net_salary"
                    label="Net Salary"
                    value={data.salary_detail.net_salary}
                    onChange={(value) =>
                        updateSalaryDetail('net_salary', value)
                    }
                    placeholder="e.g., 55000"
                    min={0}
                    disabled
                />

                <FormField
                    type="text"
                    id="bank_name"
                    label="Bank Name"
                    value={data.salary_detail.bank_name}
                    onChange={(value: string) =>
                        updateSalaryDetail('bank_name', value)
                    }
                    placeholder="e.g., BRAC Bank"
                />

                <FormField
                    type="text"
                    id="bank_account_number"
                    label="Bank Account Number"
                    value={data.salary_detail.bank_account_number}
                    onChange={(value: string) =>
                        updateSalaryDetail('bank_account_number', value)
                    }
                    placeholder="e.g., 0123456789"
                />

                <FormField
                    type="text"
                    id="bank_branch"
                    label="Bank Branch"
                    value={data.salary_detail.bank_branch}
                    onChange={(value: string) =>
                        updateSalaryDetail('bank_branch', value)
                    }
                    placeholder="e.g., Dhanmondi Branch"
                />

                <FormField
                    type="text"
                    id="tax_id"
                    label="Tax ID"
                    value={data.salary_detail.tax_id}
                    onChange={(value: string) =>
                        updateSalaryDetail('tax_id', value)
                    }
                    placeholder="e.g., TAX123456"
                />
            </div>
        </InfoCard>
    );
}
