import { FormField, InfoCard } from '@/components/common';
import {
    type BasicEditData,
    type BranchOption,
    type BranchType,
    type Employee,
} from '@/types/branch';

interface BasicProps {
    data: Partial<BasicEditData>;
    errors: Record<string, string>;
    setData: (key: string, value: string | number | boolean | null) => void;
    employees: Employee[];
    branches: BranchOption[];
    branchTypes: BranchType[];
}

export function BasicEdit({
    data,
    errors,
    setData,
    employees,
    branches,
    branchTypes,
}: BasicProps) {
    return (
        <>
            <InfoCard title="Basic Information">
                <div className="grid gap-6 md:grid-cols-3">
                    <FormField
                        type="text"
                        id="name"
                        label="Branch Name"
                        value={data.name || ''}
                        onChange={(value: string) => setData('name', value)}
                        error={errors.name}
                        required
                        placeholder="Enter branch name (e.g., Headquarters)"
                    />

                    <FormField
                        type="text"
                        id="code"
                        label="Branch Code"
                        value={data.code || ''}
                        onChange={(value: string) => setData('code', value)}
                        error={errors.code}
                        required
                        placeholder="Enter branch code (e.g., HQ001)"
                    />

                    <FormField
                        type="select"
                        id="type"
                        label="Branch Type"
                        required
                        value={data.type || ''}
                        onChange={(value: string) => setData('type', value)}
                        error={errors.type}
                        options={branchTypes}
                    />

                    <FormField
                        type="select"
                        id="status"
                        label="Status"
                        required
                        value={data.status || ''}
                        onChange={(value: string) => setData('status', value)}
                        error={errors.status}
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                            {
                                value: 'under_construction',
                                label: 'Under Construction',
                            },
                            { value: 'closed', label: 'Closed' },
                        ]}
                    />

                    <FormField
                        type="combobox"
                        id="parent_id"
                        label="Parent Branch"
                        value={data.parent_id || ''}
                        onChange={(value: string) =>
                            setData('parent_id', value || null)
                        }
                        error={errors.parent_id}
                        options={branches.map((branch) => ({
                            value: branch.id,
                            label: `${branch.name} (${branch.code})`,
                        }))}
                        searchPlaceholder="Search parent branch..."
                        emptyText="No branches found."
                    />

                    <FormField
                        type="combobox"
                        id="manager_id"
                        label="Branch Manager"
                        value={data.manager_id || ''}
                        onChange={(value: string) =>
                            setData('manager_id', value || null)
                        }
                        error={errors.manager_id}
                        options={employees.map((employee) => ({
                            value: employee.id,
                            label: `${employee.first_name} ${employee.last_name} (${employee.employee_code})`,
                        }))}
                        searchPlaceholder="Search managers..."
                        emptyText="No employees found."
                    />

                    <div className="md:col-span-3">
                        <FormField
                            type="textarea"
                            id="description"
                            label="Description"
                            value={data.description || ''}
                            onChange={(value: string) =>
                                setData('description', value)
                            }
                            error={errors.description}
                            placeholder="Enter branch description (optional)"
                            rows={3}
                        />
                    </div>
                </div>
            </InfoCard>

            <InfoCard title="Location Information">
                <div className="grid gap-6 md:grid-cols-3">
                    <FormField
                        type="text"
                        id="address_line_1"
                        label="Address Line 1"
                        value={data.address_line_1 || ''}
                        onChange={(value: string) =>
                            setData('address_line_1', value)
                        }
                        error={errors.address_line_1}
                        placeholder="Street address"
                    />

                    <FormField
                        type="text"
                        id="address_line_2"
                        label="Address Line 2"
                        value={data.address_line_2 || ''}
                        onChange={(value: string) =>
                            setData('address_line_2', value)
                        }
                        error={errors.address_line_2}
                        placeholder="Apartment, suite, unit, etc. (optional)"
                    />

                    <FormField
                        type="text"
                        id="city"
                        label="City"
                        value={data.city || ''}
                        onChange={(value: string) => setData('city', value)}
                        error={errors.city}
                        placeholder="City"
                    />

                    <FormField
                        type="text"
                        id="state"
                        label="State/Province"
                        value={data.state || ''}
                        onChange={(value: string) => setData('state', value)}
                        error={errors.state}
                        placeholder="State or province"
                    />

                    <FormField
                        type="text"
                        id="country"
                        label="Country"
                        value={data.country || ''}
                        onChange={(value: string) => setData('country', value)}
                        error={errors.country}
                        placeholder="Country"
                    />

                    <FormField
                        type="text"
                        id="postal_code"
                        label="Postal Code"
                        value={data.postal_code || ''}
                        onChange={(value: string) =>
                            setData('postal_code', value)
                        }
                        error={errors.postal_code}
                        placeholder="Postal/ZIP code"
                    />

                    <FormField
                        type="text"
                        id="timezone"
                        label="Timezone"
                        value={data.timezone || ''}
                        onChange={(value: string) => setData('timezone', value)}
                        error={errors.timezone}
                        placeholder="e.g., Asia/Dhaka"
                    />
                </div>
            </InfoCard>

            <InfoCard title="Contact & Operational Information">
                <div className="grid gap-6 md:grid-cols-3">
                    <FormField
                        type="tel"
                        id="phone"
                        label="Phone"
                        value={data.phone || ''}
                        onChange={(value: string) => setData('phone', value)}
                        error={errors.phone}
                        placeholder="e.g., +880 2 9876543"
                    />

                    <FormField
                        type="tel"
                        id="phone_2"
                        label="Phone 2"
                        value={data.phone_2 || ''}
                        onChange={(value: string) => setData('phone_2', value)}
                        error={errors.phone_2}
                        placeholder="e.g., +880 1700000000"
                    />

                    <FormField
                        type="email"
                        id="email"
                        label="Email"
                        value={data.email || ''}
                        onChange={(value: string) => setData('email', value)}
                        error={errors.email}
                        placeholder="e.g., branch@company.com"
                    />

                    <FormField
                        type="date"
                        id="opening_date"
                        label="Opening Date"
                        value={data.opening_date || ''}
                        onChange={(value: string) =>
                            setData('opening_date', value)
                        }
                        error={errors.opening_date}
                    />

                    <FormField
                        type="number"
                        id="max_employees"
                        label="Maximum Employees"
                        value={
                            data.max_employees ? String(data.max_employees) : ''
                        }
                        onChange={(value: string | number) =>
                            setData('max_employees', Number(value))
                        }
                        error={errors.max_employees}
                        placeholder="e.g., 500"
                        min={0}
                    />

                    <FormField
                        type="number"
                        id="budget"
                        label="Budget"
                        value={data.budget ? String(data.budget) : ''}
                        onChange={(value: string | number) =>
                            setData('budget', Number(value))
                        }
                        error={errors.budget}
                        placeholder="e.g., 10000000"
                        min={0}
                        step={0.01}
                    />

                    <FormField
                        type="text"
                        id="cost_center"
                        label="Cost Center"
                        value={data.cost_center || ''}
                        onChange={(value: string) =>
                            setData('cost_center', value)
                        }
                        error={errors.cost_center}
                        placeholder="e.g., CC-HQ-001"
                    />

                    <FormField
                        type="text"
                        id="tax_registration_number"
                        label="Tax Registration Number"
                        value={data.tax_registration_number || ''}
                        onChange={(value: string) =>
                            setData('tax_registration_number', value)
                        }
                        error={errors.tax_registration_number}
                        placeholder="e.g., TIN-12345678901"
                    />
                </div>
            </InfoCard>
        </>
    );
}
