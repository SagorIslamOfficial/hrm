import { FormField } from '@/components/common';

interface Department {
    name: string;
    code?: string;
    description?: string;
    location?: string;
    budget?: number;
    status: string;
    manager_id?: string;
}

interface Employee {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface Props {
    data: Department;
    errors: Record<string, string>;
    setData: (key: string, value: string | number | boolean) => void;
    employees: Employee[];
}

export function BasicEdit({ data, errors, setData, employees }: Props) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <FormField
                type="text"
                id="name"
                label="Department Name"
                value={data.name}
                onChange={(value: string) => setData('name', value)}
                error={errors.name}
                required
                placeholder="Enter department name (e.g., Engineering)"
            />

            <FormField
                type="text"
                id="code"
                label="Department Code"
                value={data.code || ''}
                onChange={(value: string) => setData('code', value)}
                error={errors.code}
                required
                placeholder="Enter department code (e.g., ENG, HR, IT)"
            />

            <FormField
                type="combobox"
                id="manager_id"
                label="Manager"
                required
                value={data.manager_id || ''}
                onChange={(value: string) => setData('manager_id', value)}
                error={errors.manager_id}
                options={employees.map((employee) => ({
                    value: employee.id,
                    label: `${employee.first_name} ${employee.last_name}`,
                }))}
                searchPlaceholder="Search managers..."
                emptyText="No managers found."
            />

            <FormField
                type="number"
                id="budget"
                label="Budget"
                value={data.budget ? String(data.budget) : ''}
                onChange={(value: string | number) =>
                    setData('budget', String(value))
                }
                error={errors.budget}
                placeholder="Enter budget amount (e.g., 50000)"
                min={0}
                step={0.01}
            />

            <FormField
                type="text"
                id="location"
                label="Location"
                value={data.location || ''}
                onChange={(value: string) => setData('location', value)}
                error={errors.location}
                placeholder="Enter location (e.g., Building A, Floor 2)"
            />

            <FormField
                type="select"
                id="status"
                label="Status"
                required
                value={data.status}
                onChange={(value: string) => setData('status', value)}
                error={errors.status}
                options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'InActive' },
                ]}
            />

            <div className="md:col-span-2">
                <FormField
                    type="textarea"
                    id="description"
                    label="Description"
                    value={data.description || ''}
                    onChange={(value: string) => setData('description', value)}
                    error={errors.description}
                    placeholder="Enter department description (optional)"
                    rows={3}
                />
            </div>
        </div>
    );
}
