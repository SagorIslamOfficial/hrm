import { NumberField, TextField } from '@/components/common';

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

export function SalaryTab({ data, setData }: SalaryTabProps) {
    // Helper function to update nested salary_detail object
    const updateSalaryDetail = (field: string, value: string | number) => {
        setData('salary_detail', {
            ...data.salary_detail,
            [field]: value,
        });
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Salary Field */}
            <NumberField
                id="basic_salary"
                label="Basic Salary"
                required
                value={data.salary_detail.basic_salary}
                onChange={(value) => updateSalaryDetail('basic_salary', value)}
                placeholder="e.g., 50000"
                min={0}
            />

            {/* Allowances Field */}
            <NumberField
                id="allowances"
                label="Allowances"
                value={data.salary_detail.allowances}
                onChange={(value) => updateSalaryDetail('allowances', value)}
                placeholder="e.g., 10000"
                min={0}
            />

            {/* Deductions Field */}
            <NumberField
                id="deductions"
                label="Deductions"
                value={data.salary_detail.deductions}
                onChange={(value) => updateSalaryDetail('deductions', value)}
                placeholder="e.g., 5000"
                min={0}
            />

            {/* Net Salary Field */}
            <NumberField
                id="net_salary"
                label="Net Salary"
                value={data.salary_detail.net_salary}
                onChange={(value) => updateSalaryDetail('net_salary', value)}
                placeholder="e.g., 55000"
                min={0}
            />

            {/* Bank Name Field */}
            <TextField
                id="bank_name"
                label="Bank Name"
                value={data.salary_detail.bank_name}
                onChange={(value) => updateSalaryDetail('bank_name', value)}
                placeholder="e.g., BRAC Bank"
            />

            {/* Bank Account Number Field */}
            <TextField
                id="bank_account_number"
                label="Bank Account Number"
                value={data.salary_detail.bank_account_number}
                onChange={(value) =>
                    updateSalaryDetail('bank_account_number', value)
                }
                placeholder="e.g., 0123456789"
            />

            {/* Bank Branch Field */}
            <TextField
                id="bank_branch"
                label="Bank Branch"
                value={data.salary_detail.bank_branch}
                onChange={(value) => updateSalaryDetail('bank_branch', value)}
                placeholder="e.g., Dhanmondi Branch"
            />

            {/* Tax ID Field */}
            <TextField
                id="tax_id"
                label="Tax ID"
                value={data.salary_detail.tax_id}
                onChange={(value) => updateSalaryDetail('tax_id', value)}
                placeholder="e.g., TAX123456"
            />
        </div>
    );
}
